import { TouchableOpacity, Text, View, ActivityIndicator, Alert } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState, useEffect } from "react";
import { unityAdsManager } from "@/lib/unity-ads-manager";

interface WatchAdButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function WatchAdButton({ onPress, loading = false, disabled = false }: WatchAdButtonProps) {
  const colors = useColors();
  const [isShowingAd, setIsShowingAd] = useState(false);

  useEffect(() => {
    // Initialize Unity Ads when component mounts
    if (Platform.OS !== "web") {
      unityAdsManager.initialize().catch((error) => {
        console.error("Failed to initialize Unity Ads:", error);
      });
    }
  }, []);

  const handlePress = async () => {
    if (Platform.OS !== "web") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.error("Haptics error:", error);
      }
    }

    setIsShowingAd(true);

    try {
      if (Platform.OS === "web") {
        // For web, use simulation
        setTimeout(() => {
          onPress();
          setIsShowingAd(false);
        }, 2000);
      } else {
        // For native, use real Unity Ads
        const success = await unityAdsManager.showRewardedAd();

        if (success) {
          onPress();
        } else {
          Alert.alert("خطأ", "فشل تحميل الإعلان. حاول مرة أخرى.");
        }

        setIsShowingAd(false);
      }
    } catch (error) {
      console.error("Error showing ad:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء عرض الإعلان");
      setIsShowingAd(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading || disabled || isShowingAd}
      className="bg-success rounded-3xl p-8 shadow-xl active:opacity-80"
      style={{
        transform: [{ scale: loading || disabled || isShowingAd ? 0.95 : 1 }],
      }}
    >
      <View className="items-center">
        {loading || isShowingAd ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <>
            <IconSymbol name="play.circle.fill" size={64} color="white" />
            <Text className="text-white text-2xl font-bold mt-4">شاهد إعلان</Text>
            <Text className="text-white text-xl mt-2">واربح نقطة</Text>
            <View className="flex-row items-center mt-4 bg-white/20 rounded-full px-6 py-2">
              <IconSymbol name="star.fill" size={20} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">+1 نقطة</Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
