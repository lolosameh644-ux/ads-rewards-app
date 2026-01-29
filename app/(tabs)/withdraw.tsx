import { ScrollView, Text, View, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { WithdrawalForm } from "@/components/withdrawal-form";
import { WithdrawalRequestCard } from "@/components/withdrawal-request-card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function WithdrawScreen() {
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Get user points
  const { data: points, refetch: refetchPoints } = trpc.points.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Get withdrawal requests
  const { data: requests, refetch: refetchRequests } = trpc.withdrawal.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Create withdrawal mutation
  const createWithdrawalMutation = trpc.withdrawal.create.useMutation({
    onSuccess: () => {
      refetchPoints();
      refetchRequests();
      Alert.alert("تم!", "تم إرسال طلب السحب بنجاح. سيتم مراجعته قريباً.");
    },
    onError: (error) => {
      Alert.alert("خطأ", error.message || "حدث خطأ أثناء إرسال الطلب");
    },
  });

  const handleSubmitWithdrawal = async (data: {
    points: number;
    method: "instapay" | "vodafone_cash" | "paypal";
    contactInfo: string;
  }) => {
    await createWithdrawalMutation.mutateAsync(data);
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
            يرجى تسجيل الدخول لعرض صفحة السحب والحصول على أرباحك
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
          <View className="mb-2">
            <Text className="text-3xl font-bold text-foreground">سحب الأرباح</Text>
            <Text className="text-base text-muted mt-1">
              احصل على أرباحك عبر الوسيلة المفضلة لديك
            </Text>
          </View>

          {/* Current Balance */}
          {points && (
            <View className="bg-primary rounded-2xl p-6">
              <Text className="text-white/80 text-sm mb-1">الرصيد المتاح</Text>
              <Text className="text-white text-4xl font-bold">{points.points} نقطة</Text>
              <Text className="text-white/90 text-xl mt-2">
                ≈ ${(points.points / 300).toFixed(2)}
              </Text>
            </View>
          )}

          {/* Withdrawal Form */}
          {points && (
            <WithdrawalForm
              currentPoints={points.points}
              onSubmit={handleSubmitWithdrawal}
            />
          )}

          {/* Previous Requests */}
          {requests && requests.length > 0 && (
            <View>
              <Text className="text-foreground text-xl font-bold mb-4">
                طلبات السحب السابقة
              </Text>
              {requests.map((request) => (
                <WithdrawalRequestCard key={request.id} request={request} />
              ))}
            </View>
          )}

          {requests && requests.length === 0 && (
            <View className="bg-surface rounded-2xl p-6 items-center">
              <Text className="text-muted text-center">لا توجد طلبات سحب سابقة</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
