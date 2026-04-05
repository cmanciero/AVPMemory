import { shouldShowInterstitialForPlay } from '../src/ads/interstitial';

describe('interstitial ads', () => {
  it('shows an ad on every 5th completed play', () => {
    expect(shouldShowInterstitialForPlay(1)).toBe(false);
    expect(shouldShowInterstitialForPlay(4)).toBe(false);
    expect(shouldShowInterstitialForPlay(5)).toBe(true);
    expect(shouldShowInterstitialForPlay(10)).toBe(true);
    expect(shouldShowInterstitialForPlay(11)).toBe(false);
  });
});
