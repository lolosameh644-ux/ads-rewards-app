import { ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { PointsCard } from "@/components/points-card";
import { WatchAdButton } from "@/components/watch-ad-button";
import { BannerAd } from "@/components/banner-ad";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading, isGuest, refresh } = useAuth();
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  // Refresh user data on mount to ensure points and role are up to date
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    }
  }, []);
  const [guestPoints, setGuestPoints] = useState(0);

  // Get user points (only for authenticated users)
  // Refetch every 5 seconds to keep points updated
  const { data: points, refetch: refetchPoints } = trpc.points.get.useQuery(undefined, {
    enabled: isAuthenticated && !isGuest,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Always consider data stale
  });

  // Get ad views count (only for authenticated users)
  // Refetch every 5 seconds to keep ad views updated
  const { data: adViews, refetch: refetchAdViews } = trpc.points.adViews.useQuery(undefined, {
    enabled: isAuthenticated && !isGuest,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Always consider data stale
  });

  // Add points mutation (only for authenticated users)
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
      router.push("/auth");
      return;
    }

    setIsLoadingAd(true);

    // Simulate ad watching
    setTimeout(async () => {
      try {
        if (isGuest) {
          // For guest users, just add to local state
          setGuestPoints((prev) => prev + 1);
          Alert.alert("تم!", "تمت إضافة نقطة واحدة إلى رصيدك");
        } else {
          // For authenticated users, add to database
          await addPointsMutation.mutateAsync({
            points: 1,
            adId: `ad_${Date.now()}`,
          });
        }
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View className="items-center gap-6">
            <Text className="text-4xl font-bold text-foreground text-center">
              مرحباً بك في تطبيق الأرباح
            </Text>
            <Text className="text-lg text-muted text-center">
              شاهد الإعلانات واربح المال
            </Text>

            {/* Login Button */}
            <TouchableOpacity
              onPress={() => router.push("/auth")}
              className="w-full bg-primary px-8 py-4 rounded-full active:opacity-80"
            >
              <Text className="text-white font-bold text-lg text-center">تسجيل الدخول</Text>
            </TouchableOpacity>

            {/* Info Box */}
            <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20 w-full mt-4">
              <Text className="text-foreground text-sm font-semibold mb-3">
                ✓ سجل دخولك الآن
              </Text>
              <Text className="text-muted text-xs leading-relaxed">
                قم بتسجيل الدخول للبدء في كسب النقاط والأرباح من خلال مشاهدة الإعلانات.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const displayPoints = isGuest ? guestPoints : points?.points || 0;
  const displayTotalEarned = isGuest ? 0 : points?.totalEarned || 0;
  const displayTotalWithdrawn = isGuest ? 0 : points?.totalWithdrawn || 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-6">
            {/* Header */}
            <View className="items-center mb-2">
              <Text className="text-3xl font-bold text-foreground">
                مرحباً {user?.name || "بك"}
              </Text>
              {isGuest && (
                <View className="bg-warning/10 px-3 py-1 rounded-full mt-2">
                  <Text className="text-warning text-xs font-semibold">وضع التجربة</Text>
                </View>
              )}
              <Text className="text-base text-muted mt-1">شاهد الإعلانات واربح النقاط</Text>
            </View>

            {/* Points Card */}
            <PointsCard
              points={displayPoints}
              totalEarned={displayTotalEarned}
              totalWithdrawn={displayTotalWithdrawn}
            />

            {/* Watch Ad Button */}
            <WatchAdButton onPress={handleWatchAd} loading={isLoadingAd} />

            {/* Ad Views Counter */}
            {!isGuest && adViews && (
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

            {/* Guest Mode Warning */}
            {isGuest && (
              <View className="bg-warning/10 rounded-2xl p-4 border border-warning/20">
                <Text className="text-warning text-sm font-semibold mb-2">
                  ⚠️ تنبيه: وضع التجربة
                </Text>
                <Text className="text-warning text-xs">
                  أنت تستخدم التطبيق في وضع التجربة. البيانات محلية ولن يتم حفظها. لحفظ أرباحك،
                  يرجى تسجيل الدخول.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
      {/* Banner Ad at the bottom */}
      <BannerAd visible={isAuthenticated} />
    </View>
  );
}
