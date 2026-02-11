// Vercel Serverless Function - Moloni API Proxy
// Actualizado: 2026-02-08

const MOLONI_ACCESS_TOKEN = 'c0c87bfc87c4931d35fdfa4f19edd01f74a5b9d1';
const MOLONI_REFRESH_TOKEN = '3a86ce30c40115ca83bc536e85d311987f60bbd3';
const MOLONI_CLIENT_ID = 'auroroceanolda';
const MOLONI_CLIENT_SECRET = 'db5640005feb0d6d8f6f47c8a1ee56391e49a304';
const MOLONI_COMPANY_ID = '276603';
const MOLONI_API = 'https://api.moloni.pt/v1';

let currentToken = MOLONI_ACCESS_TOKEN;

// Auto-refresh token if expired
async function refreshToken() {
  try {
    const response = await fetch(
      `${MOLONI_API}/grant/?grant_type=refresh_token&client_id=${MOLONI_CLIENT_ID}&client_secret=${MOLONI_CLIENT_SECRET}&refresh_token=${MOLONI_REFRESH_TOKEN}`
    );
    const data = await response.json();
    if (data.access_token) {
      currentToken = data.access_token;
      console.log('Token refreshed successfully');
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  return false;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { endpoint, ...params } = req.query;
  
  if (!endpoint) {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  async function makeRequest(token) {
    const formData = new URLSearchParams();
    formData.append('company_id', MOLONI_COMPANY_ID);
    formData.append('qty', params.qty || '50');
    
    // Add any additional params
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'endpoint') {
        formData.append(key, value);
      }
    });

    const response = await fetch(
      `${MOLONI_API}/${endpoint}/?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      }
    );

    return response.json();
  }

  try {
    let data = await makeRequest(currentToken);
    
    // If token expired, try to refresh
    if (data.error === 'invalid_request' || data.error_description?.includes('Invalid access token')) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await refreshToken();
      if (refreshed) {
        data = await makeRequest(currentToken);
      }
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Moloni API error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Moloni', details: error.message });
  }
}
