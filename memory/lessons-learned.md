# 🧠 Lessons Learned - Registo de Erros e Melhorias

> "Errar é humano. Errar duas vezes o mesmo erro é inaceitável."

---

## 2026-01-30 - Criar issues no GitHub em vez do Jira

### O que aconteceu
Criei issues no GitHub para os 4 projectos principais, quando o sistema de tracking é o Jira.

### Porque aconteceu
- Não verifiquei primeiro que sistema estava a ser usado
- Assumi que GitHub Issues era o padrão

### Como foi resolvido
- Migrei todas as issues para o Jira (DEV project)
- Criei Epics para cada repositório
- Adicionei tasks dentro dos Epics

### Como prevenir no futuro
- **REGRA #5 criada**: Jira > GitHub para tracking
- Documentado em TOOLS.md
- Documentado em AGENTS.md

### Guardrail implementado
Antes de criar qualquer issue: verificar TOOLS.md para sistema de tracking.

---

## 2026-01-30 - Secrets expostos em código (Aurora Oceano)

### O que aconteceu
CIPHER encontrou API keys hardcoded no código do Aurora Oceano.

### Porque aconteceu
- Desenvolvimento rápido sem atenção a segurança
- Falta de .gitignore adequado
- Sem code review

### Como foi resolvido
- Agente nocturno a corrigir (aurora-night-work)
- Mover secrets para variáveis de ambiente

### Como prevenir no futuro
- CIPHER audit obrigatório antes de qualquer launch
- .gitignore template para todos os projectos
- Checklist de segurança em METHODOLOGY.md

### Guardrail a implementar
Script que detecta patterns de secrets no código antes de commit.

---

*Adicionar novas lições seguindo o formato acima.*
*Este ficheiro é revisto mensalmente para identificar padrões.*

---

## 2026-01-31 - Migração de Secrets para 1Password

### O que foi feito
Todos os secrets foram migrados de ficheiros .env para 1Password vault "Jarvis Secrets".

### Secrets Migrados (10)
| Item | Tipo |
|------|------|
| Deepgram API | API Key |
| ElevenLabs API | API Key |
| Gemini API | API Key |
| Vercel Token | API Key |
| Aurora Telegram Bot | Bot Token |
| Neon API | API Key |
| Midas Database URL | Connection String |
| Jira AiParaTi | Login + Token |
| Moloni Aurora | OAuth Credentials |
| Aurora Database URL | Connection String |

### Como usar agora
```bash
# Obter qualquer secret
~/clawd/scripts/op-get-secret.sh "Nome do Item" password

# Exemplo
DEEPGRAM_KEY=$(~/clawd/scripts/op-get-secret.sh "Deepgram API" password)
```

### Benefícios
- ✅ Encriptado em repouso
- ✅ Audit trail
- ✅ Revogar facilmente
- ✅ Nunca mais secrets no git

