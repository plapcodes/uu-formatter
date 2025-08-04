import Graphemer from 'graphemer';

export function countCharacters(
  text: string,
  algorithm: 'default' | 'grapheme' = 'default',
): number {
  if (algorithm === 'grapheme') {
    const splitter = new Graphemer();
    return splitter.countGraphemes(text);
  } else {
    return text.length;
  }
}
