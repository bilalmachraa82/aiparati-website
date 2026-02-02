// Vercel Serverless Function - Moloni API Proxy
// CORRIGIDO: Moloni usa GET, não POST!

const MOLONI_API = 'https://api.moloni.pt/v1';

let tokenCache = { access_token: null, expires_at: 0 };

async function getAccessToken() {
  if (tokenCache.access_token && Date.now() < tokenCache.expires_at) {
    return tokenCache.access_token;
  }

  // Moloni usa GET para autenticação!
  // Encode manual para garantir caracteres especiais
  const params = [
    'grant_type=password',
    `client_id=${encodeURIComponent(process.env.MOLONI_CLIENT_ID)}`,
    `client_secret=${encodeURIComponent(process.env.MOLONI_CLIENT_SECRET)}`,
    `username=${encodeURIComponent(process.env.MOLONI_USERNAME)}`,
    `password=${encodeURIComponent(process.env.MOLONI_PASSWORD)}`
  ].join('&');

  const response = await fetch(`${MOLONI_API}/grant/?${params}`);
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Moloni auth failed: ${data.error_description}`);
  }

  tokenCache = {
    access_token: data.access_token,
    expires_at: Date.now() + (50 * 60 * 1000)
  };

  return data.access_token;
}

async function moloniRequest(endpoint, params = {}) {
  const token = await getAccessToken();
  
  const queryParams = new URLSearchParams({
    access_token: token,
    company_id: process.env.MOLONI_EMPRESA_ID,
    ...params
  });

  // Moloni usa GET para a maioria dos endpoints
  const response = await fetch(`${MOLONI_API}/${endpoint}/?${queryParams}`);
  return response.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, ...params } = req.query;

  try {
    let data;
    
    switch (action) {
      case 'empresas':
        data = await moloniRequest('companies/getAll', {});
        break;

      case 'clientes':
        data = await moloniRequest('customers/getAll', { qty: params.qty || 100 });
        break;
        
      case 'faturas':
        data = await moloniRequest('invoices/getAll', { 
          qty: params.qty || 50,
          year: params.year || new Date().getFullYear()
        });
        break;
        
      case 'produtos':
        data = await moloniRequest('products/getAll', { qty: params.qty || 500 });
        break;
        
      case 'vendedores':
        data = await moloniRequest('salesman/getAll', {});
        break;

      case 'dashboard':
        // Tentar API live, fallback para dados estáticos
        try {
          const empresas = await moloniRequest('companies/getAll', {});
          
          // Se chegou aqui, API funciona
          data = {
            status: 'live',
            empresa: empresas[0]?.name || 'Aurora Oceano',
            timestamp: new Date().toISOString()
          };
          
          // Tentar obter mais dados (pode falhar por permissões)
          try {
            const faturas = await moloniRequest('invoices/getAll', { qty: 50 });
            if (Array.isArray(faturas)) {
              const hoje = new Date().toISOString().split('T')[0];
              const faturasHoje = faturas.filter(f => f.date?.startsWith(hoje));
              data.vendasHoje = faturasHoje.reduce((s, f) => s + (f.net_value || 0), 0);
              data.encomendasHoje = faturasHoje.length;
            }
          } catch (e) {
            data.warning = 'Permissões limitadas - alguns dados indisponíveis';
          }
          
        } catch (authError) {
          data = {
            status: 'static',
            message: 'Usando dados locais',
            error: authError.message
          };
        }
        break;
        
      case 'test':
        // Endpoint de teste
        const token = await getAccessToken();
        data = { 
          status: 'ok', 
          token_prefix: token.substring(0, 8) + '...',
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return res.status(400).json({ 
          error: 'Invalid action',
          available: ['empresas', 'clientes', 'faturas', 'produtos', 'vendedores', 'dashboard', 'test']
        });
    }

    res.status(200).json(data);
    
  } catch (error) {
    console.error('Moloni API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
