export interface TransformerRemapConfig {
  type: 'REMAP';
  options: {
    remap: Record<string, string>;
  };
}

export class TransformerRemap {
  constructor(private readonly config: TransformerRemapConfig) {}

  public transform(text: string): string {
    return Object.entries(this.config.options.remap).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(key, 'g'), value),
      text,
    );
  }
}
