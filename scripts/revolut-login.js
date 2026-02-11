const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const USER_DATA_DIR = path.join(__dirname, '../.revolut-session');
const CREDENTIALS = {
  email: process.env.REVOLUT_EMAIL || 'bilal.machraa@gmail.com',
  pin: process.env.REVOLUT_PIN || '110755'
};

async function login() {
  console.log('🚀 A iniciar browser...');
  
  const browser = await puppeteer.launch({
    headless: 'new', // Headless na VPS
    userDataDir: USER_DATA_DIR,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,800'
    ],
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();
  
  console.log('📱 A abrir Revolut...');
  await page.goto('https://app.revolut.com/start', { waitUntil: 'networkidle2' });
  
  // Screenshot inicial
  await page.screenshot({ path: '/tmp/revolut-01-start.png' });
  console.log('📸 Screenshot: /tmp/revolut-01-start.png');
  
  // Esperar um pouco para a página carregar
  await new Promise(r => setTimeout(r, 3000));
  
  // Verificar se já está logado
  const url = page.url();
  console.log('📍 URL actual:', url);
  
  if (url.includes('/home') || url.includes('/accounts')) {
    console.log('✅ Já está logado!');
    await page.screenshot({ path: '/tmp/revolut-logged-in.png' });
    await browser.close();
    return;
  }
  
  // Procurar campo de email/telefone
  await page.screenshot({ path: '/tmp/revolut-02-login-page.png' });
  
  console.log('⏳ A aguardar interacção manual ou campo de login...');
  console.log('💡 Se aparecer campo de email, vou preencher automaticamente.');
  console.log('📱 Approva no telemóvel quando receberes notificação!');
  
  // Manter browser aberto para interacção
  console.log('\n🔓 Browser aberto. Fecha manualmente quando terminares.');
  console.log('   Ou espera 5 minutos para timeout automático.');
  
  // Aguardar 5 minutos máximo
  await new Promise(r => setTimeout(r, 300000));
  
  await browser.close();
  console.log('👋 Browser fechado.');
}

login().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
