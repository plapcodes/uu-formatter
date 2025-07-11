import type { SelectorEntireConfig } from './entire';
import { EntireSelector } from './entire';

/**
 * Interface for a text selector that identifies ranges of text based on specific criteria.
 */
export interface ISelector {
  /**
   * Selects ranges of text based on the provided text.
   * @param text The text to select ranges from.
   * @returns An array of ranges, where each range is represented as [start, end].
   */
  select(text: string): number[][];
}

export type SelectorConfig = SelectorEntireConfig;

export function createSelector(config: SelectorConfig): ISelector {
  switch (config.type) {
    case 'ENTIRE':
      return new EntireSelector(config);
    default:
      throw new Error(`Unknown selector type: ${config.type}`);
  }
}
