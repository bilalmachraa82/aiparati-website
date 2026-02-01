/**
 * Agent Types - AI Para Ti Dream Team Game
 * TypeScript interfaces for autonomous agents
 */

export type AgentClass = 'warrior' | 'mage' | 'healer';

export type ActionType = 
  | 'move'
  | 'attack'
  | 'defend'
  | 'heal'
  | 'cast_spell'
  | 'interact'
  | 'rest'
  | 'idle';

export interface Position {
  x: number;
  y: number;
}

export interface AgentStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface AgentMemory {
  shortTerm: MemoryEntry[];
  longTerm: MemoryEntry[];
  relationships: Map<string, number>; // agentId -> trust level (-100 to 100)
}

export interface MemoryEntry {
  id: string;
  timestamp: number;
  type: 'observation' | 'action' | 'interaction' | 'emotion';
  content: string;
  importance: number; // 0-10
  decay: number; // how fast it fades
}

export interface Observation {
  timestamp: number;
  nearbyAgents: AgentState[];
  nearbyObjects: WorldObject[];
  events: WorldEvent[];
  environment: EnvironmentState;
}

export interface Decision {
  action: ActionType;
  target?: string; // agentId or objectId
  position?: Position;
  reasoning: string;
  priority: number;
  confidence: number; // 0-1
}

export interface AgentState {
  id: string;
  name: string;
  class: AgentClass;
  position: Position;
  stats: AgentStats;
  currentAction: ActionType;
  personality: AgentPersonality;
  memory: AgentMemory;
  isAlive: boolean;
}

export interface AgentPersonality {
  traits: string[];
  goals: string[];
  fears: string[];
  backstory: string;
}

export interface WorldObject {
  id: string;
  type: string;
  position: Position;
  interactable: boolean;
  properties: Record<string, unknown>;
}

export interface WorldEvent {
  id: string;
  type: string;
  timestamp: number;
  position: Position;
  participants: string[];
  description: string;
}

export interface EnvironmentState {
  time: 'day' | 'night' | 'dawn' | 'dusk';
  weather: 'clear' | 'rain' | 'storm' | 'fog';
  dangerLevel: number; // 0-10
}

export interface AgentConfig {
  id: string;
  name: string;
  class: AgentClass;
  personality: AgentPersonality;
  initialPosition: Position;
  initialStats: Partial<AgentStats>;
}

export interface LLMRequest {
  agentState: AgentState;
  observation: Observation;
  systemPrompt: string;
  recentMemories: MemoryEntry[];
}

export interface LLMResponse {
  decision: Decision;
  thoughts: string;
  newMemories: Omit<MemoryEntry, 'id' | 'timestamp'>[];
}
