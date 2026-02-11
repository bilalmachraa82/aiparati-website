# Segurança e Arquitectura para AI Assistants

> **Deep Research Report** | Janeiro 2026  
> Relatório sobre best practices de segurança para AI assistants pessoais com acesso a dados sensíveis

---

## Índice

1. [Resumo Executivo](#resumo-executivo)
2. [OWASP Top 10 para LLMs](#owasp-top-10-para-llms)
3. [Princípios de Segurança para AI Agents](#princípios-de-segurança-para-ai-agents)
4. [Gestão de Secrets](#gestão-de-secrets)
5. [Sandboxing e Permissões](#sandboxing-e-permissões)
6. [Audit Logs e Compliance](#audit-logs-e-compliance)
7. [Arquitectura Multi-Device](#arquitectura-multi-device)
8. [Checklist de Segurança](#checklist-de-segurança)
9. [Arquitectura Recomendada](#arquitectura-recomendada)
10. [Padrões de Permissões](#padrões-de-permissões)

---

## Resumo Executivo

AI assistants pessoais com acesso a dados sensíveis representam um novo paradigma de risco. Ao contrário de aplicações tradicionais, estes sistemas:

- **Operam autonomamente** com capacidade de tomar decisões
- **Acedem a múltiplos sistemas** através de integrações e APIs
- **Processam dados pessoais** continuamente
- **Tomam acções** em nome do utilizador

Este relatório consolida as melhores práticas da indústria, incluindo guidelines da OWASP, NIST, 1Password, Anthropic, e outras fontes autorizadas.

---

## OWASP Top 10 para LLMs

O OWASP GenAI Security Project identifica os 10 principais riscos para aplicações LLM:

### LLM01: Prompt Injection
**Risco:** Manipulação do LLM através de inputs maliciosos pode levar a acesso não autorizado.

**Mitigação:**
- Validar e sanitizar todos os inputs
- Separar prompts de sistema de inputs de utilizador
- Implementar input/output filters
- Usar delimitadores claros entre instruções e dados

### LLM02: Insecure Output Handling
**Risco:** Outputs não validados podem levar a execução de código ou XSS.

**Mitigação:**
- Tratar todos os outputs do LLM como não-confiáveis
- Aplicar encoding apropriado antes de renderização
- Validar outputs antes de passar a outros sistemas

### LLM03: Training Data Poisoning
**Risco:** Dados de treino comprometidos podem influenciar comportamento.

**Mitigação:**
- Usar modelos de fornecedores confiáveis
- Não fazer fine-tuning com dados não verificados
- Monitorizar comportamento anómalo

### LLM04: Model Denial of Service
**Risco:** Operações resource-intensive podem causar disrupção.

**Mitigação:**
- Rate limiting em todas as APIs
- Timeouts em operações de LLM
- Limites de tokens por request

### LLM05: Supply Chain Vulnerabilities
**Risco:** Componentes, plugins ou datasets comprometidos.

**Mitigação:**
- Auditar todas as dependências
- Verificar integridade de plugins
- Manter inventário de componentes

### LLM06: Sensitive Information Disclosure
**Risco:** LLM pode divulgar informação sensível em outputs.

**Mitigação:**
- **NUNCA colocar secrets no contexto do LLM**
- Implementar filtros de output para PII
- Usar redaction automática

### LLM07: Insecure Plugin Design
**Risco:** Plugins com inputs não validados e controlos de acesso insuficientes.

**Mitigação:**
- Aplicar princípio de least privilege a plugins
- Validar todos os inputs de plugins
- Sandboxing de execução de plugins

### LLM08: Excessive Agency
**Risco:** Autonomia excessiva do LLM pode levar a consequências não intencionadas.

**Mitigação:**
- **Confirmação humana para acções de alto impacto**
- Limitar acções disponíveis ao LLM
- Implementar "guardrails" e limites

### LLM09: Overreliance
**Risco:** Confiar excessivamente nas decisões do LLM sem verificação.

**Mitigação:**
- Human-in-the-loop para decisões críticas
- Verificação de outputs antes de acção
- Documentar limitações do sistema

### LLM10: Model Theft
**Risco:** Acesso não autorizado a modelos proprietários.

**Mitigação:**
- Usar modelos via API (não locais)
- Controlar acesso a endpoints
- Monitorizar uso anómalo

---

## Princípios de Segurança para AI Agents

Baseado nas guidelines da 1Password e Anthropic:

### 1. Secrets Permanecem Secretos
> "Encryption is the foundation of our trust model. Any interaction involving credentials must preserve zero-knowledge architecture, no exceptions."

- **Credenciais RAW nunca entram no contexto do LLM**
- LLMs operam em ambientes de inferência não-confiáveis
- Context windows e memória são potencialmente expostos

### 2. Autorização Determinística, Não Probabilística
> "LLMs are not authorization engines. Access decisions must be governed by predictable, rule-based flows."

- Decisões de acesso devem ser determinísticas
- Prompts de autorização devem ser claros e específicos
- Usar mecanismos "system-level" de partes confiáveis (OS, 1Password)

### 3. Auditabilidade Obrigatória
> "Every action involving credential access, by a user or an AI agent, should leave an audit trail."

- Registar QUANDO, ONDE, e PORQUÊ o acesso ocorreu
- Contexto da aprovação deve ser capturado
- Trail completo para investigação

### 4. Transparência sobre Acesso
- Utilizadores devem saber exactamente o que o AI pode ver
- Clareza sobre dados acedidos, quando, e porquê
- Comunicação clara sobre limitações

### 5. Least Privilege por Defeito
> "Agentic systems must follow the same access discipline we expect of humans: only what's needed, only when needed."

- Privilégios mínimos necessários
- Acesso temporal (time-boxed)
- Revogação automática quando não necessário

### 6. Segurança e Usabilidade como Co-requisitos
- Segurança que não é usável não é efectiva
- Experiências secure-by-default devem ser intuitivas
- Fricção excessiva leva a workarounds inseguros

---

## Gestão de Secrets

### Opção A: 1Password CLI (Recomendado para uso pessoal)

**Características:**
- Zero-knowledge architecture
- Biometric authentication (Touch ID, etc.)
- Secret references em vez de plaintext
- Audit logging integrado
- Shell plugins para CLIs terceiras

**Secret References:**
```bash
# Formato de referência
op://vault/item/field

# Uso com op run (não expõe em plaintext)
export DB_PASSWORD="op://Development/Database/password"
op run -- ./my-script.sh

# Uso com op read (para scripts)
PASSWORD=$(op read "op://Development/Database/password")
```

**Best Practices:**
```bash
# NUNCA fazer isto:
export API_KEY="sk-actual-secret-value"

# SEMPRE fazer isto:
export API_KEY="op://vault/item/api-key"
op run -- mycommand
```

**Para AI Agents - 1Password Agentic Autofill:**
- Credenciais via canal end-to-end encrypted
- Aprovação explícita para cada autofill
- Agent nunca vê raw credentials
- Forward-rotating key material
- Post-compromise security

### Opção B: HashiCorp Vault (Para ambientes enterprise)

**Características:**
- Gestão centralizada de secrets
- Dynamic secrets (credenciais temporárias)
- Encryption as a Service
- Políticas granulares
- Audit logging extensivo

**Quando usar:**
- Ambientes multi-tenant
- Necessidade de dynamic secrets
- Integração com cloud providers
- Compliance requirements (SOC 2, etc.)

### Opção C: Environment Variables (Apenas se necessário)

**Se tiver de usar env vars:**
```bash
# Carregar de ficheiro seguro
source ~/.secrets/env  # Ficheiro com permissões 600

# Ou usar direnv com .envrc
# NUNCA commit .envrc com secrets
```

**Protecções:**
- Ficheiros com permissões 0600
- Não em version control (.gitignore)
- Encrypted at rest se possível

### Comparação

| Aspecto | 1Password CLI | Vault | Env Vars |
|---------|---------------|-------|----------|
| Setup complexity | Baixa | Alta | Muito baixa |
| Zero-knowledge | ✅ | ⚠️ | ❌ |
| Dynamic secrets | ❌ | ✅ | ❌ |
| Audit logging | ✅ | ✅ | ❌ |
| Custo | ~$36/ano | Free/Enterprise | Free |
| AI Agent support | ✅ Nativo | Via integração | ❌ |

---

## Sandboxing e Permissões

### Modelo de Sandboxing em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                     CAMADA 1: REDE                          │
│  • VPN/Tailscale para comunicação entre devices             │
│  • Firewall rules por device/service                        │
│  • Zero-trust network (deny-by-default)                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA 2: HOST                            │
│  • User namespaces (non-root containers)                    │
│  • AppArmor/SELinux profiles                                │
│  • Seccomp filters                                          │
│  • Capabilities dropping                                    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 CAMADA 3: CONTAINER                         │
│  • Docker/Podman com read-only root filesystem              │
│  • Volumes específicos (não /)                              │
│  • Network isolation                                        │
│  • Resource limits (CPU, memory)                            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                CAMADA 4: APLICAÇÃO                          │
│  • Process-level isolation                                  │
│  • Capability-based access                                  │
│  • Action allowlists                                        │
│  • Tool/plugin sandboxing                                   │
└─────────────────────────────────────────────────────────────┘
```

### Docker Security Best Practices

```dockerfile
# Exemplo de Dockerfile seguro para AI assistant
FROM python:3.11-slim

# Non-root user
RUN useradd --create-home --shell /bin/bash assistant
USER assistant
WORKDIR /home/assistant

# Read-only filesystem onde possível
# Volumes para dados mutáveis

# Minimal capabilities
# Drop ALL, add only what's needed
```

```bash
# Run com security flags
docker run \
  --user 1000:1000 \
  --read-only \
  --tmpfs /tmp \
  --cap-drop=ALL \
  --security-opt=no-new-privileges:true \
  --security-opt apparmor=docker-default \
  --pids-limit 100 \
  --memory 512m \
  --cpus 1 \
  my-assistant
```

### Permissões por Acção

| Acção | Risco | Permissão | Human Approval |
|-------|-------|-----------|----------------|
| Ler ficheiros no workspace | Baixo | Auto | ❌ |
| Ler calendário | Baixo | Auto | ❌ |
| Pesquisar web | Baixo | Auto | ❌ |
| Enviar email | Médio | Confirm | ⚠️ Primeiro envio |
| Executar comandos shell | Alto | Allowlist | ⚠️ Comandos novos |
| Aceder a secrets | Alto | Auth required | ✅ Sempre |
| Fazer compras | Muito Alto | Manual | ✅ Sempre |
| Aceder a contas bancárias | Crítico | Desabilitado | N/A |

### Tool Sandboxing Pattern

```python
class ToolExecutor:
    """Executor com sandboxing para tools do AI assistant."""
    
    SAFE_COMMANDS = {
        'ls', 'cat', 'head', 'tail', 'grep', 'find',
        'git status', 'git log', 'git diff'
    }
    
    REQUIRES_APPROVAL = {
        'git push', 'git commit', 'rm', 'mv',
        'curl', 'wget', 'ssh'
    }
    
    BLOCKED = {
        'sudo', 'su', 'chmod 777', 'rm -rf /',
        'dd', 'mkfs', 'fdisk'
    }
    
    async def execute(self, command: str) -> Result:
        # 1. Check blocklist
        if self._is_blocked(command):
            return Result.blocked("Command not allowed")
        
        # 2. Check if approval needed
        if self._requires_approval(command):
            approved = await self._request_approval(command)
            if not approved:
                return Result.denied("User denied")
        
        # 3. Execute in sandbox
        return await self._sandboxed_execute(command)
```

---

## Audit Logs e Compliance

### O Que Registar (OWASP Guidelines)

#### Sempre Registar:
- **Authentication:** Sucessos e falhas
- **Authorization:** Todas as falhas de acesso
- **Session management:** Criação, destruição, anomalias
- **Input validation:** Todas as falhas
- **High-risk functionality:** 
  - Acesso a dados sensíveis
  - Alterações de configuração
  - Acções administrativas
  - Uso de privileges elevados

#### Para AI Assistants, Adicionar:
- **Tool invocations:** Qual tool, parâmetros, resultado
- **LLM interactions:** Prompt (sanitizado), response summary
- **Approval flows:** O que foi pedido, o que foi aprovado/negado
- **Context access:** Que dados foram acedidos para contexto
- **Actions taken:** Todas as acções com impacto externo

### Formato de Log Entry

```json
{
  "timestamp": "2026-01-28T21:15:00.000Z",
  "event_id": "evt_abc123",
  "session_id": "sess_xyz789",
  "event_type": "tool_execution",
  "severity": "info",
  "actor": {
    "type": "ai_assistant",
    "model": "claude-opus-4",
    "session": "main"
  },
  "action": {
    "tool": "shell_exec",
    "command": "git status",
    "parameters": {
      "workdir": "/home/user/project"
    }
  },
  "result": {
    "status": "success",
    "duration_ms": 150
  },
  "context": {
    "trigger": "user_request",
    "conversation_id": "conv_123",
    "approval_required": false
  },
  "security": {
    "data_accessed": ["filesystem:read"],
    "credentials_used": false,
    "sandbox_level": "standard"
  }
}
```

### Nunca Registar:
- Passwords ou secrets (mesmo que masked)
- Session tokens ou API keys
- Números de cartão de crédito
- Dados PII desnecessários
- Dados médicos sensíveis

### Storage e Retenção

```yaml
# Exemplo de política de retenção
audit_logs:
  security_events:
    retention: 1 year
    storage: encrypted_at_rest
    access: security_team_only
    
  operational_events:
    retention: 90 days
    storage: standard
    access: admin_team
    
  debug_logs:
    retention: 7 days
    storage: standard
    access: development_team
```

### Compliance Frameworks Relevantes

| Framework | Aplicabilidade | Requisitos Chave |
|-----------|---------------|------------------|
| GDPR | Dados de EU residents | Consent, right to deletion, data minimization |
| SOC 2 | Se prestar serviços | Audit trails, access controls, encryption |
| NIST AI RMF | Best practice | Risk management, transparency, accountability |
| ISO 27001 | Enterprise | Information security management |

---

## Arquitectura Multi-Device

### Arquitectura Recomendada

```
                    ┌────────────────────────────────────────┐
                    │           INTERNET                      │
                    └────────────────────────────────────────┘
                                      │
                    ┌────────────────────────────────────────┐
                    │      TAILSCALE MESH NETWORK            │
                    │      (Zero-trust, encrypted)           │
                    └────────────────────────────────────────┘
                         │            │            │
            ┌────────────┴──┐    ┌────┴────┐    ┌──┴────────────┐
            │               │    │         │    │               │
    ┌───────┴───────┐  ┌────┴────┴───┐  ┌──┴────┴─────┐  ┌──────┴──────┐
    │     VPS       │  │    MAC      │  │   MOBILE    │  │  BROWSER    │
    │   (Gateway)   │  │  (Primary)  │  │   (Node)    │  │  EXTENSION  │
    └───────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
           │                  │                │
    ┌──────┴──────┐   ┌──────┴──────┐   ┌─────┴──────┐
    │ • Clawdbot  │   │ • 1Password │   │ • Camera   │
    │ • Gateway   │   │ • Local AI  │   │ • Location │
    │ • Telegram  │   │ • Documents │   │ • Sensors  │
    │ • 24/7      │   │ • Dev tools │   │ • Alerts   │
    └─────────────┘   └─────────────┘   └────────────┘
```

### Componentes e Responsabilidades

#### VPS (Gateway) - Always-On
**Função:** Hub central, sempre disponível

**Runs:**
- Clawdbot daemon (AI assistant)
- Tailscale exit node (opcional)
- Webhook receivers (Telegram, etc.)
- Cron jobs e background tasks

**Security:**
- SSH key-only authentication
- fail2ban para brute force
- UFW firewall (deny all, allow specific)
- Regular security updates
- Encrypted disk (LUKS)

**Não deve ter:**
- Secrets em plaintext
- Acesso directo a dados pessoais sensíveis
- Browser sessions activas

#### Mac (Primary Workstation)
**Função:** Workstation principal, dados sensíveis

**Has:**
- 1Password (secrets management)
- Browser com sessões activas
- Documentos pessoais
- Development environment

**Security:**
- FileVault (full disk encryption)
- 1Password locked quando idle
- Firewall enabled
- Tailscale para acesso remoto

**AI Access:**
- Via Tailscale do VPS
- Requer autenticação para secrets
- Human approval para acções sensíveis

#### Mobile (Node)
**Função:** Sensores, alertas, aprovações

**Capabilities:**
- Camera (front/back)
- Location
- Notifications (receber alertas)
- Approvals (confirmar acções)

**Security:**
- Biometric lock
- Tailscale VPN
- Minimal permissions (só o necessário)
- Remote wipe capability

### Fluxo de Comunicação

```
┌──────────────────────────────────────────────────────────────┐
│                    FLUXO: Secret Access                       │
└──────────────────────────────────────────────────────────────┘

1. AI (VPS) precisa de API key
   │
2. Request via Tailscale → Mac
   │
3. 1Password prompt no Mac
   │
4. User approva com Touch ID
   │
5. Secret injectado (não exposto ao LLM context)
   │
6. Acção executada
   │
7. Audit log registado
```

### Network Security (Tailscale ACLs)

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:vps"],
      "dst": ["tag:mac:22", "tag:mac:443"]
    },
    {
      "action": "accept", 
      "src": ["tag:vps"],
      "dst": ["tag:mobile:*"]
    },
    {
      "action": "deny",
      "src": ["*"],
      "dst": ["*:*"]
    }
  ],
  "tagOwners": {
    "tag:vps": ["user@email.com"],
    "tag:mac": ["user@email.com"],
    "tag:mobile": ["user@email.com"]
  }
}
```

---

## Checklist de Segurança

### 🔐 Secrets Management

- [ ] **Nenhum secret em plaintext** no código ou configurações
- [ ] **1Password ou Vault** configurado para gestão de secrets
- [ ] **Secret references** em vez de valores literais
- [ ] **Rotação regular** de API keys e tokens
- [ ] **Secrets nunca no LLM context** (prompts, memória, logs)
- [ ] **Audit log** para todos os acessos a secrets

### 🛡️ Sandboxing

- [ ] **Container isolation** para componentes críticos
- [ ] **Non-root execution** em todos os containers
- [ ] **Read-only filesystems** onde possível
- [ ] **Capabilities dropping** (CAP_DROP=ALL + allowlist)
- [ ] **Resource limits** (CPU, memory, pids)
- [ ] **Network isolation** entre componentes

### 🔑 Autenticação & Autorização

- [ ] **SSH key-only** (no password auth)
- [ ] **MFA/2FA** em todas as contas críticas
- [ ] **Tailscale** ou VPN para comunicação entre devices
- [ ] **Principle of least privilege** em todas as permissões
- [ ] **Deny-by-default** ACLs
- [ ] **Time-boxed access** para operações sensíveis

### 📝 Audit & Monitoring

- [ ] **Audit logging** para todas as acções do AI
- [ ] **Structured logs** (JSON) para análise
- [ ] **Log rotation** e retenção adequada
- [ ] **Alerting** para eventos de segurança
- [ ] **Nunca logar** secrets, tokens, ou PII desnecessário
- [ ] **Backup** de logs críticos

### 🤖 AI-Specific

- [ ] **Human approval** para acções de alto impacto
- [ ] **Tool allowlist** (não wildcard permissions)
- [ ] **Output validation** antes de acções externas
- [ ] **Rate limiting** em todas as APIs
- [ ] **Timeouts** em operações de LLM
- [ ] **Guardrails** para prevenir comportamento não intendido

### 🌐 Network

- [ ] **Firewall** (deny all, allow specific)
- [ ] **HTTPS/TLS** para todas as comunicações
- [ ] **No exposed ports** desnecessários
- [ ] **fail2ban** ou similar para brute force
- [ ] **Regular security updates**
- [ ] **Intrusion detection** (opcional)

### 💾 Data Protection

- [ ] **Encryption at rest** (disk encryption)
- [ ] **Encryption in transit** (TLS)
- [ ] **Regular backups** (encrypted)
- [ ] **Data minimization** (só guardar o necessário)
- [ ] **Secure deletion** (trash > rm, shred para sensíveis)
- [ ] **Access logs** para dados sensíveis

---

## Arquitectura Recomendada

### Para Clawdbot (Caso Específico)

```
┌─────────────────────────────────────────────────────────────────┐
│                        VPS (Ubuntu)                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   Clawdbot Gateway                          ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         ││
│  │  │  Telegram   │  │   Claude    │  │   Memory    │         ││
│  │  │   Bot API   │  │     API     │  │   (Files)   │         ││
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         ││
│  │         │                │                │                 ││
│  │  ┌──────┴────────────────┴────────────────┴──────┐         ││
│  │  │              Tool Executor (Sandboxed)         │         ││
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │         ││
│  │  │  │  Shell  │ │ Browser │ │  Nodes  │         │         ││
│  │  │  │ (limit) │ │(headless)│ │  Proxy  │         │         ││
│  │  │  └─────────┘ └─────────┘ └─────────┘         │         ││
│  │  └───────────────────────────────────────────────┘         ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │ Tailscale                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────┴───────┐      ┌───────┴───────┐      ┌───────┴───────┐
│      Mac      │      │    Mobile     │      │   Browser     │
│  ┌─────────┐  │      │  ┌─────────┐  │      │  ┌─────────┐  │
│  │1Password│  │      │  │ Camera  │  │      │  │Extension│  │
│  │ Desktop │  │      │  │Location │  │      │  │ (Relay) │  │
│  └─────────┘  │      │  └─────────┘  │      │  └─────────┘  │
└───────────────┘      └───────────────┘      └───────────────┘
```

### Security Layers por Componente

| Componente | Sandbox | Auth | Audit | Secrets |
|------------|---------|------|-------|---------|
| Gateway | Container | Tailscale | Full | Via Mac |
| Tool Exec | Subprocess | Per-tool | Full | Never |
| Memory | Filesystem | Permission | Changes | Never store |
| Mac | OS-level | Biometric | N/A | 1Password |
| Mobile | OS-level | Biometric | Actions | App-based |
| Browser | Extension | Session | Actions | 1Password |

---

## Padrões de Permissões

### Modelo RBAC Simplificado

```yaml
roles:
  observer:
    description: "Read-only access"
    permissions:
      - read:workspace
      - read:calendar
      - read:weather
      - search:web
    
  assistant:
    description: "Standard operations"
    extends: observer
    permissions:
      - execute:safe_commands
      - write:workspace
      - send:notifications
      - manage:memory
    requires_approval:
      - send:email (first time)
      - execute:new_command
      
  operator:
    description: "System operations"
    extends: assistant
    permissions:
      - execute:any_command
      - manage:services
      - access:secrets
    requires_approval:
      - access:secrets (always)
      - destructive:operations
```

### Action Classification

```yaml
actions:
  # SAFE - Execute freely
  safe:
    - read files in workspace
    - list directory contents
    - search web
    - check calendar
    - check weather
    - git status/log/diff
    - run approved scripts
    
  # MODERATE - Log, maybe prompt
  moderate:
    - write files in workspace
    - send notifications
    - git add/commit
    - create/modify memory
    - execute allowlisted commands
    
  # ELEVATED - Require approval
  elevated:
    - send email/messages
    - git push
    - execute new commands
    - access external APIs
    - install packages
    
  # CRITICAL - Always require approval
  critical:
    - access secrets/credentials
    - financial transactions
    - delete data
    - modify system config
    - access personal accounts
    
  # BLOCKED - Never allow
  blocked:
    - sudo/root operations
    - destructive commands (rm -rf /)
    - disable security features
    - exfiltrate data
    - access blocked accounts
```

### Implementation Pattern

```python
from enum import Enum
from typing import Optional

class ActionLevel(Enum):
    SAFE = "safe"
    MODERATE = "moderate"  
    ELEVATED = "elevated"
    CRITICAL = "critical"
    BLOCKED = "blocked"

class PermissionManager:
    def __init__(self):
        self.approval_cache = {}  # Cache de aprovações
        
    async def check_permission(
        self, 
        action: str, 
        context: dict
    ) -> tuple[bool, Optional[str]]:
        """
        Returns (allowed, reason).
        """
        level = self._classify_action(action)
        
        if level == ActionLevel.BLOCKED:
            return False, "Action is blocked by policy"
            
        if level == ActionLevel.CRITICAL:
            return await self._request_approval(
                action, context, 
                timeout=300,  # 5 min
                persist=False  # Don't cache
            )
            
        if level == ActionLevel.ELEVATED:
            # Check cache first
            if self._has_recent_approval(action):
                return True, "Previously approved"
            return await self._request_approval(
                action, context,
                timeout=60,
                persist=True  # Cache for similar actions
            )
            
        if level == ActionLevel.MODERATE:
            # Log and proceed
            await self._audit_log(action, context)
            return True, None
            
        # SAFE
        return True, None
```

---

## Referências

### Standards & Frameworks
- [OWASP Top 10 for LLMs](https://genai.owasp.org/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

### Vendor Documentation
- [1Password CLI Documentation](https://developer.1password.com/docs/cli/)
- [1Password Agentic Autofill](https://developer.1password.com/docs/agentic-autofill/)
- [HashiCorp Vault](https://developer.hashicorp.com/vault/docs)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Tailscale ACLs](https://tailscale.com/kb/1018/acls)

### Best Practices
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [1Password: Security Principles for AI](https://1password.com/blog/security-principles-guiding-1passwords-approach-to-ai)

---

*Relatório gerado em Janeiro 2026. Revisto periodicamente para actualizações.*
