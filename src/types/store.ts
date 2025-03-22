import type { KnowledgeState } from './knowledge';
import type { UserState } from './user';

export interface RootState {
  knowledge: KnowledgeState;
  user: UserState;
} 