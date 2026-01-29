import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function ProfileScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  // Get user points
  const { data: points } = trpc.points.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Get ad views count
  const { data: adViews } = trpc.points.adViews.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل الخروج",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
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
          <Text className="text-2xl font-bold text-foreground text-center">
            تسجيل الدخول مطلوب
          </Text>
          <Text className="text-base text-muted text-center">
            يرجى تسجيل الدخول لعرض الملف الشخصي وحفظ أرباحك
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth")}
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
          <View className="items-center mb-4">
            <View className="bg-primary rounded-full w-24 h-24 items-center justify-center mb-4">
              <IconSymbol name="person.fill" size={48} color="white" />
            </View>
            <Text className="text-3xl font-bold text-foreground">
              {user?.name || "مستخدم"}
            </Text>
            <Text className="text-base text-muted mt-1">{user?.email}</Text>
            {user?.role === "admin" && (
              <View className="bg-primary/10 px-4 py-2 rounded-full mt-2">
                <Text className="text-primary font-semibold">مدير</Text>
              </View>
            )}
          </View>

          {/* Statistics */}
          <View className="bg-surface rounded-3xl p-6 border border-border">
            <Text className="text-foreground text-xl font-bold mb-4">الإحصائيات</Text>
            <View className="gap-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <IconSymbol name="star.fill" size={24} color={colors.primary} />
                  <Text className="text-foreground text-base ml-3">النقاط الحالية</Text>
                </View>
                <Text className="text-foreground text-xl font-bold">
                  {points?.points || 0}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.success} />
                  <Text className="text-foreground text-base ml-3">إجمالي الأرباح</Text>
                </View>
                <Text className="text-foreground text-xl font-bold">
                  {points?.totalEarned || 0}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <IconSymbol name="banknote" size={24} color={colors.warning} />
                  <Text className="text-foreground text-base ml-3">إجمالي السحب</Text>
                </View>
                <Text className="text-foreground text-xl font-bold">
                  {points?.totalWithdrawn || 0}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <IconSymbol name="play.circle.fill" size={24} color={colors.primary} />
                  <Text className="text-foreground text-base ml-3">الإعلانات المشاهدة</Text>
                </View>
                <Text className="text-foreground text-xl font-bold">
                  {adViews?.total || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Help & Info Section */}
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            {/* FAQ Button */}
            <TouchableOpacity
              onPress={() => router.push("/faq" as any)}
              className="flex-row items-center justify-between p-4 border-b border-border active:opacity-70"
            >
              <View className="flex-row items-center">
                <IconSymbol name="questionmark.circle.fill" size={28} color={colors.primary} />
                <Text className="text-foreground text-lg font-semibold ml-3">الأسئلة الشائعة</Text>
              </View>
              <IconSymbol name="arrow.right" size={24} color={colors.muted} />
            </TouchableOpacity>

            {/* Terms Button */}
            <TouchableOpacity
              onPress={() => router.push("/terms" as any)}
              className="flex-row items-center justify-between p-4 active:opacity-70"
            >
              <View className="flex-row items-center">
                <IconSymbol name="doc.text.fill" size={28} color={colors.primary} />
                <Text className="text-foreground text-lg font-semibold ml-3">شروط الاستخدام</Text>
              </View>
              <IconSymbol name="arrow.right" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Admin Button */}
          {user?.role === "admin" && (
            <TouchableOpacity
              onPress={() => router.push("/admin" as any)}
              className="bg-primary rounded-2xl p-4 flex-row items-center justify-between active:opacity-80"
            >
              <View className="flex-row items-center">
                <IconSymbol name="shield.fill" size={28} color="white" />
                <Text className="text-white text-lg font-bold ml-3">لوحة التحكم</Text>
              </View>
              <IconSymbol name="arrow.right" size={24} color="white" />
            </TouchableOpacity>
          )}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error rounded-2xl p-4 items-center active:opacity-80"
          >
            <Text className="text-white text-lg font-bold">تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
