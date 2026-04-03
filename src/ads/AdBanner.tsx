import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface GoogleMobileAdsModule {
	BannerAd: React.ComponentType<{
		size: string;
		unitId: string;
		requestOptions?: {
			requestNonPersonalizedAdsOnly?: boolean;
		};
	}>;
	BannerAdSize: {
		ANCHORED_ADAPTIVE_BANNER: string;
	};
	TestIds: {
		BANNER: string;
	};
}

let adsModule: GoogleMobileAdsModule | null = null;

const PRODUCTION_BANNER_UNIT_IDS = {
	ios: 'ca-app-pub-9243961400167403~7235573943',
	android: 'ca-app-pub-9243961400167403~7451196368',
} as const;

try {
	// This stays lazy so Expo Go can boot without the native ads module present.
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	adsModule = require('react-native-google-mobile-ads') as GoogleMobileAdsModule;
} catch {
	adsModule = null;
}

export function AdBanner(): React.JSX.Element {
	if (!adsModule) {
		return (
			<View
				style={styles.placeholder}
				testID='ad-banner-unavailable'
			>
				<Text style={styles.placeholderText}>Ads are available in the iOS/Android app build.</Text>
			</View>
		);
	}

	const { BannerAd, BannerAdSize, TestIds } = adsModule;
	const unitId = getBannerUnitId(TestIds.BANNER);

	return (
		<BannerAd
			size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
			unitId={unitId}
			requestOptions={{ requestNonPersonalizedAdsOnly: true }}
		/>
	);
}

function getBannerUnitId(testId: string): string {
	if (__DEV__) {
		return testId;
	}

	const productionUnitId = Platform.select({
		ios: PRODUCTION_BANNER_UNIT_IDS.ios,
		android: PRODUCTION_BANNER_UNIT_IDS.android,
		default: testId,
	});

	// Keep serving test ads until real IDs are configured.
	if (productionUnitId.includes('xxxxxxxxxxxxxxxx')) {
		return testId;
	}

	return productionUnitId;
}

export function isNativeAdsAvailable(): boolean {
	return adsModule !== null;
}

export function getAdsRuntimeMessage(): string {
	if (adsModule) {
		return 'Google Mobile Ads native module is available.';
	}

	if (Platform.OS === 'web') {
		return 'Ads are disabled on web.';
	}

	return 'Google Mobile Ads is not available in Expo Go. Use a native dev build or release build to enable ads.';
}

const styles = StyleSheet.create({
	placeholder: {
		minHeight: 54,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 12,
	},
	placeholderText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#6b7280',
		textAlign: 'center',
	},
});
