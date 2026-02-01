# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

---

## 🎫 JIRA (Gira) - SISTEMA PRINCIPAL DE TRACKING

### ⚠️ REGRA IMPORTANTE
**NUNCA criar issues no GitHub! Usar SEMPRE o Jira para tracking.**

### Acesso
- **URL:** https://aiparati.atlassian.net
- **Projecto:** DEV (AiParaTi)
- **Credenciais:** `~/clawd/.env.secrets.jira`

### Estrutura
- **Epics** = Repositórios/Projectos (ex: [REPO] ivazen-saas)
- **Tasks** = Tarefas específicas dentro do Epic
- **Sub-tasks** = Passos detalhados

### API
```bash
# Listar issues
source ~/clawd/.env.secrets.jira
curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST \
  "$JIRA_URL/rest/api/3/search/jql" \
  -H "Content-Type: application/json" \
  -d '{"jql": "project=DEV", "maxResults": 50, "fields": ["summary", "status", "issuetype"]}'

# Criar issue
curl -s -u "$JIRA_EMAIL:$JIRA_TOKEN" -X POST \
  "$JIRA_URL/rest/api/3/issue" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": {"key": "DEV"},
      "summary": "Título da tarefa",
      "description": {"type": "doc", "version": 1, "content": [{"type": "paragraph", "content": [{"type": "text", "text": "Descrição"}]}]},
      "issuetype": {"name": "Task"},
      "parent": {"key": "DEV-XX"}
    }
  }'
```

### Dashboard
- **Kanban:** https://aiparati.atlassian.net/jira/software/projects/DEV/boards
- **Export HTML:** `~/clawd/exports/jira-kanban.html`

---

## TTS (Text-to-Speech)

### ⚠️ REGRA: SEMPRE ElevenLabs Premium
**Bilal quer SEMPRE voz ElevenLabs de qualidade, nunca Azure.**
- Usar vozes ElevenLabs v3 (eleven_v3)
- Se quota baixa, avisar e pedir autorização para Azure
- Preferir: PAULA (PT), MATHIEU (FR), JESSICA (EN)

### Português PT-PT (Azure - GRÁTIS, ilimitado)
- **Voz principal:** Duarte (`pt-PT-DuarteNeural`) - masculino, amigável
- **Voz alternativa:** Raquel (`pt-PT-RaquelNeural`) - feminino, amigável
- **Comando:** `~/clawd/scripts/tts-pt.sh "texto" [duarte|raquel]`
- **Quando usar Raquel:** Ocasionalmente para variar, ou quando o contexto pedir voz feminina

### Francês (Azure - GRÁTIS, ilimitado)
- **Voz principal:** Remy (`fr-FR-RemyMultilingualNeural`) - masculino, natural
- **Voz alternativa:** Vivienne (`fr-FR-VivienneMultilingualNeural`) - feminino, elegante
- **Quando usar:** Quando o Bilal falar em francês

### Inglês (Azure - GRÁTIS, ilimitado)
- **Voz principal:** Andrew (`en-US-AndrewMultilingualNeural`) - masculino, warm e confiante
- **Voz alternativa:** Ava (`en-US-AvaMultilingualNeural`) - feminino, expressiva e amigável
- **Quando usar:** Quando o Bilal falar em inglês

### Script TTS Universal
```bash
# Auto-detecta língua, voz masculina por defeito
~/clawd/scripts/tts.sh "Olá Bilal!"

# Especificar língua
~/clawd/scripts/tts.sh "Hello!" en
~/clawd/scripts/tts.sh "Bonjour!" fr

# Voz feminina
~/clawd/scripts/tts.sh "Olá!" pt f
~/clawd/scripts/tts.sh "Hello!" en f
~/clawd/scripts/tts.sh "Bonjour!" fr f

# Output específico
~/clawd/scripts/tts.sh "texto" pt m /tmp/meu_audio.mp3
```

### Vozes Configuradas

| Língua | Masculina | Feminina | Serviço |
|--------|-----------|----------|---------|
| 🇵🇹 PT-PT | Duarte | Raquel | Azure (grátis) |
| 🇫🇷 FR | Remy | Vivienne | Azure (grátis) |
| 🇬🇧 EN | Andrew | Ava | Azure (grátis) |

### Regras de Uso
1. **Detectar língua** do input do Bilal
2. **Responder na mesma língua**
3. **Voz masculina** por defeito
4. **Voz feminina** ocasionalmente (~20% das vezes) para variar

---

## STT (Speech-to-Text)

- **Deepgram Nova-2:** PT-PT suportado, $0.0043/min
- **API Key:** `~/clawd/.env.secrets` → DEEPGRAM_API_KEY
- **Comando rápido:**
```bash
source ~/clawd/.env.secrets && curl -s -X POST \
  "https://api.deepgram.com/v1/listen?model=nova-2&language=pt&smart_format=true" \
  -H "Authorization: Token $DEEPGRAM_API_KEY" \
  -H "Content-Type: audio/ogg" \
  --data-binary @/path/to/audio.ogg | jq -r '.results.channels[0].alternatives[0].transcript'
```

---

## API Keys (referência)

- **ElevenLabs:** Configurado em `sag` CLI (backup, 10k chars/mês)
- **Deepgram:** `~/clawd/.env.secrets`
- **Jira:** `~/clawd/.env.secrets.jira`

### Ficheiro de Secrets Principal
```bash
# Localização: ~/clawd/.env.secrets
# Contém: GEMINI_API_KEY, DEEPGRAM_API_KEY, outras keys
# Usar: source ~/clawd/.env.secrets && echo $DEEPGRAM_API_KEY
```

---

## ElevenLabs TTS (v3 Premium)

### 🎯 VOZ PRINCIPAL: PAULA
**Usar sempre esta voz para Bilal e bots!**
- **Voice ID:** fNmw8sukfGuvWVOp33Ge
- **Modelo:** eleven_v3 (Premium)
- **Língua:** PT-PT 🇵🇹

### Script TTS
```bash
# Gerar áudio com voz PAULA
/home/ubuntu/clawd/scripts/tts-paula.sh "Texto a dizer" /tmp/output.mp3

# Enviar no Telegram
MEDIA:/tmp/output.mp3
```

### Vozes Alternativas
| Nome | Voice ID | Língua | Uso |
|------|----------|--------|-----|
| PAULA | fNmw8sukfGuvWVOp33Ge | PT 🇵🇹 ♀️ | **VOZ PRINCIPAL** |
| VERA | VhxAIIZM8IRmnl5fyeyk | PT 🇵🇹 ♀️ | Íntima, warm |
| VICENTE | xwVJ1SoRe0v1T88zEwBN | PT 🇵🇹 ♂️ | Masculina |
| GOD | HNSF1CTQmub252yhXROX | EN 🇺🇸 ♂️ | Inglês |
| JESSICA | cgSgspJ2msm6clMCkdW9 | EN 🇺🇸 ♀️ | Inglês feminina |
| MATHIEU | ckgFqgT4MZNQ3bggyZiF | FR 🇫🇷 ♂️ | Francês |
| DELPHINE | WvErJnWn6OcGO9sG2kqK | FR 🇫🇷 ♀️ | Francês feminina |

### Configuração v3
- **Modelo:** `eleven_v3` (SEMPRE USAR ESTE!)
- **Stability:** 0.5 (Natural)
- **Similarity Boost:** 0.75
- **API Key:** config talk.apiKey

---

## 1Password

**Service Account configurado!** Token em `~/.bashrc`

### Uso Correcto (IMPORTANTE!)
```bash
# SEMPRE exportar o token primeiro
export OP_SERVICE_ACCOUNT_TOKEN=$(grep OP_SERVICE_ACCOUNT_TOKEN ~/.bashrc | cut -d'"' -f2)

# SEMPRE usar --vault e --reveal para service accounts
op item get "Nome" --vault "Jarvis Secrets" --fields password --reveal

# Ou usar o helper script (já faz tudo automaticamente)
~/clawd/scripts/op-get.sh "Nome do Item" campo
```

### Helper Script (Recomendado)
```bash
# Exemplos:
~/clawd/scripts/op-get.sh "Vercel Token" password
~/clawd/scripts/op-get.sh "Moloni Aurora" "Access Token"
~/clawd/scripts/op-get.sh "GLM API Key 4.7" credential

# Listar items disponíveis:
~/clawd/scripts/op-get.sh
```

### ⚠️ Erros Comuns
1. **"vault query must be provided"** → Adicionar `--vault "Jarvis Secrets"`
2. **"[use op item get ... --reveal]"** → Adicionar `--reveal` para ver o valor
3. **Token vazio** → Verificar se `OP_SERVICE_ACCOUNT_TOKEN` está exportado

### Vault Disponível
- **Jarvis Secrets** - Todas as API keys e tokens

### Items no Vault
| Item | Campos |
|------|--------|
| Vercel Token | password |
| Moloni Aurora | username, password, Access Token, Refresh Token |
| GLM API Key 4.7 | credential |
| Gemini API | credential |
| ElevenLabs API | credential |
| Deepgram API | credential |
| Jira AiParaTi | email, token, url |
| Neon API | credential |
| Aurora Database URL | credential |
| Midas Database URL | credential |

---

## Cameras
*(a configurar)*

## SSH
*(a configurar)*

---

Add whatever helps you do your job. This is your cheat sheet.
