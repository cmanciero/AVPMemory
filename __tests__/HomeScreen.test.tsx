import { fireEvent, render, screen } from '@testing-library/react-native';

import { HomeScreen } from '../src/screens/HomeScreen';

const mockOnSelectLevel = jest.fn();
const mockOnPlay = jest.fn();
const mockOnViewScoreboard = jest.fn();

function renderHome(level: 'easy' | 'medium' | 'hard' = 'easy') {
	return render(
		<HomeScreen
			selectedLevel={level}
			onSelectLevel={mockOnSelectLevel}
			onPlay={mockOnPlay}
			onViewScoreboard={mockOnViewScoreboard}
		/>,
	);
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('HomeScreen', () => {
	it('renders all three difficulty buttons', () => {
		renderHome();

		expect(screen.getByTestId('home-difficulty-easy')).toBeOnTheScreen();
		expect(screen.getByTestId('home-difficulty-medium')).toBeOnTheScreen();
		expect(screen.getByTestId('home-difficulty-hard')).toBeOnTheScreen();
	});

	it('renders the play button', () => {
		renderHome();

		expect(screen.getByTestId('home-play-button')).toBeOnTheScreen();
	});

	it('renders the scoreboard button', () => {
		renderHome();

		expect(screen.getByTestId('home-scoreboard-button')).toBeOnTheScreen();
	});

	it('calls onSelectLevel with correct level when difficulty button pressed', () => {
		renderHome();

		fireEvent.press(screen.getByTestId('home-difficulty-hard'));

		expect(mockOnSelectLevel).toHaveBeenCalledWith('hard');
	});

	it('calls onViewScoreboard when scoreboard button pressed', () => {
		renderHome();

		fireEvent.press(screen.getByTestId('home-scoreboard-button'));

		expect(mockOnViewScoreboard).toHaveBeenCalledTimes(1);
	});

	it('shows SELECTED indicator for the current level', () => {
		renderHome('medium');

		expect(screen.getAllByText(/SELECTED/i).length).toBeGreaterThan(0);
	});
});
