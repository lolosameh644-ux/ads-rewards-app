import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { unityAdsManager } from "@/lib/unity-ads-manager";

export interface BannerAdProps {
  /**
   * Whether to show the banner ad
   */
  visible?: boolean;
  /**
   * Callback when the banner ad is loaded
   */
  onAdLoaded?: () => void;
  /**
   * Callback when the banner ad fails to load
   */
  onAdFailedToLoad?: (error: Error) => void;
}

/**
 * BannerAd Component
 *
 * Displays a banner ad from Unity Ads at the bottom of the screen.
 * The banner is typically 50 points tall on mobile.
 *
 * Usage:
 * ```tsx
 * <BannerAd
 *   visible={true}
 *   onAdLoaded={() => console.log('Ad loaded')}
 *   onAdFailedToLoad={(error) => console.error('Ad failed:', error)}
 * />
 * ```
 */
export function BannerAd({
  visible = true,
  onAdLoaded,
  onAdFailedToLoad,
}: BannerAdProps) {
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const loadBanner = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load the banner ad
        await unityAdsManager.loadBannerAd();

        // Show the banner ad
        await unityAdsManager.showBannerAd();

        setIsLoading(false);
        onAdLoaded?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("[BannerAd] Failed to load banner ad:", error);
        setError(error);
        setIsLoading(false);
        onAdFailedToLoad?.(error);
      }
    };

    loadBanner();

    // Cleanup
    return () => {
      unityAdsManager.hideBannerAd().catch((err) => {
        console.error("[BannerAd] Failed to hide banner ad:", err);
      });
    };
  }, [visible, onAdLoaded, onAdFailedToLoad]);

  if (!visible) {
    return null;
  }

  const bannerHeight = unityAdsManager.getBannerHeight();

  return (
    <View
      className="w-full"
      style={{
        height: bannerHeight,
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading && (
        <ActivityIndicator size="small" color={colors.primary} />
      )}

      {error && !isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
          }}
        >
          {/* Silently fail - don't show error to user */}
        </View>
      )}

      {/* The actual ad will be rendered by Unity Ads SDK */}
    </View>
  );
}
