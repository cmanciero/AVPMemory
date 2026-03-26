import React, { useCallback, useEffect, useRef } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AdBanner } from '../ads/AdBanner';
import { CardTile } from '../components/CardTile';
import { WinOverlay } from '../components/WinOverlay';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { addScoreboardEntry, getScoreboardEntries } from '../storage/scoreboard';
import { Difficulty } from '../types';
import { formatDuration } from '../utils/game';
import { playFeedback } from '../utils/sounds';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function shouldUseCompactTiles(level: Difficulty, width: number): boolean {
	return level === 'hard' && width <= 390;
}

interface GameScreenProps {
	level: Difficulty;
	onChangeLevel: (level: Difficulty) => void;
	onHome: () => void;
	onViewScoreboard: () => void;
}

export function GameScreen({ level, onChangeLevel, onHome, onViewScoreboard }: GameScreenProps): React.JSX.Element {
	const savedRef = useRef(false);
	const { width } = useWindowDimensions();
	const { cards, elapsedMs, finished, disabled, resetGame, flipCard } = useMemoryGame(level);
	const useCompactTiles = shouldUseCompactTiles(level, width);

	const refreshAndShowScores = useCallback(async () => {
		await getScoreboardEntries();
		onViewScoreboard();
	}, [onViewScoreboard]);

	useEffect(() => {
		resetGame(level);
		savedRef.current = false;
	}, [level, resetGame]);

	useEffect(() => {
		if (!finished || savedRef.current) return;

		savedRef.current = true;

		void addScoreboardEntry(level, elapsedMs);
	}, [elapsedMs, finished, level]);

	const handleFlipCard = useCallback(
		(cardKey: string) => {
			void playFeedback('flip');
			flipCard(cardKey);
		},
		[flipCard],
	);

	const handleChangeLevel = useCallback(
		(nextLevel: Difficulty) => {
			void playFeedback('tap');
			onChangeLevel(nextLevel);
		},
		[onChangeLevel],
	);

	const handleRestart = useCallback(() => {
		void playFeedback('tap');
		resetGame(level);
		savedRef.current = false;
	}, [level, resetGame]);

	const handleHome = useCallback(() => {
		void playFeedback('tap');
		onHome();
	}, [onHome]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle='dark-content' />

			<View style={styles.container}>
				{/* Header */}
				<View style={styles.headerRow}>
					<Pressable
						onPress={handleHome}
						style={styles.backBtn}
						testID='game-home'
					>
						<Text style={styles.backText}>← Home</Text>
					</Pressable>
					<Text style={styles.timer}>{formatDuration(elapsedMs)}</Text>
				</View>

				{/* Difficulty row */}
				<View style={styles.modeRow}>
					{DIFFICULTIES.map((d) => (
						<Pressable
							key={d}
							onPress={() => handleChangeLevel(d)}
							style={[styles.modeBtn, level === d && styles.modeBtnActive]}
							testID={`difficulty-${d}`}
						>
							<Text style={[styles.modeText, level === d && styles.modeTextActive]}>{d.toUpperCase()}</Text>
						</Pressable>
					))}
				</View>

				{/* Card grid */}
				<ScrollView contentContainerStyle={styles.gridWrap}>
					{cards.map((card) => (
						<CardTile
							key={card.key}
							card={card}
							compact={useCompactTiles}
							disabled={disabled}
							onPress={handleFlipCard}
						/>
					))}
				</ScrollView>

				{/* Footer */}
				<View style={styles.footerRow}>
					<Pressable
						onPress={handleRestart}
						style={styles.restartBtn}
						testID='restart-game'
					>
						<Text style={styles.restartText}>↺ Restart</Text>
					</Pressable>
					<Pressable
						onPress={() => void refreshAndShowScores()}
						style={styles.scoresBtn}
						testID='view-scoreboard'
					>
						<Text style={styles.scoresText}>🏆 Scores</Text>
					</Pressable>
				</View>
			</View>

			{/* Win overlay */}
			{finished ? (
				<WinOverlay
					elapsedMs={elapsedMs}
					level={level}
					onRestart={handleRestart}
					onHome={handleHome}
				/>
			) : null}

			{/* Banner ad */}
			<View style={styles.adWrap}>
				<AdBanner />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: '#fff3d7' },
	container: { flex: 1, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 8 },
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	backBtn: {
		backgroundColor: '#eae2b7',
		borderRadius: 10,
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderWidth: 2,
		borderColor: '#fcbf49',
	},
	backText: { fontWeight: '800', color: '#003049', fontSize: 15 },
	timer: { fontSize: 22, fontWeight: '900', color: '#003049' },
	modeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
	modeBtn: {
		flex: 1,
		marginHorizontal: 3,
		borderRadius: 11,
		paddingVertical: 10,
		alignItems: 'center',
		backgroundColor: '#ffe8b6',
		borderWidth: 2,
		borderColor: '#fcbf49',
	},
	modeBtnActive: { backgroundColor: '#f77f00', borderColor: '#d62828' },
	modeText: { color: '#003049', fontWeight: '800' },
	modeTextActive: { color: '#fff' },
	gridWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		paddingBottom: 12,
	},
	footerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingTop: 6,
		gap: 10,
	},
	restartBtn: {
		flex: 1,
		backgroundColor: '#d62828',
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
	},
	restartText: { color: '#fff', fontWeight: '900', fontSize: 16 },
	scoresBtn: {
		flex: 1,
		backgroundColor: '#eae2b7',
		borderRadius: 12,
		paddingVertical: 12,
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#fcbf49',
	},
	scoresText: { color: '#003049', fontWeight: '800', fontSize: 16 },
	adWrap: { alignItems: 'center', paddingBottom: 6, backgroundColor: '#fff3d7' },
});
