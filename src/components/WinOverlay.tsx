import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { Difficulty } from '../types';
import { formatDuration } from '../utils/game';
import { playFeedback } from '../utils/sounds';

interface WinOverlayProps {
	elapsedMs: number;
	level: Difficulty;
	onRestart: () => void;
	onHome: () => void;
}

const CONFETTI = ['🎉', '⭐', '🌟', '🎊', '🌈', '🍭', '💫', '✨', '🎈', '🦄', '🍬', '🎀'];
const CONFETTI_COUNT = 12;

export function WinOverlay({ elapsedMs, level, onRestart, onHome }: WinOverlayProps): React.JSX.Element {
	const titleScale = useRef(new Animated.Value(0)).current;
	const overlayOpacity = useRef(new Animated.Value(0)).current;

	const confettiAnims = useRef(
		Array.from({ length: CONFETTI_COUNT }, () => ({
			y: new Animated.Value(-80),
			x: new Animated.Value(0),
			opacity: new Animated.Value(1),
			rotate: new Animated.Value(0),
		})),
	).current;

	// Stable random config computed once
	const confettiConfig = useRef(
		Array.from({ length: CONFETTI_COUNT }, (_, idx) => ({
			startX: 30 + (idx / CONFETTI_COUNT) * 300,
			driftX: (Math.random() - 0.5) * 260,
			fallDuration: 1300 + Math.random() * 700,
			rotateTo: 360 * (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()),
			delay: idx * 75,
			emoji: CONFETTI[idx % CONFETTI.length] as string,
		})),
	).current;

	useEffect(() => {
		void playFeedback('win');

		// Fade-in the dark overlay
		Animated.timing(overlayOpacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		// Card pop-in
		Animated.spring(titleScale, {
			toValue: 1,
			friction: 4,
			tension: 80,
			useNativeDriver: true,
		}).start();

		// Launch confetti
		confettiAnims.forEach((anim, idx) => {
			const cfg = confettiConfig[idx];

			if (!cfg) return;

			const { fallDuration, driftX, rotateTo, delay } = cfg;

			Animated.sequence([
				Animated.delay(delay),
				Animated.parallel([
					Animated.timing(anim.y, {
						toValue: 600 + Math.random() * 150,
						duration: fallDuration,
						useNativeDriver: true,
					}),
					Animated.timing(anim.x, {
						toValue: driftX,
						duration: fallDuration,
						useNativeDriver: true,
					}),
					Animated.timing(anim.rotate, {
						toValue: rotateTo,
						duration: fallDuration,
						useNativeDriver: true,
					}),
					Animated.sequence([
						Animated.delay(fallDuration * 0.65),
						Animated.timing(anim.opacity, {
							toValue: 0,
							duration: fallDuration * 0.35,
							useNativeDriver: true,
						}),
					]),
				]),
			]).start();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
			{/* Confetti */}
			{confettiAnims.map((anim, idx) => {
				const cfg = confettiConfig[idx];

				if (!cfg) return null;

				const rotateDeg = anim.rotate.interpolate({
					inputRange: [-720, 720],
					outputRange: ['-720deg', '720deg'],
				});

				return (
					<Animated.Text
						key={idx}
						style={[
							styles.confettiItem,
							{
								left: cfg.startX,
								opacity: anim.opacity,
								transform: [{ translateY: anim.y }, { translateX: anim.x }, { rotate: rotateDeg }],
							},
						]}
					>
						{cfg.emoji}
					</Animated.Text>
				);
			})}

			{/* Win card */}
			<Animated.View style={[styles.card, { transform: [{ scale: titleScale }] }]}>
				<Text style={styles.trophy}>🏆</Text>
				<Text style={styles.winTitle}>You Won!</Text>
				<Text style={styles.winLevel}>{level.toUpperCase()}</Text>
				<Text style={styles.winTime}>{formatDuration(elapsedMs)}</Text>

				<Pressable
					onPress={onRestart}
					style={styles.restartButton}
					testID='win-restart'
				>
					<Text style={styles.restartText}>▶ Play Again</Text>
				</Pressable>

				<Pressable
					onPress={onHome}
					style={styles.homeButton}
					testID='win-home'
				>
					<Text style={styles.homeText}>🏠 Home</Text>
				</Pressable>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0,0,0,0.62)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 100,
	},
	confettiItem: {
		position: 'absolute',
		top: 0,
		fontSize: 26,
		zIndex: 200,
	},
	card: {
		backgroundColor: '#5a6fb8',
		borderRadius: 28,
		paddingVertical: 36,
		paddingHorizontal: 40,
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#dce6ff',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.32,
		shadowRadius: 20,
		elevation: 20,
		zIndex: 150,
		minWidth: 280,
	},
	trophy: {
		fontSize: 68,
		marginBottom: 6,
	},
	winTitle: {
		fontSize: 44,
		fontWeight: '900',
		color: '#f6f9ff',
		marginBottom: 4,
	},
	winLevel: {
		fontSize: 21,
		fontWeight: '800',
		color: '#dce6ff',
		marginBottom: 4,
	},
	winTime: {
		fontSize: 30,
		fontWeight: '900',
		color: '#ffffff',
		marginBottom: 26,
	},
	restartButton: {
		backgroundColor: '#e8edff',
		borderRadius: 16,
		paddingVertical: 14,
		paddingHorizontal: 32,
		marginBottom: 12,
		width: '100%',
		alignItems: 'center',
		borderWidth: 3,
		borderColor: '#d2deff',
	},
	restartText: {
		color: '#4e63ab',
		fontSize: 20,
		fontWeight: '900',
	},
	homeButton: {
		backgroundColor: 'rgba(241, 246, 255, 0.18)',
		borderRadius: 16,
		paddingVertical: 12,
		paddingHorizontal: 32,
		width: '100%',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#dce7ff',
	},
	homeText: {
		color: '#f2f6ff',
		fontSize: 18,
		fontWeight: '800',
	},
});
