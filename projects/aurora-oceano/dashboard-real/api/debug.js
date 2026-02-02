// Debug endpoint - mostra variáveis de ambiente (sem valores sensíveis completos)
export default function handler(req, res) {
  res.status(200).json({
    client_id: process.env.MOLONI_CLIENT_ID || 'NOT SET',
    client_secret_length: (process.env.MOLONI_CLIENT_SECRET || '').length,
    username: process.env.MOLONI_USERNAME || 'NOT SET',
    password_length: (process.env.MOLONI_PASSWORD || '').length,
    empresa_id: process.env.MOLONI_EMPRESA_ID || 'NOT SET'
  });
}
