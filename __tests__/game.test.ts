import { CARD_TEMPLATES } from '../src/constants/cards';
import { createDeck, formatDuration, getPairsByDifficulty } from '../src/utils/game';

function getSelectedTemplateIds(deck: ReturnType<typeof createDeck>): string[] {
  return [...new Set(deck.map((card) => card.pairId.replace(/-\d+$/, '')))].sort();
}

describe('game utils', () => {
  it('returns expected pair counts by level', () => {
    expect(getPairsByDifficulty('easy')).toBe(3);
    expect(getPairsByDifficulty('medium')).toBe(4);
    expect(getPairsByDifficulty('hard')).toBe(9);
  });

  it('creates an even deck with duplicated pairs', () => {
    const deck = createDeck('medium');

    expect(deck).toHaveLength(8);

    const countByPair = deck.reduce<Record<string, number>>((acc, card) => {
      acc[card.pairId] = (acc[card.pairId] ?? 0) + 1;
      return acc;
    }, {});

    Object.values(countByPair).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it('selects pairs from the full template pool instead of the first entries only', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    const deck = createDeck('medium');
    const selectedIds = getSelectedTemplateIds(deck);
    const firstFourIds = CARD_TEMPLATES.slice(0, 4).map((template) => template.id).sort();

    expect(selectedIds).not.toEqual(firstFourIds);
    expect(selectedIds).toHaveLength(4);

    randomSpy.mockRestore();
  });

  it('avoids repeating the exact same template set across consecutive games when alternatives exist', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);

    const firstDeck = createDeck('medium');
    const previousIds = getSelectedTemplateIds(firstDeck);
    const nextDeck = createDeck('medium', previousIds);
    const nextIds = getSelectedTemplateIds(nextDeck);

    expect(nextIds).not.toEqual(previousIds);
    expect(nextIds).toHaveLength(4);

    randomSpy.mockRestore();
  });

  it('formats time as mm:ss', () => {
    expect(formatDuration(65_000)).toBe('01:05');
    expect(formatDuration(7_000)).toBe('00:07');
  });

  it('creates a larger hard deck now that more card images are available', () => {
    const deck = createDeck('hard');

    expect(deck).toHaveLength(18);
    expect(getSelectedTemplateIds(deck)).toHaveLength(9);
  });
});
