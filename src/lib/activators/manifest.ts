import type { ActivatorConfig } from './base';
import type { ParameterMetadata } from '../metadatabase';

export interface ActivatorMetadata {
  type: ActivatorConfig['type'];
  name: string;
  description: string;
  parameters: ParameterMetadata[];

  getDefaultConfig: () => ActivatorConfig;
}

export const ACTIVATOR_MANIFEST: ActivatorMetadata[] = [
  {
    type: 'ALWAYS',
    name: 'Always On/Off',
    description: 'A simple switch to enable or disable the layer.',
    parameters: [
      {
        key: 'enabled',
        name: 'Enabled',
        description: 'Check this to make the layer active.',
        controlType: 'checkbox',
      },
    ],
    getDefaultConfig: () => ({
      type: 'ALWAYS',
      options: { enabled: true },
    }),
  },
];
