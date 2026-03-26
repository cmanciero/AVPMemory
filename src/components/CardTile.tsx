import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { CARD_BACK } from '../constants/cards';
import { GameCard } from '../types';

interface CardTileProps {
	card: GameCard;
	onPress: (cardKey: string) => void;
	disabled: boolean;
	compact?: boolean;
}

export function CardTile({ card, onPress, disabled, compact = false }: CardTileProps): React.JSX.Element {
	const isFaceUp = card.isFlipped || card.isMatched;

	return (
		<Pressable
			accessibilityRole='button'
			accessibilityLabel={`card-${card.key}`}
			disabled={disabled || card.isMatched || card.isFlipped}
			onPress={() => onPress(card.key)}
			style={[styles.card, compact && styles.cardCompact, card.isMatched && styles.matchedCard]}
			testID={`card-${card.key}`}
		>
			<View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
				<Image
					source={isFaceUp ? card.image : CARD_BACK}
					style={[styles.image, compact && styles.imageCompact]}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		width: '31%',
		aspectRatio: 1,
		borderRadius: 14,
		marginBottom: 10,
		backgroundColor: '#ffeecf',
		borderWidth: 2,
		borderColor: '#ff9f1c',
		overflow: 'hidden',
	},
	cardCompact: {
		width: '30%',
		aspectRatio: 0.92,
		borderRadius: 12,
		marginBottom: 8,
	},
	matchedCard: {
		opacity: 0.75,
		borderColor: '#2a9d8f',
	},
	imageWrap: {
		flex: 1,
		padding: 8,
	},
	imageWrapCompact: {
		padding: 6,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
		resizeMode: 'cover',
	},
	imageCompact: {
		borderRadius: 8,
	},
});
