import { AlwaysActivator, type ActivatorAlwaysConfig } from './always';

/**
 * Interface for an activator that determines if a layer should be active based on some criteria.
 */
export interface IActivator {
  /**
   * Checks if the activator is active for the given text.
   * @param text The text to check against the activator's criteria.
   * @returns True if the activator is active, false otherwise.
   */
  isActive(text: string): boolean;
  readonly config: ActivatorConfig;
}

export type ActivatorConfig = ActivatorAlwaysConfig;

export function createActivator(config: ActivatorConfig): IActivator {
  switch (config.type) {
    case 'ALWAYS':
      return new AlwaysActivator(config);
    default:
      throw new Error(`Unknown activator type: ${config.type}`);
  }
}
