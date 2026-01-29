import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { simpleLogin, simpleSignup } from "@/lib/simple-auth";

export default function AuthScreen() {
  const colors = useColors();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        await simpleLogin(email, password);
        router.replace("/(tabs)");
      } else {
        await simpleSignup(email, password, name);
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("خطأ", error.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="gap-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-4xl font-bold text-foreground">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Text>
            <Text className="text-base text-muted">
              {isLogin ? "رحباً بعودتك" : "انضم إلينا الآن"}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Name Input (Register only) */}
            {!isLogin && (
              <View>
                <Text className="text-foreground text-sm font-semibold mb-2">الاسم</Text>
                <TextInput
                  placeholder="أدخل اسمك الكامل"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>
            )}

            {/* Email Input */}
            <View>
              <Text className="text-foreground text-sm font-semibold mb-2">البريد الإلكتروني</Text>
              <TextInput
                placeholder="example@email.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-foreground text-sm font-semibold mb-2">كلمة المرور</Text>
              <TextInput
                placeholder="أدخل كلمة المرور"
                placeholderTextColor={colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-primary px-6 py-4 rounded-lg active:opacity-80"
          >
            <Text className="text-white font-bold text-lg text-center">
              {loading ? "جاري المعالجة..." : isLogin ? "تسجيل الدخول" : "إنشاء الحساب"}
            </Text>
          </TouchableOpacity>

          {/* Toggle Button */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-muted">
              {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} disabled={loading}>
              <Text className="text-primary font-bold">
                {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Test Account Info */}
          <View className="bg-surface border border-border rounded-lg p-4 mt-4">
            <Text className="text-foreground font-semibold mb-2">حساب اختبار Admin:</Text>
            <Text className="text-muted text-sm">البريد: youseef500600700800@gmail.com</Text>
            <Text className="text-muted text-sm">كلمة المرور: أي كلمة</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
