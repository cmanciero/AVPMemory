import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScoreEntry } from '../types';
import { formatDuration } from '../utils/game';

interface ScoreboardListProps {
	entries: ScoreEntry[];
}

function EmptyState(): React.JSX.Element {
	return <Text style={styles.empty}>No completed games yet.</Text>;
}

export function ScoreboardList({ entries }: ScoreboardListProps): React.JSX.Element {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Scoreboard</Text>
			<FlatList
				data={entries}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={EmptyState}
				renderItem={({ item, index }) => (
					<View style={styles.row}>
						<Text style={styles.rank}>{index + 1}.</Text>
						<Text style={styles.level}>{item.level.toUpperCase()}</Text>
						<Text style={styles.time}>{formatDuration(item.completionMs)}</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		backgroundColor: '#fff8ea',
		borderRadius: 14,
		padding: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: '900',
		color: '#003049',
		marginBottom: 12,
	},
	empty: {
		fontSize: 16,
		color: '#6c757d',
		marginTop: 8,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffeecf',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 8,
	},
	rank: {
		width: 30,
		fontWeight: '800',
		color: '#003049',
	},
	level: {
		flex: 1,
		color: '#d62828',
		fontWeight: '800',
	},
	time: {
		color: '#2a9d8f',
		fontWeight: '900',
	},
});
