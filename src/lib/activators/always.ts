import type { IActivator } from './base';

export interface ActivatorAlwaysConfig {
  type: 'ALWAYS';
  options: {
    enabled: boolean;
  };
}

export class AlwaysActivator implements IActivator {
  constructor(private readonly options: ActivatorAlwaysConfig['options']) {}

  public isActive(text: string): boolean {
    return this.options.enabled;
  }
}
