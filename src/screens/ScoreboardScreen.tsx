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
			<Pressable
				onPress={handleBack}
				style={styles.backBtn}
				testID='scoreboard-back'
			>
				<Text style={styles.backText}>← Back</Text>
			</Pressable>
			<ScoreboardList entries={entries} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: '#fff8ea', paddingHorizontal: 16, paddingTop: 12 },
	backBtn: {
		alignSelf: 'flex-start',
		backgroundColor: '#eae2b7',
		borderRadius: 10,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderWidth: 2,
		borderColor: '#fcbf49',
		marginBottom: 12,
	},
	backText: { fontWeight: '800', color: '#003049', fontSize: 15 },
});
