import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';

import { ScoreboardList } from '../components/ScoreboardList';
import { ScoreEntry } from '../types';
import { playFeedback } from '../utils/sounds';

interface ScoreboardScreenProps {
	entries: ScoreEntry[];
	onBack: () => void;
}

export function ScoreboardScreen({ entries, onBack }: ScoreboardScreenProps): React.JSX.Element {
	function handleBack(): void {
		void playFeedback('tap');
		onBack();
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<LinearGradient
				colors={['#6c80ca', '#5e74bc', '#5d539f', '#653c92']}
				style={styles.gradient}
			>
				<Pressable
					onPress={handleBack}
					style={styles.backBtn}
					testID='scoreboard-back'
				>
					<Text style={styles.backText}>← Back</Text>
				</Pressable>
				<ScoreboardList entries={entries} />
			</LinearGradient>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	gradient: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
	backBtn: {
		alignSelf: 'flex-start',
		backgroundColor: 'rgba(241, 246, 255, 0.2)',
		borderRadius: 10,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderWidth: 2,
		borderColor: '#dde7ff',
		marginBottom: 12,
	},
	backText: { fontWeight: '800', color: '#eef3ff', fontSize: 15 },
});
