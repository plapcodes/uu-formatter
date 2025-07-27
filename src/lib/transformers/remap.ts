export interface TransformerRemapConfig {
  type: 'REMAP';
  options: {
    remap: string[][];
  };
}

export class TransformerRemap {
  constructor(readonly config: TransformerRemapConfig) {}

  public transform(text: string): string {
    const remap = this.config.options.remap;
    let transformedText = text;

    // Escape special regex characters in 'from'
    function escapeRegExp(str: string): string {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    for (const [from, to] of remap) {
      const regex = new RegExp(escapeRegExp(from), 'g');
      transformedText = transformedText.replace(regex, to);
    }

    return transformedText;
  }
}
