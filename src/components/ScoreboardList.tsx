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
		backgroundColor: 'rgba(240, 245, 255, 0.15)',
		borderRadius: 14,
		padding: 16,
		borderWidth: 1.5,
		borderColor: '#dbe6ff',
	},
	title: {
		fontSize: 20,
		fontWeight: '900',
		color: '#f3f7ff',
		marginBottom: 12,
	},
	empty: {
		fontSize: 16,
		color: '#e5ecff',
		marginTop: 8,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(236, 242, 255, 0.22)',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#dce6ff',
	},
	rank: {
		width: 30,
		fontWeight: '800',
		color: '#f4f8ff',
	},
	level: {
		flex: 1,
		color: '#eef4ff',
		fontWeight: '800',
	},
	time: {
		color: '#f8fbff',
		fontWeight: '900',
	},
});
