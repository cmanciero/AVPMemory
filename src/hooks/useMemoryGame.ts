import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Difficulty, GameCard } from '../types';
import { createDeck } from '../utils/game';

interface UseMemoryGameResult {
  cards: GameCard[];
  elapsedMs: number;
  finished: boolean;
  disabled: boolean;
  resetGame: (level: Difficulty) => void;
  flipCard: (cardKey: string) => void;
}

function getTemplateIds(cards: GameCard[]): string[] {
  return [...new Set(cards.map((card) => card.pairId.replace(/-\d+$/, '')))].sort();
}

export function useMemoryGame(level: Difficulty): UseMemoryGameResult {
  const [cards, setCards] = useState<GameCard[]>(() => createDeck(level));
  const [flippedKeys, setFlippedKeys] = useState<string[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef<number>(Date.now());
  const templateIdsRef = useRef<string[]>(getTemplateIds(cards));
  const finished = useMemo(() => cards.length > 0 && cards.every((card) => card.isMatched), [cards]);

  useEffect(() => {
    if (finished) {
      return undefined;
    }

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 250);

    return () => clearInterval(interval);
  }, [finished]);

  useEffect(() => {
    if (finished) {
      setElapsedMs(Date.now() - startRef.current);
      setBlocked(true);
    }
  }, [finished]);

  const resetGame = useCallback((nextLevel: Difficulty): void => {
    const nextDeck = createDeck(nextLevel, templateIdsRef.current);

    templateIdsRef.current = getTemplateIds(nextDeck);
    setCards(nextDeck);
    setFlippedKeys([]);
    setBlocked(false);
    startRef.current = Date.now();
    setElapsedMs(0);
  }, []);

  const flipCard = useCallback((cardKey: string): void => {
    if (blocked || finished) {
      return;
    }

    const selected = cards.find((card) => card.key === cardKey);

    if (!selected || selected.isFlipped || selected.isMatched) {
      return;
    }

    const nextCards = cards.map((card) =>
      card.key === cardKey
        ? {
            ...card,
            isFlipped: true,
          }
        : card,
    );

    const nextFlipped = [...flippedKeys, cardKey];

    setCards(nextCards);
    setFlippedKeys(nextFlipped);

    if (nextFlipped.length !== 2) {
      return;
    }

    const [firstKey, secondKey] = nextFlipped;
    const firstCard = nextCards.find((card) => card.key === firstKey);
    const secondCard = nextCards.find((card) => card.key === secondKey);

    if (!firstCard || !secondCard) {
      setFlippedKeys([]);
      return;
    }

    setBlocked(true);

    if (firstCard.pairId === secondCard.pairId) {
      const matched = nextCards.map((card) =>
        card.key === firstKey || card.key === secondKey
          ? {
              ...card,
              isMatched: true,
            }
          : card,
      );

      setTimeout(() => {
        setCards(matched);
        setFlippedKeys([]);
        setBlocked(false);
      }, 250);

      return;
    }

    setTimeout(() => {
      const reset = nextCards.map((card) =>
        card.key === firstKey || card.key === secondKey
          ? {
              ...card,
              isFlipped: false,
            }
          : card,
      );

      setCards(reset);
      setFlippedKeys([]);
      setBlocked(false);
    }, 700);
  }, [blocked, cards, finished, flippedKeys]);

  return {
    cards,
    elapsedMs,
    finished,
    disabled: blocked,
    resetGame,
    flipCard,
  };
}
