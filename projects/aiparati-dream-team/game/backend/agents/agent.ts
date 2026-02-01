/**
 * Agent Class - AI Para Ti Dream Team Game
 * Core autonomous agent with observe, decide, execute loop
 */

import {
  AgentState,
  AgentConfig,
  AgentStats,
  AgentMemory,
  Observation,
  Decision,
  MemoryEntry,
  ActionType,
  LLMRequest,
  LLMResponse,
} from '../../shared/types/agent';

const DEFAULT_STATS: Record<string, AgentStats> = {
  warrior: {
    health: 150,
    maxHealth: 150,
    mana: 30,
    maxMana: 30,
    attack: 20,
    defense: 15,
    speed: 8,
  },
  mage: {
    health: 80,
    maxHealth: 80,
    mana: 150,
    maxMana: 150,
    attack: 8,
    defense: 5,
    speed: 10,
  },
  healer: {
    health: 100,
    maxHealth: 100,
    mana: 120,
    maxMana: 120,
    attack: 5,
    defense: 8,
    speed: 9,
  },
};

export class Agent {
  private state: AgentState;
  private lastDecision: Decision | null = null;
  private tickCount: number = 0;

  constructor(config: AgentConfig) {
    const baseStats = DEFAULT_STATS[config.class];
    
    this.state = {
      id: config.id,
      name: config.name,
      class: config.class,
      position: { ...config.initialPosition },
      stats: {
        ...baseStats,
        ...config.initialStats,
      },
      currentAction: 'idle',
      personality: config.personality,
      memory: {
        shortTerm: [],
        longTerm: [],
        relationships: new Map(),
      },
      isAlive: true,
    };
  }

  /**
   * OBSERVE - Gather information about the world
   * Called every tick to update agent's perception
   */
  async observe(worldState: Observation): Promise<void> {
    // Store observation as short-term memory
    const observationMemory: MemoryEntry = {
      id: `obs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'observation',
      content: this.summarizeObservation(worldState),
      importance: this.calculateImportance(worldState),
      decay: 0.1,
    };

    this.addMemory(observationMemory);

    // Process events and update relationships
    for (const event of worldState.events) {
      if (event.participants.includes(this.state.id)) {
        await this.processEvent(event);
      }
    }

    // Decay old memories
    this.decayMemories();
  }

  /**
   * DECIDE - Use LLM to make decisions based on observations
   * Returns the next action to take
   */
  async decide(
    observation: Observation,
    llmClient: (request: LLMRequest) => Promise<LLMResponse>
  ): Promise<Decision> {
    // Build context from recent memories
    const recentMemories = [
      ...this.state.memory.shortTerm.slice(-10),
      ...this.state.memory.longTerm.slice(-5),
    ].sort((a, b) => b.importance - a.importance);

    // Get system prompt for this agent class
    const systemPrompt = this.getSystemPrompt();

    // Call LLM for decision
    const request: LLMRequest = {
      agentState: this.state,
      observation,
      systemPrompt,
      recentMemories,
    };

    try {
      const response = await llmClient(request);

      // Store new memories from LLM
      for (const memory of response.newMemories) {
        this.addMemory({
          ...memory,
          id: `llm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        });
      }

      this.lastDecision = response.decision;
      return response.decision;

    } catch (error) {
      // Fallback to basic AI if LLM fails
      console.warn(`LLM failed for ${this.state.name}, using fallback`);
      return this.fallbackDecision(observation);
    }
  }

  /**
   * EXECUTE - Perform the decided action
   * Updates agent state and returns result
   */
  async execute(
    decision: Decision,
    executeAction: (agent: AgentState, decision: Decision) => Promise<boolean>
  ): Promise<boolean> {
    // Validate action is possible
    if (!this.canPerformAction(decision.action)) {
      console.warn(`${this.state.name} cannot perform ${decision.action}`);
      return false;
    }

    // Update current action
    this.state.currentAction = decision.action;

    // Execute via world system
    const success = await executeAction(this.state, decision);

    // Store action result in memory
    const actionMemory: MemoryEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type: 'action',
      content: `${decision.action}: ${decision.reasoning} - ${success ? 'Success' : 'Failed'}`,
      importance: success ? 5 : 7, // Failures are more memorable
      decay: 0.05,
    };

    this.addMemory(actionMemory);

    this.tickCount++;
    return success;
  }

  /**
   * Main loop - observe, decide, execute
   */
  async tick(
    worldState: Observation,
    llmClient: (request: LLMRequest) => Promise<LLMResponse>,
    executeAction: (agent: AgentState, decision: Decision) => Promise<boolean>
  ): Promise<void> {
    if (!this.state.isAlive) return;

    // 1. Observe
    await this.observe(worldState);

    // 2. Decide (not every tick to save LLM calls)
    let decision: Decision;
    if (this.tickCount % 5 === 0 || this.needsNewDecision(worldState)) {
      decision = await this.decide(worldState, llmClient);
    } else {
      decision = this.lastDecision || this.fallbackDecision(worldState);
    }

    // 3. Execute
    await this.execute(decision, executeAction);
  }

  // --- Helper Methods ---

  private summarizeObservation(obs: Observation): string {
    const agents = obs.nearbyAgents.map(a => `${a.name}(${a.class})`).join(', ');
    const objects = obs.nearbyObjects.length;
    const events = obs.events.length;
    return `Nearby: [${agents}], ${objects} objects, ${events} events, ${obs.environment.time}, ${obs.environment.weather}`;
  }

  private calculateImportance(obs: Observation): number {
    let importance = 1;
    importance += obs.nearbyAgents.length * 0.5;
    importance += obs.events.length * 2;
    importance += obs.environment.dangerLevel * 0.5;
    return Math.min(10, importance);
  }

  private addMemory(memory: MemoryEntry): void {
    if (memory.importance >= 7) {
      this.state.memory.longTerm.push(memory);
      // Keep only top 100 long-term memories
      if (this.state.memory.longTerm.length > 100) {
        this.state.memory.longTerm.sort((a, b) => b.importance - a.importance);
        this.state.memory.longTerm = this.state.memory.longTerm.slice(0, 100);
      }
    } else {
      this.state.memory.shortTerm.push(memory);
      // Keep only last 50 short-term memories
      if (this.state.memory.shortTerm.length > 50) {
        this.state.memory.shortTerm.shift();
      }
    }
  }

  private decayMemories(): void {
    // Decay short-term memories
    this.state.memory.shortTerm = this.state.memory.shortTerm.filter(m => {
      m.importance -= m.decay;
      return m.importance > 0;
    });
  }

  private async processEvent(event: { type: string; participants: string[] }): Promise<void> {
    // Update relationships based on events
    for (const participantId of event.participants) {
      if (participantId === this.state.id) continue;
      
      const currentTrust = this.state.memory.relationships.get(participantId) || 0;
      let trustChange = 0;

      if (event.type === 'helped') trustChange = 10;
      else if (event.type === 'attacked') trustChange = -20;
      else if (event.type === 'traded') trustChange = 5;

      this.state.memory.relationships.set(
        participantId,
        Math.max(-100, Math.min(100, currentTrust + trustChange))
      );
    }
  }

  private getSystemPrompt(): string {
    // This would load from prompts.md in production
    const prompts: Record<string, string> = {
      warrior: `You are ${this.state.name}, a brave warrior. Protect allies, engage enemies.`,
      mage: `You are ${this.state.name}, a wise mage. Use magic strategically, conserve mana.`,
      healer: `You are ${this.state.name}, a caring healer. Prioritize healing allies.`,
    };
    return prompts[this.state.class] || prompts.warrior;
  }

  private canPerformAction(action: ActionType): boolean {
    const { stats } = this.state;
    
    switch (action) {
      case 'cast_spell':
        return stats.mana >= 10;
      case 'heal':
        return this.state.class === 'healer' && stats.mana >= 15;
      case 'attack':
        return stats.health > 0;
      default:
        return true;
    }
  }

  private needsNewDecision(obs: Observation): boolean {
    // Need new decision if danger or significant change
    return (
      obs.environment.dangerLevel > 5 ||
      obs.events.some(e => e.type === 'attacked') ||
      obs.nearbyAgents.some(a => !a.isAlive && a.id !== this.state.id)
    );
  }

  private fallbackDecision(obs: Observation): Decision {
    // Simple rule-based fallback
    const { stats, class: agentClass } = this.state;

    // Healer logic
    if (agentClass === 'healer') {
      const injuredAlly = obs.nearbyAgents.find(
        a => a.stats.health < a.stats.maxHealth * 0.5 && a.isAlive
      );
      if (injuredAlly && stats.mana >= 15) {
        return {
          action: 'heal',
          target: injuredAlly.id,
          reasoning: 'Ally needs healing',
          priority: 10,
          confidence: 0.8,
        };
      }
    }

    // Warrior logic
    if (agentClass === 'warrior' && obs.environment.dangerLevel > 3) {
      return {
        action: 'defend',
        reasoning: 'High danger, defensive stance',
        priority: 8,
        confidence: 0.7,
      };
    }

    // Default: idle
    return {
      action: 'idle',
      reasoning: 'Nothing urgent',
      priority: 1,
      confidence: 0.5,
    };
  }

  // --- Public Getters ---

  getState(): AgentState {
    return { ...this.state };
  }

  getId(): string {
    return this.state.id;
  }

  getName(): string {
    return this.state.name;
  }

  isAlive(): boolean {
    return this.state.isAlive;
  }

  // --- State Modifiers (for world system) ---

  takeDamage(amount: number): void {
    this.state.stats.health = Math.max(0, this.state.stats.health - amount);
    if (this.state.stats.health === 0) {
      this.state.isAlive = false;
    }
  }

  heal(amount: number): void {
    this.state.stats.health = Math.min(
      this.state.stats.maxHealth,
      this.state.stats.health + amount
    );
  }

  useMana(amount: number): boolean {
    if (this.state.stats.mana < amount) return false;
    this.state.stats.mana -= amount;
    return true;
  }

  moveTo(x: number, y: number): void {
    this.state.position = { x, y };
  }
}

export default Agent;
