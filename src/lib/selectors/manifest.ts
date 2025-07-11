import type { SelectorConfig } from './base';
import type { ParameterMetadata } from '../metadatabase';

export interface SelectorMetadata {
  type: SelectorConfig['type'];
  name: string;
  description: string;
  parameters: ParameterMetadata[];

  getDefaultConfig: () => SelectorConfig;
}

export const SELECTOR_MANIFEST: SelectorMetadata[] = [
  {
    type: 'ENTIRE',
    name: 'Entire Text',
    description: 'Selects the entire text.',
    parameters: [],
    getDefaultConfig: () => ({
      type: 'ENTIRE',
    }),
  },
];
