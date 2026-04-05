import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import APP_LOGO from '../../assets/app-logo.png';
import { Difficulty } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');

const STAR_COUNT = 8;

const DIFFICULTY_OPTIONS: { level: Difficulty; label: string; stars: string; bg: string; border: string }[] = [
	{ level: 'easy', label: 'EASY', stars: '⭐', bg: '#7a8fd6', border: '#5b73c3' },
	{ level: 'medium', label: 'MEDIUM', stars: '⭐⭐', bg: '#6a81cc', border: '#4f67b5' },
	{ level: 'hard', label: 'HARD', stars: '⭐⭐⭐', bg: '#5a72bf', border: '#465ca8' },
];

interface HomeScreenProps {
	selectedLevel: Difficulty;
	onSelectLevel: (level: Difficulty) => void;
	onPlay: () => void;
	onViewScoreboard: () => void;
}

export function HomeScreen({ selectedLevel, onSelectLevel, onPlay, onViewScoreboard }: HomeScreenProps): React.JSX.Element {
	const isTestEnvironment = process.env.NODE_ENV === 'test';

	// ── Stable random seed for stars (computed once) ──────────────────────────
	const starSeed = useRef(
		Array.from({ length: STAR_COUNT }, (_, i) => ({
			left: 16 + (i / STAR_COUNT) * (SCREEN_W - 56) + (i % 3) * 8,
			top: 14 + (i % 4) * 48,
			size: 16 + (i % 4) * 5,
			targetScale: 0.7 + (i % 5) * 0.18,
			floatAmount: 12 + (i % 3) * 8,
			dur1: 1600 + i * 120,
			dur2: 1800 + i * 90,
			delay: i * 180,
		})),
	).current;

	// ── Animated values ───────────────────────────────────────────────────────
	const titleScale = useRef(new Animated.Value(0)).current;
	const titleRotate = useRef(new Animated.Value(-6)).current;
	const subtitleOpacity = useRef(new Animated.Value(0)).current;
	const logoFloat = useRef(new Animated.Value(0)).current;
	const playPulse = useRef(new Animated.Value(1)).current;
	const scoreboardOpacity = useRef(new Animated.Value(0)).current;

	const starAnims = useRef(
		Array.from({ length: STAR_COUNT }, () => ({
			y: new Animated.Value(0),
			opacity: new Animated.Value(0),
			scale: new Animated.Value(0.3),
		})),
	).current;

	const diffScales = useRef(DIFFICULTY_OPTIONS.map(() => new Animated.Value(0))).current;

	// ── Start all animations on mount ─────────────────────────────────────────
	useEffect(() => {
		if (isTestEnvironment) {
			titleScale.setValue(1);
			titleRotate.setValue(0);
			subtitleOpacity.setValue(1);
			scoreboardOpacity.setValue(1);
			diffScales.forEach((anim) => anim.setValue(1));
			starAnims.forEach((anim, idx) => {
				anim.opacity.setValue(0.85);
				anim.scale.setValue(starSeed[idx]?.targetScale ?? 1);
			});

			return;
		}

		// Title spring pop-in with slight wobble
		Animated.parallel([
			Animated.spring(titleScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
			Animated.spring(titleRotate, { toValue: 0, friction: 5, tension: 60, useNativeDriver: true }),
		]).start();

		// Subtitle fade-in after title
		Animated.sequence([
			Animated.delay(400),
			Animated.timing(subtitleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
		]).start();

		// Scoreboard link fade-in
		Animated.sequence([
			Animated.delay(900),
			Animated.timing(scoreboardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
		]).start();

		// Logo continuous float loop
		Animated.loop(
			Animated.sequence([
				Animated.timing(logoFloat, { toValue: -14, duration: 1500, useNativeDriver: true }),
				Animated.timing(logoFloat, { toValue: 0, duration: 1500, useNativeDriver: true }),
			]),
		).start();

		// Play button pulse loop
		Animated.loop(
			Animated.sequence([
				Animated.timing(playPulse, { toValue: 1.07, duration: 700, useNativeDriver: true }),
				Animated.timing(playPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
			]),
		).start();

		// Difficulty buttons stagger-in
		Animated.stagger(
			110,
			diffScales.map((anim) => Animated.spring(anim, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true })),
		).start();

		// Stars: fade + scale in, then loop float
		starAnims.forEach((anim, idx) => {
			const seed = starSeed[idx];

			if (!seed) return;

			Animated.sequence([
				Animated.delay(seed.delay),
				Animated.parallel([
					Animated.timing(anim.opacity, { toValue: 0.85, duration: 600, useNativeDriver: true }),
					Animated.spring(anim.scale, { toValue: seed.targetScale, friction: 5, useNativeDriver: true }),
				]),
			]).start(() => {
				Animated.loop(
					Animated.sequence([
						Animated.timing(anim.y, { toValue: -seed.floatAmount, duration: seed.dur1, useNativeDriver: true }),
						Animated.timing(anim.y, { toValue: 0, duration: seed.dur2, useNativeDriver: true }),
					]),
				).start();
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		diffScales,
		isTestEnvironment,
		logoFloat,
		playPulse,
		scoreboardOpacity,
		starAnims,
		starSeed,
		subtitleOpacity,
		titleRotate,
		titleScale,
	]);

	// ── Handlers ──────────────────────────────────────────────────────────────
	const handleSelectLevel = useCallback(
		(level: Difficulty) => {
			void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			onSelectLevel(level);
		},
		[onSelectLevel],
	);

	const handlePlay = useCallback(() => {
		void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

		if (isTestEnvironment) {
			onPlay();
			return;
		}

		// Start bounce feedback, then navigate on the next frame outside animation callbacks.
		Animated.sequence([
			Animated.spring(playPulse, { toValue: 1.18, friction: 3, useNativeDriver: true }),
			Animated.spring(playPulse, { toValue: 1, useNativeDriver: true }),
		]).start();

		requestAnimationFrame(onPlay);
	}, [isTestEnvironment, onPlay, playPulse]);

	const handleScoreboard = useCallback(() => {
		void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onViewScoreboard();
	}, [onViewScoreboard]);

	// ── Render ─────────────────────────────────────────────────────────────────
	const titleRotateDeg = titleRotate.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] });

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle='light-content' />
			<LinearGradient
				colors={['#6b7fc9', '#5e73bb', '#5e539f', '#663c92']}
				style={styles.gradient}
			>
				{/* ── Floating star decorations ── */}
				{starAnims.map((anim, idx) => {
					const seed = starSeed[idx];

					if (!seed) return null;

					return (
						<Animated.View
							key={idx}
							style={[
								styles.starWrap,
								{
									left: seed.left,
									top: seed.top,
									opacity: anim.opacity,
									transform: [{ translateY: anim.y }, { scale: anim.scale }],
								},
							]}
						>
							<Text style={[styles.starText, { fontSize: seed.size }]}>⭐</Text>
						</Animated.View>
					);
				})}

				<ScrollView
					contentContainerStyle={styles.scroll}
					showsVerticalScrollIndicator={false}
				>
					{/* ── Logo ── */}
					<Animated.View style={{ transform: [{ translateY: logoFloat }] }}>
						<Image
							source={APP_LOGO}
							style={styles.logo}
							resizeMode='contain'
						/>
					</Animated.View>

					{/* ── Title ── */}
					<Animated.View style={{ transform: [{ scale: titleScale }, { rotate: titleRotateDeg }] }}>
						<Text style={styles.titleEmoji}>🎴</Text>
						<Text style={styles.title}>Memory{'\n'}Match!</Text>
					</Animated.View>

					{/* ── Subtitle ── */}
					<Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>Find all the matching pairs! 🎉</Animated.Text>

					{/* ── Difficulty picker ── */}
					<View style={styles.chooseWrap}>
						<Text style={styles.chooseLabel}>Choose your challenge:</Text>
						<View style={styles.diffRow}>
							{DIFFICULTY_OPTIONS.map(({ level, label, stars, bg, border }, idx) => {
								const isSelected = selectedLevel === level;

								return (
									<Animated.View
										key={level}
										style={{ transform: [{ scale: diffScales[idx] ?? new Animated.Value(1) }] }}
									>
										<Pressable
											onPress={() => handleSelectLevel(level)}
											style={[
												styles.diffBtn,
												{
													backgroundColor: isSelected ? bg : `${bg}55`,
													borderColor: border,
													borderWidth: isSelected ? 3 : 2,
												},
											]}
											testID={`home-difficulty-${level}`}
										>
											<Text style={styles.diffStars}>{stars}</Text>
											<Text style={[styles.diffLabel, isSelected && styles.diffLabelActive]}>{label}</Text>
											{isSelected ? <Text style={styles.checkmark}>✓ SELECTED</Text> : null}
										</Pressable>
									</Animated.View>
								);
							})}
						</View>
					</View>

					{/* ── Play button ── */}
					<Animated.View style={{ transform: [{ scale: playPulse }] }}>
						<Pressable
							onPress={handlePlay}
							style={styles.playBtn}
							testID='home-play-button'
						>
							<Text style={styles.playIcon}>🎮</Text>
							<Text style={styles.playText}> PLAY!</Text>
						</Pressable>
					</Animated.View>

					{/* ── High scores link ── */}
					<Animated.View style={{ opacity: scoreboardOpacity }}>
						<Pressable
							onPress={handleScoreboard}
							style={styles.scoresBtn}
							testID='home-scoreboard-button'
						>
							<Text style={styles.scoresText}>🏆 High Scores</Text>
						</Pressable>
					</Animated.View>
				</ScrollView>
			</LinearGradient>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	gradient: { flex: 1 },
	scroll: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 36,
	},
	starWrap: {
		position: 'absolute',
		zIndex: 0,
	},
	starText: {
		lineHeight: 32,
	},
	logo: {
		width: 130,
		height: 130,
		borderRadius: 26,
		marginBottom: 6,
		shadowColor: '#2f3f7f',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 14,
	},
	titleEmoji: {
		fontSize: 44,
		textAlign: 'center',
		marginBottom: 2,
	},
	title: {
		fontSize: 46,
		fontWeight: '900',
		color: '#f7f9ff',
		textAlign: 'center',
		letterSpacing: 0.5,
		lineHeight: 52,
		textShadowColor: 'rgba(0,0,0,0.10)',
		textShadowOffset: { width: 1, height: 2 },
		textShadowRadius: 4,
	},
	subtitle: {
		fontSize: 17,
		color: '#e8edff',
		textAlign: 'center',
		marginTop: 8,
		marginBottom: 22,
		fontWeight: '600',
	},
	chooseWrap: {
		width: '100%',
		marginBottom: 24,
	},
	chooseLabel: {
		fontSize: 16,
		fontWeight: '800',
		color: '#f1f5ff',
		marginBottom: 10,
	},
	diffRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 8,
	},
	diffBtn: {
		borderRadius: 18,
		paddingVertical: 14,
		paddingHorizontal: 10,
		alignItems: 'center',
		minWidth: 96,
	},
	diffStars: {
		fontSize: 18,
		marginBottom: 4,
	},
	diffLabel: {
		fontSize: 13,
		fontWeight: '900',
		color: '#f4f7ff',
	},
	diffLabelActive: {
		color: '#ffffff',
	},
	checkmark: {
		fontSize: 10,
		fontWeight: '900',
		color: '#f3f7ff',
		marginTop: 4,
		textAlign: 'center',
	},
	playBtn: {
		flexDirection: 'row',
		backgroundColor: '#e8edff',
		borderRadius: 24,
		paddingVertical: 20,
		paddingHorizontal: 56,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		borderColor: '#d8e2ff',
		shadowColor: '#1f2e63',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.45,
		shadowRadius: 14,
		elevation: 10,
		marginBottom: 18,
	},
	playIcon: {
		fontSize: 30,
	},
	playText: {
		fontSize: 30,
		fontWeight: '900',
		color: '#4d63aa',
		letterSpacing: 2,
	},
	scoresBtn: {
		paddingVertical: 12,
		paddingHorizontal: 28,
		backgroundColor: 'rgba(242, 246, 255, 0.2)',
		borderRadius: 14,
		borderWidth: 1.5,
		borderColor: '#dfe8ff',
	},
	scoresText: {
		fontSize: 18,
		fontWeight: '800',
		color: '#eef3ff',
	},
});
