import { ScrollView, Text, View, Alert } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { PointsCard } from "@/components/points-card";
import { WatchAdButton } from "@/components/watch-ad-button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  // Get user points
  const { data: points, refetch: refetchPoints } = trpc.points.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Get ad views count
  const { data: adViews, refetch: refetchAdViews } = trpc.points.adViews.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Add points mutation
  const addPointsMutation = trpc.points.add.useMutation({
    onSuccess: () => {
      refetchPoints();
      refetchAdViews();
      Alert.alert("تم!", "تمت إضافة نقطة واحدة إلى رصيدك");
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message || "حدث خطأ أثناء إضافة النقاط");
    },
  });

  const handleWatchAd = async () => {
    if (!isAuthenticated) {
      Alert.alert("تسجيل الدخول مطلوب", "يرجى تسجيل الدخول أولاً لمشاهدة الإعلانات");
      return;
    }

    setIsLoadingAd(true);

    // Simulate ad watching (Unity Ads will be integrated later)
    setTimeout(async () => {
      try {
        await addPointsMutation.mutateAsync({
          points: 1,
          adId: `ad_${Date.now()}`,
        });
      } catch (error) {
        console.error("Error adding points:", error);
      } finally {
        setIsLoadingAd(false);
      }
    }, 2000);
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <View className="items-center gap-4">
          <Text className="text-4xl font-bold text-foreground text-center">
            مرحباً بك في تطبيق الأرباح
          </Text>
          <Text className="text-lg text-muted text-center">
            شاهد الإعلانات واربح المال
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/oauth/callback")}
            className="bg-primary px-8 py-4 rounded-full mt-4 active:opacity-80"
          >
            <Text className="text-white font-bold text-lg">تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="items-center mb-2">
            <Text className="text-3xl font-bold text-foreground">
              مرحباً {user?.name || "بك"}
            </Text>
            <Text className="text-base text-muted mt-1">شاهد الإعلانات واربح النقاط</Text>
          </View>

          {/* Points Card */}
          {points && (
            <PointsCard
              points={points.points}
              totalEarned={points.totalEarned}
              totalWithdrawn={points.totalWithdrawn}
            />
          )}

          {/* Watch Ad Button */}
          <WatchAdButton onPress={handleWatchAd} loading={isLoadingAd} />

          {/* Ad Views Counter */}
          {adViews && (
            <View className="bg-surface rounded-2xl p-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-muted text-sm">الإعلانات اليوم</Text>
                  <Text className="text-foreground text-2xl font-bold">{adViews.today}</Text>
                </View>
                <View>
                  <Text className="text-muted text-sm">إجمالي الإعلانات</Text>
                  <Text className="text-foreground text-2xl font-bold">{adViews.total}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Info Cards */}
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-foreground text-lg font-semibold mb-3">معلومات مهمة</Text>
            <View className="gap-3">
              <View className="flex-row items-center">
                <Text className="text-primary text-2xl mr-2">•</Text>
                <Text className="text-foreground flex-1">كل 300 نقطة = 1 دولار</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-primary text-2xl mr-2">•</Text>
                <Text className="text-foreground flex-1">
                  الحد الأدنى للسحب 900 نقطة = 3 دولار
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-primary text-2xl mr-2">•</Text>
                <Text className="text-foreground flex-1">كل إعلان = نقطة واحدة</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
