import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface WatchAdButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function WatchAdButton({ onPress, loading = false, disabled = false }: WatchAdButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={loading || disabled}
      className="bg-success rounded-3xl p-8 shadow-xl active:opacity-80"
      style={{
        transform: [{ scale: loading || disabled ? 0.95 : 1 }],
      }}
    >
      <View className="items-center">
        {loading ? (
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
