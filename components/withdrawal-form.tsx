import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type WithdrawalMethod = "instapay" | "vodafone_cash" | "paypal";

interface WithdrawalFormProps {
  currentPoints: number;
  onSubmit: (data: {
    points: number;
    method: WithdrawalMethod;
    contactInfo: string;
  }) => Promise<void>;
}

export function WithdrawalForm({ currentPoints, onSubmit }: WithdrawalFormProps) {
  const colors = useColors();
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [points, setPoints] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods: { id: WithdrawalMethod; label: string; icon: string }[] = [
    { id: "instapay", label: "Instapay", icon: "account-balance-wallet" },
    { id: "vodafone_cash", label: "Vodafone Cash", icon: "phone-android" },
    { id: "paypal", label: "PayPal", icon: "email" },
  ];

  const handleMethodSelect = (method: WithdrawalMethod) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedMethod(method);
  };

  const handleSubmit = async () => {
    if (!selectedMethod) {
      Alert.alert("خطأ", "يرجى اختيار وسيلة السحب");
      return;
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum) || pointsNum < 900) {
      Alert.alert("خطأ", "الحد الأدنى للسحب هو 900 نقطة");
      return;
    }

    if (pointsNum > currentPoints) {
      Alert.alert("خطأ", "ليس لديك نقاط كافية");
      return;
    }

    if (!contactInfo.trim()) {
      Alert.alert("خطأ", "يرجى إدخال رقم الهاتف أو البريد الإلكتروني");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        points: pointsNum,
        method: selectedMethod,
        contactInfo: contactInfo.trim(),
      });
      // Reset form
      setSelectedMethod(null);
      setPoints("");
      setContactInfo("");
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const usdAmount = points ? (parseInt(points) / 300).toFixed(2) : "0.00";

  return (
    <View className="bg-surface rounded-3xl p-6 border border-border">
      <Text className="text-foreground text-xl font-bold mb-4">طلب سحب جديد</Text>

      {/* Method Selection */}
      <Text className="text-muted text-sm mb-3">اختر وسيلة السحب</Text>
      <View className="flex-row gap-3 mb-6">
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => handleMethodSelect(method.id)}
            className={`flex-1 p-4 rounded-2xl border-2 ${
              selectedMethod === method.id
                ? "bg-primary/10 border-primary"
                : "bg-background border-border"
            }`}
          >
            <View className="items-center">
              <Text
                className={`text-sm font-semibold ${
                  selectedMethod === method.id ? "text-primary" : "text-foreground"
                }`}
              >
                {method.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Points Input */}
      <Text className="text-muted text-sm mb-2">عدد النقاط</Text>
      <TextInput
        value={points}
        onChangeText={setPoints}
        keyboardType="numeric"
        placeholder="900 نقطة كحد أدنى"
        placeholderTextColor={colors.muted}
        className="bg-background border border-border rounded-2xl px-4 py-3 text-foreground text-lg mb-2"
      />
      <Text className="text-primary text-sm mb-4">≈ ${usdAmount}</Text>

      {/* Contact Info Input */}
      <Text className="text-muted text-sm mb-2">
        {selectedMethod === "paypal" ? "البريد الإلكتروني" : "رقم الهاتف"}
      </Text>
      <TextInput
        value={contactInfo}
        onChangeText={setContactInfo}
        keyboardType={selectedMethod === "paypal" ? "email-address" : "phone-pad"}
        placeholder={
          selectedMethod === "paypal" ? "example@email.com" : "01xxxxxxxxx"
        }
        placeholderTextColor={colors.muted}
        className="bg-background border border-border rounded-2xl px-4 py-3 text-foreground text-lg mb-6"
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`rounded-2xl py-4 ${
          isSubmitting ? "bg-muted" : "bg-primary"
        } active:opacity-80`}
      >
        <Text className="text-white text-center text-lg font-bold">
          {isSubmitting ? "جاري الإرسال..." : "إرسال طلب السحب"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
