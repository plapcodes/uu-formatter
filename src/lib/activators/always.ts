import type { IActivator } from './base';

export interface ActivatorAlwaysConfig {
  type: 'ALWAYS';
  options: {
    enabled: boolean;
  };
}

export class AlwaysActivator implements IActivator {
  constructor(readonly config: ActivatorAlwaysConfig) {}

  public isActive(text: string): boolean {
    return this.config.options.enabled;
  }
}
