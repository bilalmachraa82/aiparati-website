import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const APP_ID = 'd9349f7f-c9b7-4e3b-aa26-52345e2e1608';
const API_BASE = 'https://api.enablebanking.com';

const ACCOUNTS: Record<string, { uid: string; bank: string; currency: string }> = {
  millennium: { uid: '914cf112-e7ad-4875-8a88-762e6644e2d8', bank: 'Millennium BCP', currency: 'EUR' },
  revolut_eur: { uid: 'd06ebd87-c98e-459c-8dd8-0dac1b3db91c', bank: 'Revolut', currency: 'EUR' },
  revolut_usd: { uid: '40f547bf-eab5-4789-90bb-fb27c38bb570', bank: 'Revolut', currency: 'USD' },
};

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getJwtToken(): Promise<string> {
  const crypto = await import('crypto');
  const privateKey = process.env.ENABLE_BANKING_KEY!;
  const now = Math.floor(Date.now() / 1000);
  
  const header = { alg: 'RS256', kid: APP_ID, typ: 'JWT' };
  const payload = {
    iss: 'enablebanking.com',
    aud: 'api.enablebanking.com',
    iat: now,
    exp: now + 3600,
    jti: `midas-sync-${now}`,
    sub: APP_ID,
  };

  const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
  const sigInput = `${headerB64}.${payloadB64}`;
  
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(sigInput);
  const signature = base64url(sign.sign(privateKey));
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

async function apiFetch(endpoint: string, token: string) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

export async function POST() {
  try {
    const token = await getJwtToken();
    const results: any = { balances: {}, transactions: { new: 0, checked: 0 }, classified: 0, errors: [] };

    // 1. Fetch balances
    for (const [name, acc] of Object.entries(ACCOUNTS)) {
      try {
        const data = await apiFetch(`/accounts/${acc.uid}/balances`, token);
        if (data?.balances) {
          const itav = data.balances.find((b: any) => b.balance_type === 'ITAV');
          const balance = itav ? parseFloat(itav.balance_amount.amount) : 0;
          results.balances[name] = balance;
          
          await query(
            "UPDATE midas_accounts SET current_balance = $1, last_sync = NOW() WHERE bank = $2 AND currency = $3",
            [balance, acc.bank, acc.currency]
          );
        }
      } catch (e: any) {
        results.errors.push(`${name}: ${e.message?.slice(0, 100)}`);
      }
    }

    // 2. Fetch transactions from last known date
    const lastDateRes = await query(
      "SELECT MAX(date) as d FROM midas_transactions WHERE source IN ('millennium','revolut')"
    );
    const lastDate = lastDateRes.rows[0]?.d;
    const dateFrom = lastDate
      ? new Date(lastDate).toISOString().split('T')[0]
      : new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    for (const [name, acc] of Object.entries(ACCOUNTS)) {
      if (name === 'revolut_usd') continue; // Skip USD for transactions
      const source = name.startsWith('revolut') ? 'revolut' : 'millennium';
      
      try {
        const data = await apiFetch(`/accounts/${acc.uid}/transactions?date_from=${dateFrom}`, token);
        if (data?.transactions) {
          for (const tx of data.transactions) {
            results.transactions.checked++;
            const date = tx.booking_date || tx.value_date;
            const amount = parseFloat(tx.transaction_amount?.amount || '0');
            const currency = tx.transaction_amount?.currency || 'EUR';
            const desc = tx.remittance_information?.[0] || tx.creditor_name || tx.debtor_name || 'Sem descrição';
            const ref = tx.entry_reference || tx.transaction_id || '';

            if (!ref) continue;
            
            const existing = await query(
              "SELECT id FROM midas_transactions WHERE bank_reference = $1 AND source = $2 LIMIT 1",
              [ref, source]
            );

            if (existing.rows.length === 0) {
              const type = amount >= 0 ? 'income' : 'expense';
              await query(
                `INSERT INTO midas_transactions (date, description, amount, currency, type, source, bank_reference)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [date, desc, amount, currency, type, source, ref]
              );
              results.transactions.new++;
            }
          }
        }
      } catch (e: any) {
        results.errors.push(`${name}_tx: ${e.message?.slice(0, 100)}`);
      }
    }

    // 3. Auto-classify new unclassified transactions
    const rules = await query('SELECT pattern, category_id FROM midas_learning_rules');
    const uncat = await query(
      "SELECT id, description, merchant FROM midas_transactions WHERE category_id IS NULL AND source IN ('millennium','revolut')"
    );
    
    for (const tx of uncat.rows) {
      const text = `${tx.description || ''} ${tx.merchant || ''}`.toLowerCase();
      for (const rule of rules.rows) {
        if (rule.pattern && text.includes(rule.pattern.toLowerCase())) {
          await query('UPDATE midas_transactions SET category_id = $1 WHERE id = $2', [rule.category_id, tx.id]);
          results.classified++;
          break;
        }
      }
    }

    // Total balance
    const balRes = await query("SELECT COALESCE(SUM(current_balance), 0) as t FROM midas_accounts WHERE currency = 'EUR'");
    
    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      totalBalance: parseFloat(balRes.rows[0]?.t || 0),
      balances: results.balances,
      newTransactions: results.transactions.new,
      checkedTransactions: results.transactions.checked,
      autoClassified: results.classified,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
