import { ScrollView, Text, View, TouchableOpacity, Alert, TextInput } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function AdminScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"users" | "withdrawals">("withdrawals");

  // Get all users
  const { data: users, refetch: refetchUsers } = trpc.admin.users.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Get all withdrawal requests
  const { data: withdrawals, refetch: refetchWithdrawals } = trpc.admin.withdrawals.useQuery(
    undefined,
    {
      enabled: isAuthenticated && user?.role === "admin",
    }
  );

  // Update withdrawal mutation
  const updateWithdrawalMutation = trpc.admin.updateWithdrawal.useMutation({
    onSuccess: () => {
      refetchWithdrawals();
      Alert.alert("تم!", "تم تحديث حالة الطلب بنجاح");
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message || "حدث خطأ أثناء تحديث الطلب");
    },
  });

  // Update user points mutation
  const updateUserPointsMutation = trpc.admin.updateUserPoints.useMutation({
    onSuccess: () => {
      refetchUsers();
      Alert.alert("تم!", "تم تحديث النقاط بنجاح");
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message || "حدث خطأ أثناء تحديث النقاط");
    },
  });

  const handleUpdateWithdrawal = (requestId: number, status: "approved" | "rejected") => {
    Alert.alert(
      "تأكيد",
      `هل أنت متأكد من ${status === "approved" ? "قبول" : "رفض"} هذا الطلب؟`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تأكيد",
          onPress: async () => {
            await updateWithdrawalMutation.mutateAsync({ requestId, status });
          },
        },
      ]
    );
  };

  const handleUpdateUserPoints = (userId: number, currentPoints: number) => {
    Alert.prompt(
      "تعديل النقاط",
      `النقاط الحالية: ${currentPoints}`,
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تحديث",
          onPress: async (newPoints?: string) => {
            const points = parseInt(newPoints || "0");
            if (isNaN(points) || points < 0) {
              Alert.alert("خطأ", "يرجى إدخال رقم صحيح");
              return;
            }
            await updateUserPointsMutation.mutateAsync({ userId, points });
          },
        },
      ],
      "plain-text",
      currentPoints.toString()
    );
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">جاري التحميل...</Text>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <View className="items-center gap-4">
          <IconSymbol name="shield.fill" size={64} color={colors.error} />
          <Text className="text-2xl font-bold text-foreground text-center">
            غير مصرح
          </Text>
          <Text className="text-base text-muted text-center">
            هذه الصفحة متاحة للمديرين فقط
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary px-8 py-4 rounded-full mt-4 active:opacity-80"
          >
            <Text className="text-white font-bold text-lg">العودة</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const pendingWithdrawals = withdrawals?.filter((w) => w.status === "pending") || [];
  const totalUsers = users?.length || 0;
  const totalPoints = users?.reduce((sum, u) => sum + u.totalEarned, 0) || 0;
  const totalWithdrawn = users?.reduce((sum, u) => sum + u.totalWithdrawn, 0) || 0;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-3xl font-bold text-foreground">لوحة التحكم</Text>
              <Text className="text-base text-muted mt-1">إدارة المستخدمين والطلبات</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="xmark.circle.fill" size={32} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Statistics */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-primary rounded-2xl p-4">
              <Text className="text-white/80 text-sm">المستخدمين</Text>
              <Text className="text-white text-3xl font-bold mt-1">{totalUsers}</Text>
            </View>
            <View className="flex-1 bg-success rounded-2xl p-4">
              <Text className="text-white/80 text-sm">إجمالي النقاط</Text>
              <Text className="text-white text-3xl font-bold mt-1">{totalPoints}</Text>
            </View>
            <View className="flex-1 bg-warning rounded-2xl p-4">
              <Text className="text-white/80 text-sm">المسحوبات</Text>
              <Text className="text-white text-3xl font-bold mt-1">{totalWithdrawn}</Text>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setSelectedTab("withdrawals")}
              className={`flex-1 py-3 rounded-2xl ${
                selectedTab === "withdrawals" ? "bg-primary" : "bg-surface"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedTab === "withdrawals" ? "text-white" : "text-foreground"
                }`}
              >
                طلبات السحب ({pendingWithdrawals.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab("users")}
              className={`flex-1 py-3 rounded-2xl ${
                selectedTab === "users" ? "bg-primary" : "bg-surface"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedTab === "users" ? "text-white" : "text-foreground"
                }`}
              >
                المستخدمين
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {selectedTab === "withdrawals" && (
            <View>
              {pendingWithdrawals.length === 0 ? (
                <View className="bg-surface rounded-2xl p-6 items-center">
                  <Text className="text-muted text-center">لا توجد طلبات سحب قيد المراجعة</Text>
                </View>
              ) : (
                pendingWithdrawals.map((request) => {
                  const user = users?.find((u) => u.id === request.userId);
                  return (
                    <View
                      key={request.id}
                      className="bg-surface rounded-2xl p-4 border border-border mb-3"
                    >
                      <View className="flex-row justify-between items-start mb-3">
                        <View>
                          <Text className="text-foreground text-lg font-bold">
                            {user?.name || "مستخدم"}
                          </Text>
                          <Text className="text-muted text-sm">{user?.email}</Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-foreground text-xl font-bold">
                            {request.points} نقطة
                          </Text>
                          <Text className="text-primary text-base font-semibold">
                            ${request.amountUsd}
                          </Text>
                        </View>
                      </View>

                      <View className="gap-2 mb-4">
                        <View className="flex-row">
                          <Text className="text-muted text-sm">الوسيلة: </Text>
                          <Text className="text-foreground text-sm font-semibold">
                            {request.method === "instapay"
                              ? "Instapay"
                              : request.method === "vodafone_cash"
                              ? "Vodafone Cash"
                              : "PayPal"}
                          </Text>
                        </View>
                        <View className="flex-row">
                          <Text className="text-muted text-sm">
                            {request.method === "paypal" ? "البريد: " : "الرقم: "}
                          </Text>
                          <Text className="text-foreground text-sm">{request.contactInfo}</Text>
                        </View>
                        <View className="flex-row">
                          <Text className="text-muted text-sm">التاريخ: </Text>
                          <Text className="text-foreground text-sm">
                            {new Date(request.createdAt).toLocaleDateString("ar-EG")}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-3">
                        <TouchableOpacity
                          onPress={() => handleUpdateWithdrawal(request.id, "approved")}
                          className="flex-1 bg-success rounded-xl py-3 active:opacity-80"
                        >
                          <Text className="text-white text-center font-bold">قبول</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleUpdateWithdrawal(request.id, "rejected")}
                          className="flex-1 bg-error rounded-xl py-3 active:opacity-80"
                        >
                          <Text className="text-white text-center font-bold">رفض</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {selectedTab === "users" && (
            <View>
              {users?.map((user) => (
                <View
                  key={user.id}
                  className="bg-surface rounded-2xl p-4 border border-border mb-3"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-foreground text-lg font-bold">
                        {user.name || "مستخدم"}
                      </Text>
                      <Text className="text-muted text-sm">{user.email}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleUpdateUserPoints(user.id, user.points)}
                      className="bg-primary px-4 py-2 rounded-full active:opacity-80"
                    >
                      <Text className="text-white text-sm font-semibold">تعديل</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-muted text-xs">النقاط الحالية</Text>
                      <Text className="text-foreground text-lg font-bold">{user.points}</Text>
                    </View>
                    <View>
                      <Text className="text-muted text-xs">إجمالي الأرباح</Text>
                      <Text className="text-foreground text-lg font-bold">
                        {user.totalEarned}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-muted text-xs">الإعلانات</Text>
                      <Text className="text-foreground text-lg font-bold">
                        {user.adViewsCount}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
