/**
 * AiParaTi Dream Team Dashboard v2.1
 * Single source of truth: data.json
 */

let data = null;
let selectedAgent = null;

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
        
        updateStats();
        renderSquads();
        selectAgent('jarvis');
        
        // Search functionality
        document.getElementById('search').addEventListener('input', handleSearch);
    } catch (error) {
        console.error('Failed to load data:', error);
        document.getElementById('agent-detail').innerHTML = 
            '<div class="loading">Erro a carregar dados. Tenta recarregar a página.</div>';
    }
}

function updateStats() {
    document.getElementById('stat-agents').textContent = data.stats.totalAgents;
    document.getElementById('stat-squads').textContent = data.stats.squads;
    document.getElementById('stat-efficiency').textContent = data.stats.efficiency;
}

function renderSquads() {
    const container = document.getElementById('squads-list');
    container.innerHTML = '';
    
    for (const [squadId, squad] of Object.entries(data.squads)) {
        const section = document.createElement('div');
        section.className = 'squad-section';
        
        section.innerHTML = `
            <div class="squad-header">
                <span>${squad.icon}</span>
                <span>${squad.name}</span>
            </div>
            <div class="agent-list" role="list">
                ${squad.agents.map(agentId => renderAgentItem(agentId)).join('')}
            </div>
        `;
        
        container.appendChild(section);
    }
    
    // Add click handlers
    container.querySelectorAll('.agent-item').forEach(item => {
        item.addEventListener('click', () => selectAgent(item.dataset.id));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectAgent(item.dataset.id);
            }
        });
    });
}

function renderAgentItem(agentId) {
    const agent = data.agents[agentId];
    if (!agent) return '';
    
    const avatarContent = agent.avatar 
        ? `<img src="${agent.avatar}" alt="Avatar de ${agent.name}">`
        : agent.name[0];
    
    return `
        <button class="agent-item" data-id="${agentId}" 
                role="listitem" tabindex="0"
                aria-label="${agent.name} - ${agent.role}">
            <div class="agent-avatar" style="background: ${agent.gradient}">
                ${avatarContent}
            </div>
            <div class="agent-info">
                <div class="agent-name">${agent.name}</div>
                <div class="agent-role">${agent.role}</div>
            </div>
        </button>
    `;
}

function selectAgent(agentId) {
    selectedAgent = agentId;
    
    // Update active state
    document.querySelectorAll('.agent-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === agentId);
    });
    
    // Render detail
    renderAgentDetail(agentId);
}

function renderAgentDetail(agentId) {
    const agent = data.agents[agentId];
    if (!agent) return;
    
    const container = document.getElementById('agent-detail');
    
    const avatarContent = agent.avatar 
        ? `<img src="${agent.avatar}" alt="Avatar de ${agent.name} - ${agent.fullName}">`
        : agent.name[0];
    
    container.innerHTML = `
        <article class="agent-detail-content">
            <header class="agent-header">
                <div class="agent-header-avatar" style="background: ${agent.gradient}">
                    ${avatarContent}
                </div>
                <div class="agent-header-info">
                    <h2>${agent.name}</h2>
                    <p class="role">${agent.role}</p>
                    <span class="model">${agent.model}</span>
                    <div class="traits">
                        ${agent.traits.map(t => `<span class="trait">${t}</span>`).join('')}
                    </div>
                </div>
            </header>
            
            <section class="section">
                <h3>📝 Sobre</h3>
                <p>${agent.description}</p>
            </section>
            
            <section class="section">
                <h3>📊 KPIs</h3>
                <div class="kpis">
                    ${agent.kpis.map(kpi => `
                        <div class="kpi">
                            <div class="kpi-value">${kpi.value}</div>
                            <div class="kpi-label">${kpi.label}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section class="section">
                <h3>⚡ Responsabilidades</h3>
                <div class="responsibilities">
                    ${agent.responsibilities.map(r => 
                        `<span class="responsibility">${r}</span>`
                    ).join('')}
                </div>
            </section>
        </article>
    `;
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    document.querySelectorAll('.agent-item').forEach(item => {
        const agentId = item.dataset.id;
        const agent = data.agents[agentId];
        
        const matches = !query || 
            agent.name.toLowerCase().includes(query) ||
            agent.role.toLowerCase().includes(query) ||
            agent.fullName.toLowerCase().includes(query);
        
        item.style.display = matches ? 'flex' : 'none';
    });
}
