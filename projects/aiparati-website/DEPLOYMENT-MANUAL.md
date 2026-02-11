# Manual Deployment Guide - AITI Website

## ✅ Status

- **GitHub Repository:** https://github.com/bilalmachraa82/aiparati-website
- **Branch:** main
- **Ready for Deployment:** ✅ YES

## 🚀 Deploy Steps (Manual)

### Option 1: Vercel Dashboard (Recomendado)
1. Ir para https://vercel.com/new
2. Clique em "Select Repository"
3. Selecione "bilalmachraa82/aiparati-website"
4. Clique "Import"
5. Vercel vai detectar automaticamente a configuração
6. Clique "Deploy"
7. Espere 30-60 segundos
8. Copie o URL gerado (e.g., aiparati-website.vercel.app)

### Option 2: Automatic via GitHub Actions
A workflow foi criada em `.github/workflows/deploy.yml`
Precisa de:
- VERCEL_TOKEN (secret no GitHub)
- VERCEL_ORG_ID (secret no GitHub)
- VERCEL_PROJECT_ID (secret no GitHub)

Para configurar:
```bash
# No GitHub > Settings > Secrets and variables > Actions:
VERCEL_TOKEN = [Seu token Vercel]
VERCEL_ORG_ID = [Seu ORG ID]
VERCEL_PROJECT_ID = [Seu Project ID]
```

### Option 3: Via Vercel CLI (se tem token válida)
```bash
cd ~/clawd/projects/aiparati-website
export VERCEL_TOKEN="seu-token-aqui"
vercel --prod --yes
```

## 📋 Ficheiros Inclusos

- **index.html** - Página inicial
- **pages/solucoes.html** - Página de soluções
- **pages/metodologia.html** - Página de metodologia
- **pages/case-study.html** - Página de case studies
- **pages/contactos.html** - Página de contactos
- **styles/** - CSS personalizado
- **scripts/** - Scripts JavaScript
- **vercel.json** - Configuração Vercel

## ⚙️ Configuração Vercel

O ficheiro `vercel.json` está configurado para:
- Servir index.html como raíz
- Redirecionar URLs para os ficheiros corretos
- Ativar CORS (se necessário)

## 🔗 Links Úteis

- **Vercel Import:** https://vercel.com/new
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/bilalmachraa82/aiparati-website

## ✅ Testes Após Deploy

Depois do deploy, testar:

1. [ ] HomePage: `https://your-domain.vercel.app/`
2. [ ] Soluções: `https://your-domain.vercel.app/pages/solucoes.html`
3. [ ] Metodologia: `https://your-domain.vercel.app/pages/metodologia.html`
4. [ ] Case Study: `https://your-domain.vercel.app/pages/case-study.html`
5. [ ] Contactos: `https://your-domain.vercel.app/pages/contactos.html`

