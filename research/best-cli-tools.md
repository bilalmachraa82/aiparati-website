# 🛠️ Best CLI Tools for AI Assistants

> Relatório de pesquisa: Ferramentas essenciais de terminal para maximizar produtividade
> Última atualização: Janeiro 2026

---

## 📑 Índice

1. [Ferramentas de Produtividade (Modern Replacements)](#-ferramentas-de-produtividade)
2. [Ferramentas AI/LLM no Terminal](#-ferramentas-aillm-no-terminal)
3. [Task Runners e Automação](#-task-runners-e-automação)
4. [TUIs para Desenvolvimento](#-tuis-para-desenvolvimento)
5. [CLIs para APIs e Cloud](#-clis-para-apis-e-cloud)
6. [Shell Enhancements](#-shell-enhancements)
7. [Processamento de Dados](#-processamento-de-dados)
8. [Monitoring e Performance](#-monitoring-e-performance)
9. [Instalação Rápida](#-instalação-rápida)

---

## 🚀 Ferramentas de Produtividade

### Modern Rust Replacements (Alternativas Modernas)

| Tool | Substitui | Descrição |
|------|-----------|-----------|
| **eza** | `ls` | Listagem de ficheiros com cores, ícones e git status |
| **bat** | `cat` | Visualização com syntax highlighting |
| **ripgrep (rg)** | `grep` | Busca recursiva ultra-rápida |
| **fd** | `find` | Busca de ficheiros simples e rápida |
| **zoxide** | `cd` | Navegação inteligente com histórico |
| **dust** | `du` | Uso de disco com visualização intuitiva |
| **delta** | `diff` | Diff com syntax highlighting para git |
| **sd** | `sed` | Find & replace intuitivo |
| **procs** | `ps` | Process viewer moderno |
| **bottom (btm)** | `htop` | System monitor visual |

### eza (ls replacement)
```bash
# Instalação
cargo install eza
# ou
brew install eza
sudo apt install eza  # Ubuntu 23.04+

# Uso
eza -la                    # Lista detalhada
eza --tree --level=2       # Árvore de diretórios
eza --icons --git          # Com ícones e status git

# Aliases recomendados
alias ls='eza'
alias ll='eza -la --icons --git'
alias tree='eza --tree'
```

### bat (cat replacement)
```bash
# Instalação
cargo install bat
brew install bat
sudo apt install bat

# Uso
bat file.py                # Com syntax highlighting
bat --diff file1 file2     # Comparar ficheiros
bat -A file.txt            # Mostrar caracteres invisíveis

# Alias
alias cat='bat --paging=never'
```

### ripgrep (grep replacement)
```bash
# Instalação
cargo install ripgrep
brew install ripgrep
sudo apt install ripgrep

# Uso
rg "pattern"               # Busca recursiva
rg -i "pattern"            # Case insensitive
rg -t py "def "            # Apenas ficheiros Python
rg -C 3 "error"            # Com 3 linhas de contexto
rg --json "pattern"        # Output JSON

# Casos de uso para AI
rg "TODO|FIXME" --glob "*.py"   # Encontrar TODOs
rg -l "import os"               # Listar ficheiros com match
```

### fd (find replacement)
```bash
# Instalação
cargo install fd-find
brew install fd
sudo apt install fd-find

# Uso
fd "pattern"               # Busca por nome
fd -e py                   # Apenas .py
fd -H "hidden"             # Incluir hidden files
fd -x rm {}               # Executar comando em cada resultado

# Exemplos práticos
fd -e log -x rm {}        # Remover todos os .log
fd -e py -x wc -l {}      # Contar linhas em .py
```

### zoxide (cd replacement)
```bash
# Instalação
cargo install zoxide
brew install zoxide

# Configuração (adicionar ao .bashrc/.zshrc)
eval "$(zoxide init bash)"   # ou zsh/fish

# Uso
z projects                 # Ir para diretório com "projects"
z doc                      # Ir para diretório frequente com "doc"
zi                         # Seleção interativa com fzf

# Casos de uso
z clawd                    # Saltar diretamente para ~/clawd
```

### fzf (Fuzzy Finder)
```bash
# Instalação
brew install fzf
sudo apt install fzf
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf && ~/.fzf/install

# Uso básico
fzf                        # Fuzzy find ficheiros
history | fzf              # Buscar no histórico
cat file | fzf             # Filtrar qualquer lista

# Integração com outros tools
fd -t f | fzf              # Ficheiros com fd + fzf
rg -l "pattern" | fzf      # Resultados ripgrep + fzf

# Keybindings (após instalação)
# CTRL-T  - Inserir ficheiro selecionado
# CTRL-R  - Buscar no histórico de comandos
# ALT-C   - cd para diretório selecionado
```

### delta (diff replacement)
```bash
# Instalação
cargo install git-delta
brew install git-delta

# Configuração git (~/.gitconfig)
[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true
    side-by-side = true
    line-numbers = true

# Uso standalone
delta file1 file2
diff -u file1 file2 | delta
```

---

## 🤖 Ferramentas AI/LLM no Terminal

### llm (Simon Willison)
O canivete suíço para LLMs no terminal.

```bash
# Instalação
pip install llm
# ou
brew install llm

# Configuração
llm install llm-claude-3   # Plugin para Claude
llm keys set anthropic     # Configurar API key

# Uso básico
llm "Explica recursão"
llm -m claude-3.5-sonnet "Traduz para PT"
cat file.py | llm "Revisa este código"

# Conversas
llm chat -m claude-3.5-sonnet
llm -c "continua a explicação"  # Continuar conversa

# Templates
llm templates edit summarize
llm -t summarize < article.txt

# Casos de uso para AI Assistants
cat error.log | llm "Explica estes erros"
git diff | llm "Escreve commit message"
llm "Cria script bash para backup"
```

### aider
AI pair programming no terminal.

```bash
# Instalação
pip install aider-chat
# ou
python -m pip install aider-install && aider-install

# Uso
cd /to/your/project
aider --model sonnet          # Com Claude Sonnet
aider --model deepseek        # Com DeepSeek (mais barato)
aider file1.py file2.py       # Adicionar ficheiros ao contexto

# Comandos dentro do aider
/add file.py                  # Adicionar ficheiro
/drop file.py                 # Remover ficheiro
/diff                         # Ver alterações
/undo                         # Reverter última mudança
/commit                       # Commit das alterações
```

### Gemini CLI
```bash
# Instalação
npm install -g @anthropic-ai/gemini-cli

# Configuração
export GOOGLE_API_KEY="your-key"

# Uso
gemini "Pergunta aqui"
```

### Outros AI CLIs

| Tool | Descrição | Instalação |
|------|-----------|------------|
| **claude-cli** | CLI oficial Anthropic | `npm install -g @anthropic-ai/claude-cli` |
| **sgpt** | Shell GPT | `pip install shell-gpt` |
| **mods** | AI no terminal via Charm | `brew install charmbracelet/tap/mods` |
| **fabric** | AI patterns | `pip install fabric-ai` |

---

## ⚡ Task Runners e Automação

### just (make replacement)
Melhor que Makefile para command running.

```bash
# Instalação
cargo install just
brew install just
sudo apt install just

# Exemplo justfile
```

```just
# justfile

# Listar receitas disponíveis
default:
    @just --list

# Instalar dependências
install:
    pip install -r requirements.txt

# Correr testes
test:
    pytest -v

# Build com argumento
build target='release':
    cargo build --{{target}}

# Deploy (com confirmação)
deploy: test
    @echo "Deploying..."
    ./deploy.sh

# Receita com variáveis de ambiente
run-server port='8000':
    PORT={{port}} python server.py
```

```bash
# Uso
just              # Lista comandos
just install      # Corre install
just build debug  # Passa argumento
just deploy       # Corre test primeiro, depois deploy
```

### Task (Taskfile)
Alternativa YAML ao Make.

```bash
# Instalação
brew install go-task/tap/go-task
# ou
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin

# Exemplo Taskfile.yml
```

```yaml
# Taskfile.yml
version: '3'

tasks:
  install:
    desc: Instalar dependências
    cmds:
      - pip install -r requirements.txt

  test:
    desc: Correr testes
    cmds:
      - pytest -v

  build:
    desc: Build do projeto
    deps: [test]
    cmds:
      - docker build -t myapp .

  default:
    cmds:
      - task --list
```

```bash
# Uso
task              # Lista tasks
task install      # Corre install
task build        # Corre test + build
```

### Comparação

| Feature | Make | just | Task |
|---------|------|------|------|
| Sintaxe | Complexa | Simples | YAML |
| Dependências de ficheiros | ✅ | ❌ | ✅ |
| Cross-platform | ⚠️ | ✅ | ✅ |
| Curva aprendizagem | Alta | Baixa | Média |

**Recomendação:** `just` para scripts simples, `Task` para pipelines complexos.

---

## 🖥️ TUIs para Desenvolvimento

### lazygit
Interface visual para Git.

```bash
# Instalação
brew install lazygit
sudo apt install lazygit
go install github.com/jesseduffield/lazygit@latest

# Uso
lazygit           # Abrir no repo atual
lg                # Com alias

# Keybindings principais
# space - stage/unstage
# c     - commit
# P     - push
# p     - pull
# b     - branches
# s     - stash
# ?     - ajuda
```

### lazydocker
Interface visual para Docker.

```bash
# Instalação
brew install lazydocker
go install github.com/jesseduffield/lazydocker@latest

# Uso
lazydocker

# Keybindings
# [     - containers
# ]     - images
# d     - delete
# s     - stop
# r     - restart
# l     - logs
```

### tmux
Terminal multiplexer clássico.

```bash
# Instalação
brew install tmux
sudo apt install tmux

# Uso básico
tmux                      # Nova sessão
tmux new -s work          # Nova sessão com nome
tmux attach -t work       # Anexar a sessão
tmux ls                   # Listar sessões

# Keybindings (prefix: Ctrl-b)
# c     - nova janela
# n/p   - próxima/anterior janela
# %     - split vertical
# "     - split horizontal
# d     - detach
# x     - fechar pane
```

### zellij (tmux alternative)
Multiplexer moderno, mais fácil de usar.

```bash
# Instalação
cargo install zellij
brew install zellij

# Uso
zellij                    # Nova sessão
zellij attach             # Anexar a sessão anterior
zellij -s name            # Sessão com nome

# Mais intuitivo que tmux:
# - Keybindings visíveis
# - Layouts prontos
# - Sessões automáticas
```

### k9s
TUI para Kubernetes.

```bash
# Instalação
brew install k9s
go install github.com/derailed/k9s@latest

# Uso
k9s                       # Abrir dashboard
k9s -n namespace          # Namespace específico
k9s --context ctx         # Contexto específico
```

---

## ☁️ CLIs para APIs e Cloud

### GitHub CLI (gh)
```bash
# Instalação
brew install gh
sudo apt install gh

# Setup
gh auth login

# Comandos essenciais
gh repo clone owner/repo
gh pr create
gh pr list
gh pr checkout 123
gh issue create
gh issue list
gh release create v1.0.0
gh workflow run
gh api /user

# Exemplos práticos
gh pr create --fill        # PR com commit messages
gh issue create -t "Bug" -b "Descrição"
```

### AWS CLI
```bash
# Instalação
pip install awscli
brew install awscli

# Configuração
aws configure

# Comandos comuns
aws s3 ls
aws s3 cp file s3://bucket/
aws ec2 describe-instances
aws lambda invoke --function-name func output.json
```

### gcloud CLI
```bash
# Instalação
brew install --cask google-cloud-sdk

# Setup
gcloud init
gcloud auth login

# Comandos comuns
gcloud compute instances list
gcloud run deploy
gcloud functions deploy
```

### Outros CLIs úteis

| CLI | Serviço | Instalação |
|-----|---------|------------|
| **doctl** | DigitalOcean | `brew install doctl` |
| **flyctl** | Fly.io | `brew install flyctl` |
| **railway** | Railway | `npm install -g @railway/cli` |
| **vercel** | Vercel | `npm install -g vercel` |
| **netlify** | Netlify | `npm install -g netlify-cli` |
| **heroku** | Heroku | `brew tap heroku/brew && brew install heroku` |

---

## 🐚 Shell Enhancements

### Starship (Prompt)
Prompt cross-shell, rápido e customizável.

```bash
# Instalação
curl -sS https://starship.rs/install.sh | sh
brew install starship

# Configuração (adicionar ao final do .bashrc/.zshrc)
eval "$(starship init bash)"  # ou zsh

# Configuração (~/.config/starship.toml)
```

```toml
# ~/.config/starship.toml
[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"

[directory]
truncation_length = 3

[git_branch]
symbol = "🌱 "

[python]
symbol = "🐍 "

[nodejs]
symbol = "⬢ "
```

### Oh My Zsh
Framework para Zsh com plugins.

```bash
# Instalação
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Plugins recomendados (~/.zshrc)
plugins=(
    git
    zsh-autosuggestions
    zsh-syntax-highlighting
    docker
    kubectl
    fzf
)
```

### Fish Shell
Shell moderno com features built-in.

```bash
# Instalação
brew install fish
sudo apt install fish

# Tornar default
chsh -s $(which fish)

# Features built-in:
# - Autosuggestions
# - Syntax highlighting
# - Tab completions
# - Web-based config (fish_config)
```

---

## 📊 Processamento de Dados

### jq (JSON processor)
```bash
# Instalação
brew install jq
sudo apt install jq

# Uso básico
cat data.json | jq '.'              # Pretty print
cat data.json | jq '.name'          # Extrair campo
cat data.json | jq '.items[]'       # Iterar array
cat data.json | jq '.items | length' # Contar

# Exemplos práticos
curl api.example.com | jq '.data.users[].name'
echo '{"a":1}' | jq '.a + 1'

# Transformações
jq 'map(.name)'                     # Extrair campo de array
jq 'select(.age > 18)'              # Filtrar
jq '{name: .name, age: .age}'       # Reshaping
```

### yq (YAML processor)
```bash
# Instalação (mikefarah version)
brew install yq
go install github.com/mikefarah/yq/v4@latest

# Uso
yq '.spec.replicas' deployment.yaml
yq '.spec.replicas = 3' deployment.yaml
yq -i '.key = "value"' file.yaml    # In-place edit

# Converter YAML <-> JSON
yq -o=json file.yaml
yq -P file.json                     # JSON para YAML
```

### HTTPie
HTTP client mais amigável que curl.

```bash
# Instalação
brew install httpie
pip install httpie

# Uso
http GET api.example.com
http POST api.example.com name=John age:=30
http PUT api.example.com/1 name=Jane

# Headers e Auth
http api.example.com Authorization:"Bearer token"
http -a user:pass api.example.com

# JSON automático
http POST api.example.com < data.json
```

### xh (HTTPie em Rust)
Alternativa mais rápida ao HTTPie.

```bash
# Instalação
cargo install xh
brew install xh

# Uso (mesma sintaxe que HTTPie)
xh GET api.example.com
xh POST api.example.com name=John
```

---

## 📈 Monitoring e Performance

### btop / bottom
```bash
# btop (C++)
brew install btop
sudo apt install btop

# bottom (Rust)
cargo install bottom
brew install bottom

# Uso
btop              # ou btm para bottom
```

### hyperfine
Benchmarking de comandos.

```bash
# Instalação
cargo install hyperfine
brew install hyperfine

# Uso
hyperfine 'sleep 0.3'
hyperfine --warmup 3 'fd -e py'
hyperfine 'find . -name "*.py"' 'fd -e py'  # Comparar
```

### dust (du replacement)
```bash
# Instalação
cargo install du-dust
brew install dust

# Uso
dust                      # Diretório atual
dust -d 2                 # Profundidade 2
dust /path                # Path específico
```

### duf (df replacement)
```bash
# Instalação
brew install duf
sudo apt install duf

# Uso
duf                       # Overview de discos
duf -only local           # Apenas locais
```

---

## 🚀 Instalação Rápida

### Script Ubuntu/Debian
```bash
#!/bin/bash
# install-cli-tools.sh

# Atualizar
sudo apt update

# Instalar via apt
sudo apt install -y \
    ripgrep \
    fd-find \
    bat \
    fzf \
    tmux \
    jq \
    httpie \
    tldr

# Instalar via cargo (precisa de Rust)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

cargo install \
    eza \
    zoxide \
    du-dust \
    git-delta \
    bottom \
    just \
    hyperfine

# Starship
curl -sS https://starship.rs/install.sh | sh

# lazygit
LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
tar xf lazygit.tar.gz lazygit
sudo install lazygit /usr/local/bin

# AI tools
pip install llm aider-chat

echo "Instalação completa! 🎉"
```

### Script macOS (Homebrew)
```bash
#!/bin/bash
# install-cli-tools-mac.sh

# Produtividade
brew install \
    eza \
    bat \
    ripgrep \
    fd \
    fzf \
    zoxide \
    dust \
    git-delta \
    jq \
    yq \
    httpie

# Dev tools
brew install \
    lazygit \
    lazydocker \
    tmux \
    starship \
    just \
    hyperfine

# AI tools
brew install llm
pip install aider-chat

# CLIs de serviços
brew install \
    gh \
    awscli

echo "Instalação completa! 🎉"
```

### Configuração Shell Recomendada
```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc

# Starship prompt
eval "$(starship init bash)"  # ou zsh

# zoxide
eval "$(zoxide init bash)"    # ou zsh

# fzf
[ -f ~/.fzf.bash ] && source ~/.fzf.bash

# Aliases modernos
alias ls='eza --icons'
alias ll='eza -la --icons --git'
alias cat='bat --paging=never'
alias tree='eza --tree'
alias find='fd'
alias grep='rg'
alias top='btm'
alias du='dust'
alias df='duf'
alias diff='delta'

# Git aliases
alias lg='lazygit'
alias gs='git status'
alias gd='git diff'

# FZF + integrations
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
```

---

## 🎯 Recomendações para AI Assistants

### Essenciais (Instalar Primeiro)
1. **fzf** - Fuzzy finding everywhere
2. **ripgrep** - Busca rápida em código
3. **bat** - Visualização com syntax highlighting
4. **jq** - Manipulação JSON
5. **llm** - LLMs no terminal

### Para Desenvolvimento
1. **lazygit** - Git visual
2. **zoxide** - Navegação rápida
3. **just** - Task runner simples
4. **delta** - Diffs bonitos

### Para Produtividade
1. **eza** - ls moderno
2. **fd** - find simples
3. **tldr** - Man pages úteis
4. **starship** - Prompt informativo

### Para AI Coding
1. **aider** - Pair programming AI
2. **llm** - Queries rápidas a LLMs
3. **gh** - GitHub integration

---

## 📚 Recursos Adicionais

- [Modern Unix](https://github.com/ibraheemdev/modern-unix) - Lista curada de tools modernos
- [awesome-cli-apps](https://github.com/agarrharr/awesome-cli-apps) - Apps CLI incríveis
- [charm.sh](https://charm.sh/) - TUI tools bonitos (gum, mods, vhs)
- [Simon Willison's LLM](https://llm.datasette.io/) - Documentação do llm CLI

---

*Relatório gerado em Janeiro 2026. Tools evoluem rapidamente - verificar versões atuais.*
