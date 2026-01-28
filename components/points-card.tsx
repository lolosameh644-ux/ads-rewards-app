import { View, Text } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface PointsCardProps {
  points: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export function PointsCard({ points, totalEarned, totalWithdrawn }: PointsCardProps) {
  const colors = useColors();
  const usdValue = (points / 300).toFixed(2);

  return (
    <View className="bg-primary rounded-3xl p-6 shadow-lg">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">رصيدك الحالي</Text>
        <IconSymbol name="star.fill" size={28} color="white" />
      </View>

      <View className="items-center mb-4">
        <Text className="text-white text-6xl font-bold">{points}</Text>
        <Text className="text-white/90 text-xl mt-2">نقطة</Text>
      </View>

      <View className="flex-row items-center justify-center bg-white/20 rounded-2xl py-3 px-4">
        <IconSymbol name="dollarsign.circle.fill" size={24} color="white" />
        <Text className="text-white text-2xl font-bold ml-2">${usdValue}</Text>
      </View>

      <View className="flex-row justify-between mt-6 pt-4 border-t border-white/20">
        <View className="items-center flex-1">
          <Text className="text-white/70 text-sm">إجمالي الأرباح</Text>
          <Text className="text-white text-lg font-semibold mt-1">{totalEarned}</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-white/70 text-sm">إجمالي السحب</Text>
          <Text className="text-white text-lg font-semibold mt-1">{totalWithdrawn}</Text>
        </View>
      </View>
    </View>
  );
}
