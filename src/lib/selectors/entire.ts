import type { ISelector } from './base';

export interface SelectorEntireConfig {
  type: 'ENTIRE';
  options: null;
}

export class EntireSelector implements ISelector {
  constructor(readonly config: SelectorEntireConfig) {}

  public select(text: string): number[][] {
    // Select the entire text as a single range
    return [[0, text.length]];
  }
}
