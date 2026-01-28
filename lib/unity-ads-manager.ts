import { AdMobRewarded } from "expo-ads-admob";
import { Platform } from "react-native";

// Unity Ads Configuration
const REWARDED_AD_UNIT_ID = "Rewarded_Android";
const GAME_ID = "6033471";

// Test Ad Unit IDs (for development)
const TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";

class UnityAdsManager {
  private isInitialized = false;
  private isAdLoading = false;
  private isTestMode = false; // Production mode enabled

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log("[UnityAds] Already initialized");
        return;
      }

      console.log("[UnityAds] Initializing...");

      // Set the Ad Unit ID based on mode
      const adUnitId = this.isTestMode ? TEST_REWARDED_AD_UNIT_ID : REWARDED_AD_UNIT_ID;

      if (Platform.OS === "android") {
        AdMobRewarded.setAdUnitID(adUnitId);
      } else if (Platform.OS === "ios") {
        // iOS Ad Unit ID (you can use the same or different)
        AdMobRewarded.setAdUnitID(adUnitId);
      }

      // Set up event listeners
      this.setupEventListeners();

      this.isInitialized = true;
      console.log("[UnityAds] Initialized successfully");
    } catch (error) {
      console.error("[UnityAds] Initialization failed:", error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Ad failed to load
    AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", (error) => {
      console.error("[UnityAds] Ad failed to load:", error);
      this.isAdLoading = false;
    });

    // Ad dismissed
    AdMobRewarded.addEventListener("rewardedVideoDidDismiss", () => {
      console.log("[UnityAds] Ad dismissed");
      this.isAdLoading = false;
    });

    // User earned reward
    AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", (reward) => {
      console.log("[UnityAds] User rewarded:", reward);
    });

    // Ad loaded
    AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => {
      console.log("[UnityAds] Ad loaded");
    });

    // Ad presented
    AdMobRewarded.addEventListener("rewardedVideoDidPresent", () => {
      console.log("[UnityAds] Ad presented");
    });

    // Ad failed to present
    AdMobRewarded.addEventListener("rewardedVideoDidFailToPresent", (error) => {
      console.error("[UnityAds] Ad failed to present:", error);
      this.isAdLoading = false;
    });
  }

  async requestAd(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.isAdLoading) {
        console.log("[UnityAds] Ad is already loading");
        return;
      }

      console.log("[UnityAds] Requesting ad...");
      this.isAdLoading = true;

      await AdMobRewarded.requestAdAsync();
      console.log("[UnityAds] Ad requested successfully");
    } catch (error) {
      console.error("[UnityAds] Failed to request ad:", error);
      this.isAdLoading = false;
      throw error;
    }
  }

  async showAd(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log("[UnityAds] Showing ad...");
      await AdMobRewarded.showAdAsync();
      console.log("[UnityAds] Ad shown successfully");
    } catch (error) {
      console.error("[UnityAds] Failed to show ad:", error);
      throw error;
    }
  }

  async showRewardedAd(): Promise<boolean> {
    try {
      console.log("[UnityAds] Starting rewarded ad flow...");

      // Request the ad
      await this.requestAd();

      // Show the ad
      await this.showAd();

      // If we reach here, the ad was shown successfully
      console.log("[UnityAds] Rewarded ad completed successfully");
      return true;
    } catch (error) {
      console.error("[UnityAds] Rewarded ad flow failed:", error);
      return false;
    }
  }

  setTestMode(isTest: boolean): void {
    this.isTestMode = isTest;
    console.log("[UnityAds] Test mode set to:", isTest);
  }

  isLoading(): boolean {
    return this.isAdLoading;
  }
}

// Export singleton instance
export const unityAdsManager = new UnityAdsManager();
