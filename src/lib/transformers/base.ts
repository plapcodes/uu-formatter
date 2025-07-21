import type { TransformerRemapConfig } from './remap';
import { TransformerRemap } from './remap';

/**
 * Interface for a transformer that processes text and applies transformations based on specified ranges.
 */
export interface ITransformer {
  /**
   * Transforms the given text based on the specified ranges.
   * @param text The text to be transformed.
   * @param ranges A range of text to be transformed, represented as [start, end].
   * @returns The transformed text.
   */
  transform(text: string): string;
  readonly config: TransformerConfig;
}

export type TransformerConfig = TransformerRemapConfig;

export function createTransformer(config: TransformerConfig): ITransformer {
  switch (config.type) {
    case 'REMAP':
      return new TransformerRemap(config);
    default:
      throw new Error(`Unknown transformer type: ${config.type}`);
  }
}
