import type { ISelector } from './base';

export interface SelectorEntireConfig {
  type: 'ENTIRE';
}

export class EntireSelector implements ISelector {
  constructor(private readonly config: SelectorEntireConfig) {}

  public select(text: string): number[][] {
    // Select the entire text as a single range
    return [[0, text.length]];
  }
}
