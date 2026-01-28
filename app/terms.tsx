import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function TermsScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-foreground">شروط الاستخدام</Text>
              <Text className="text-base text-muted mt-1">آخر تحديث: يناير 2026</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-surface rounded-full p-3 active:opacity-70"
            >
              <IconSymbol name="xmark" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Terms Content */}
          <View className="gap-4">
            {/* Section 1 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">1. قبول الشروط</Text>
              <Text className="text-muted text-sm leading-relaxed">
                باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة
                هنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام التطبيق.
              </Text>
            </View>

            {/* Section 2 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">
                2. استخدام التطبيق
              </Text>
              <Text className="text-muted text-sm leading-relaxed">
                يجب أن تكون عمرك 18 سنة على الأقل لاستخدام التطبيق. أنت توافق على استخدام
                التطبيق بطريقة قانونية وأخلاقية فقط. يُحظر استخدام التطبيق لأي أغراض غير قانونية
                أو ضارة.
              </Text>
            </View>

            {/* Section 3 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">3. حسابك</Text>
              <Text className="text-muted text-sm leading-relaxed">
                أنت مسؤول عن الحفاظ على سرية بيانات حسابك. يجب عليك إخطارنا فوراً بأي استخدام
                غير مصرح به لحسابك. نحن لا نتحمل مسؤولية أي خسائر ناتجة عن عدم الحفاظ على سرية
                بيانات حسابك.
              </Text>
            </View>

            {/* Section 4 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">
                4. الإعلانات والنقاط
              </Text>
              <Text className="text-muted text-sm leading-relaxed">
                النقاط التي تحصل عليها من مشاهدة الإعلانات لا يمكن تحويلها إلى أموال حقيقية إلا
                من خلال عملية السحب المحددة. نحتفظ بالحق في إلغاء النقاط في حالة الاشتباه بالغش
                أو الاستخدام غير الصحيح.
              </Text>
            </View>

            {/* Section 5 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">5. السحب والدفع</Text>
              <Text className="text-muted text-sm leading-relaxed">
                جميع عمليات السحب تخضع للتحقق والموافقة. قد نرفض أي طلب سحب إذا اشتبهنا بالغش.
                الحد الأدنى للسحب هو 900 نقطة (3 دولار). قد تستغرق عملية السحب 24-48 ساعة.
              </Text>
            </View>

            {/* Section 6 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">
                6. الخصوصية والبيانات
              </Text>
              <Text className="text-muted text-sm leading-relaxed">
                نحن نحترم خصوصيتك. بيانات حسابك محمية بالتشفير الآمن. لن نشارك بيانات حسابك مع
                أطراف ثالثة بدون موافقتك، باستثناء ما يتطلبه القانون.
              </Text>
            </View>

            {/* Section 7 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">
                7. تعديل الشروط
              </Text>
              <Text className="text-muted text-sm leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية.
                استمرارك في استخدام التطبيق يعني قبولك للشروط المعدلة.
              </Text>
            </View>

            {/* Section 8 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">8. إخلاء المسؤولية</Text>
              <Text className="text-muted text-sm leading-relaxed">
                التطبيق يُقدم "كما هو" بدون أي ضمانات. نحن لا نتحمل مسؤولية أي أضرار مباشرة أو
                غير مباشرة ناتجة عن استخدام التطبيق.
              </Text>
            </View>

            {/* Section 9 */}
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-foreground text-lg font-bold mb-2">9. التواصل معنا</Text>
              <Text className="text-muted text-sm leading-relaxed">
                إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر البريد الإلكتروني
                أو نموذج الدعم في التطبيق.
              </Text>
            </View>

            {/* Acceptance */}
            <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <Text className="text-foreground text-base font-semibold mb-3">
                ✓ بموافقتك على استخدام التطبيق، فإنك توافق على جميع الشروط والأحكام أعلاه.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
