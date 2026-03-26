import { CARD_TEMPLATES } from '../constants/cards';
import { CardTemplate, Difficulty, GameCard } from '../types';

const PAIRS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 9,
};

export function getPairsByDifficulty(level: Difficulty): number {
  return PAIRS_BY_DIFFICULTY[level];
}

export function createDeck(level: Difficulty, previousTemplateIds: string[] = []): GameCard[] {
  const pairs = getPairsByDifficulty(level);

  if (CARD_TEMPLATES.length < pairs) {
    throw new Error(`Not enough card templates for ${level} mode. Expected ${pairs}, received ${CARD_TEMPLATES.length}.`);
  }

  const selected = selectTemplates(pairs, previousTemplateIds);

  const doubled = selected.flatMap((template, index) => {
    const pairId = `${template.id}-${index}`;

    return [
      {
        key: `${pairId}-a`,
        pairId,
        image: template.image,
        isFlipped: false,
        isMatched: false,
      },
      {
        key: `${pairId}-b`,
        pairId,
        image: template.image,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return shuffleCards(doubled);
}

function selectTemplates(pairs: number, previousTemplateIds: string[]): CardTemplate[] {
  const shuffled = shuffleCards(CARD_TEMPLATES);
  const selected = shuffled.slice(0, pairs);

  if (CARD_TEMPLATES.length === pairs) {
    return selected;
  }

  if (!hasSameTemplateSet(selected, previousTemplateIds)) {
    return selected;
  }

  const replacement = shuffled[pairs];

  if (!replacement) {
    return selected;
  }

  return [...selected.slice(0, pairs - 1), replacement];
}

function hasSameTemplateSet(selected: CardTemplate[], previousTemplateIds: string[]): boolean {
  if (selected.length !== previousTemplateIds.length) {
    return false;
  }

  const selectedIds = selected.map((template) => template.id).sort();
  const normalizedPreviousIds = [...previousTemplateIds].sort();

  return selectedIds.every((id, index) => id === normalizedPreviousIds[index]);
}

export function shuffleCards<T>(cards: T[]): T[] {
  const items = [...cards];

  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
