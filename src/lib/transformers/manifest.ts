import type { TransformerConfig } from './base';
import type { ParameterMetadata } from '../metadatabase';

export interface TransformerMetadata {
  type: TransformerConfig['type'];
  name: string;
  description: string;
  parameters: ParameterMetadata[];

  getDefaultConfig: () => TransformerConfig;
}

export const TRANSFORMER_MANIFEST: TransformerMetadata[] = [
  {
    type: 'REMAP',
    name: 'Remap Text',
    description: 'Remap a part of the text to a different value.',
    parameters: [
      {
        key: 'remap',
        name: 'Map',
        description: 'A mapping of original text to new text.',
        controlType: 'doubleText',
      },
    ],
    getDefaultConfig: () => ({
      type: 'REMAP',
      options: {
        remap: {
          '': '', // Default empty mapping
        },
      },
    }),
  },
];
