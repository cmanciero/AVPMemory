import { render, screen } from '@testing-library/react-native';

import { CardTile } from '../src/components/CardTile';
import { useMemoryGame } from '../src/hooks/useMemoryGame';
import { GameScreen, shouldUseCompactTiles } from '../src/screens/GameScreen';

jest.mock('../src/hooks/useMemoryGame', () => ({
	useMemoryGame: jest.fn(),
}));

jest.mock('../src/storage/scoreboard', () => ({
	addScoreboardEntry: jest.fn(async () => undefined),
	getScoreboardEntries: jest.fn(async () => []),
}));

jest.mock('../src/utils/sounds', () => ({
	playFeedback: jest.fn(async () => undefined),
}));

const mockUseMemoryGame = jest.mocked(useMemoryGame);

const baseCards = Array.from({ length: 18 }, (_, index) => {
	const pairNumber = Math.floor(index / 2) + 1;
	const suffix = index % 2 === 0 ? 'a' : 'b';

	return {
		key: `pair-${pairNumber}-${suffix}`,
		pairId: `pair-${pairNumber}`,
		image: index + 1,
		isFlipped: false,
		isMatched: false,
	};
});

describe('GameScreen', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseMemoryGame.mockReturnValue({
			cards: baseCards,
			elapsedMs: 0,
			finished: false,
			disabled: false,
			resetGame: jest.fn(),
			flipCard: jest.fn(),
		});
	});

	it('uses compact card tiles for hard mode on smaller screens', () => {
		expect(shouldUseCompactTiles('hard', 375)).toBe(true);
		expect(shouldUseCompactTiles('medium', 375)).toBe(false);
		expect(shouldUseCompactTiles('hard', 428)).toBe(false);

		render(
			<CardTile
				card={baseCards[0]!}
				onPress={jest.fn()}
				disabled={false}
				compact
			/>,
		);

		expect(screen.getByTestId('card-pair-1-a')).toHaveStyle({
			width: '30%',
			aspectRatio: 0.92,
			marginBottom: 8,
		});
	});

	it('renders hard mode cards on the game screen', () => {
		render(
			<GameScreen
				level='hard'
				onChangeLevel={jest.fn()}
				onHome={jest.fn()}
				onViewScoreboard={jest.fn()}
			/>,
		);

		expect(screen.getByTestId('card-pair-1-a')).toBeOnTheScreen();
	});
});
