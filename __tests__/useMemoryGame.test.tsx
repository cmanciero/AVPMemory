import React, { useEffect } from 'react';

import { act, render } from '@testing-library/react-native';

import { useMemoryGame } from '../src/hooks/useMemoryGame';
import { Difficulty } from '../src/types';

interface HookSnapshot {
	cards: ReturnType<typeof useMemoryGame>['cards'];
	elapsedMs: number;
	finished: boolean;
	disabled: boolean;
	resetGame: (level: Difficulty) => void;
	flipCard: (cardKey: string) => void;
}

function HookHarness({ level, onUpdate }: { level: Difficulty; onUpdate: (snapshot: HookSnapshot) => void }): null {
	const game = useMemoryGame(level);

	useEffect(() => {
		onUpdate(game);
	}, [game, onUpdate]);

	return null;
}

describe('useMemoryGame', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2026-03-26T12:00:00.000Z'));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('stops the timer once the game is finished', () => {
		let latest: HookSnapshot | undefined;

		render(
			<HookHarness
				level='easy'
				onUpdate={(snapshot) => {
					latest = snapshot;
				}}
			/>,
		);

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(latest?.elapsedMs).toBe(1000);

		const pairIds = [...new Set(latest?.cards.map((card) => card.pairId))];

		pairIds.forEach((pairId) => {
			const pairCards = latest?.cards.filter((card) => card.pairId === pairId);

			if (!pairCards || pairCards.length !== 2) {
				throw new Error(`Expected exactly two cards for pair ${pairId}`);
			}

			act(() => {
				latest?.flipCard(pairCards[0]!.key);
			});

			act(() => {
				latest?.flipCard(pairCards[1]!.key);
			});

			act(() => {
				jest.advanceTimersByTime(300);
			});
		});

		expect(latest?.finished).toBe(true);

		const frozenElapsed = latest?.elapsedMs;

		act(() => {
			jest.advanceTimersByTime(2000);
		});

		expect(latest?.elapsedMs).toBe(frozenElapsed);
	});
});
