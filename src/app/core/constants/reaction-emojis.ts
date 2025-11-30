export const REACTION_EMOJIS: Record<string, string> = {
  'Me gusta': '👍',
  'No me gusta': '👎',
  'Me encanta': '❤️',
  'Enojado': '😠',
  'Triste': '😢',
  'Sorprendido': '😮',
  'Divertido': '😄',
  'Me importa': '🤗',
  'Confundido': '😕',
  'Emocionado': '🤩',
};

export function getReactionEmoji(reactionName: string): string {
  return REACTION_EMOJIS[reactionName] || '👍';
}
