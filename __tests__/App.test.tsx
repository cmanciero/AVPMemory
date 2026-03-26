import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from '../App';

jest.mock('../src/storage/scoreboard', () => ({
	addScoreboardEntry: jest.fn(async () => undefined),
	getScoreboardEntries: jest.fn(async () => []),
}));

describe('App', () => {
	it('renders the home screen on launch', () => {
		render(<App />);

		expect(screen.getByTestId('home-play-button')).toBeOnTheScreen();
		expect(screen.getByTestId('home-difficulty-easy')).toBeOnTheScreen();
		expect(screen.getByTestId('home-difficulty-medium')).toBeOnTheScreen();
		expect(screen.getByTestId('home-difficulty-hard')).toBeOnTheScreen();
	});

	it('navigates to game screen when PLAY is pressed', async () => {
		render(<App />);

		await act(async () => {
			fireEvent.press(screen.getByTestId('home-play-button'));
		});

		expect(screen.getByTestId('restart-game')).toBeOnTheScreen();
	});

	it('navigates to scoreboard screen from home', async () => {
		render(<App />);

		await act(async () => {
			fireEvent.press(screen.getByTestId('home-scoreboard-button'));
		});

		await waitFor(() => {
			expect(screen.getByText('Scoreboard')).toBeOnTheScreen();
		});
	});
});
