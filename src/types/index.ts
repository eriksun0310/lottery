export interface Participant {
  id: string;
  email: string;
  name: string;
}

export interface LotteryConfig {
  eventName: string;
  prizeName: string;
  winnerCount: number;
}

export interface Winner extends Participant {
  prizeOrder: number;
}

export type LotteryState = 'setup' | 'drawing' | 'result';
