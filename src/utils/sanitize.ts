export function stripStars(text: string): string {
  if (!text) return '';
  return text.replace(/\*/g, '');
}

export default { stripStars };
