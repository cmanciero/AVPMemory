import React, { useCallback, useEffect, useState } from 'react';

import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScoreboardScreen } from './src/screens/ScoreboardScreen';
import { initializeAdsRuntime } from './src/ads/runtime';
import { getScoreboardEntries } from './src/storage/scoreboard';
import { Difficulty, ScoreEntry } from './src/types';

type Screen = 'home' | 'game' | 'scoreboard';

export default function App(): React.JSX.Element {
	const [screen, setScreen] = useState<Screen>('home');
	const [level, setLevel] = useState<Difficulty>('easy');
	const [scores, setScores] = useState<ScoreEntry[]>([]);

	useEffect(() => {
		void initializeAdsRuntime();
	}, []);

	const handleSelectLevel = useCallback((next: Difficulty) => {
		setLevel(next);
	}, []);

	const handlePlay = useCallback(() => {
		setScreen('game');
	}, []);

	const handleHome = useCallback(() => {
		setScreen('home');
	}, []);

	const handleViewScoreboard = useCallback(() => {
		void (async () => {
			const entries = await getScoreboardEntries();
			setScores(entries);
			setScreen('scoreboard');
		})();
	}, []);

	if (screen === 'scoreboard') {
		return (
			<ScoreboardScreen
				entries={scores}
				onBack={handleHome}
			/>
		);
	}

	if (screen === 'game') {
		return (
			<GameScreen
				level={level}
				onChangeLevel={handleSelectLevel}
				onHome={handleHome}
				onViewScoreboard={handleViewScoreboard}
			/>
		);
	}

	return (
		<HomeScreen
			selectedLevel={level}
			onSelectLevel={handleSelectLevel}
			onPlay={handlePlay}
			onViewScoreboard={handleViewScoreboard}
		/>
	);
}
