import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { FAQAccordion } from "@/components/faq-accordion";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";

const FAQ_ITEMS = [
  {
    id: "1",
    question: "كيف أربح المال من التطبيق؟",
    answer:
      "كل إعلان تشاهده يعطيك نقطة واحدة. كل 300 نقطة = 1 دولار. بعد جمع 900 نقطة (3 دولار) على الأقل، يمكنك طلب السحب عبر Instapay أو Vodafone Cash أو PayPal.",
  },
  {
    id: "2",
    question: "ما هو الحد الأدنى للسحب؟",
    answer:
      "الحد الأدنى للسحب هو 900 نقطة، وهو ما يعادل 3 دولار. لا يمكنك سحب أقل من هذا المبلغ.",
  },
  {
    id: "3",
    question: "كم من الوقت يستغرق السحب؟",
    answer:
      "عادة ما تتم معالجة طلبات السحب خلال 24-48 ساعة. قد يستغرق التحويل إلى حسابك البنكي أو المحفظة الرقمية وقتاً إضافياً حسب الخدمة المستخدمة.",
  },
  {
    id: "4",
    question: "هل يمكنني مشاهدة إعلانات غير محدودة؟",
    answer:
      "لا، هناك حد أقصى يومي لعدد الإعلانات التي يمكنك مشاهدتها. هذا لضمان جودة الخدمة والحفاظ على توازن النظام.",
  },
  {
    id: "5",
    question: "ماذا يحدث إذا لم أشاهد الإعلان كاملاً؟",
    answer:
      "يجب عليك مشاهدة الإعلان كاملاً للحصول على النقطة. إذا أغلقت الإعلان قبل انتهائه، لن تحصل على النقطة.",
  },
  {
    id: "6",
    question: "هل التطبيق آمن؟",
    answer:
      "نعم، التطبيق آمن تماماً. نحن نستخدم تشفير آمن لحماية بيانات المستخدمين والمعاملات المالية.",
  },
  {
    id: "7",
    question: "كيف أحذف حسابي؟",
    answer:
      "يمكنك حذف حسابك من إعدادات التطبيق. لاحظ أنه بعد الحذف، لن تتمكن من استرجاع أرصدتك أو بيانات حسابك.",
  },
  {
    id: "8",
    question: "ماذا لو واجهت مشكلة في السحب؟",
    answer:
      "إذا واجهت أي مشكلة، يرجى التواصل معنا عبر البريد الإلكتروني أو نموذج الدعم في التطبيق. سنقوم بحل المشكلة في أسرع وقت.",
  },
];

export default function FAQScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-foreground">الأسئلة الشائعة</Text>
              <Text className="text-base text-muted mt-1">إجابات على أسئلتك</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-surface rounded-full p-3 active:opacity-70"
            >
              <IconSymbol name="xmark" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* FAQ Items */}
          <FAQAccordion items={FAQ_ITEMS} />

          {/* Contact Section */}
          <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20 mt-4">
            <Text className="text-foreground text-lg font-semibold mb-2">
              لم تجد إجابتك؟
            </Text>
            <Text className="text-muted text-sm mb-4">
              تواصل معنا عبر البريد الإلكتروني أو نموذج الدعم في التطبيق
            </Text>
            <TouchableOpacity className="bg-primary px-6 py-3 rounded-full active:opacity-80">
              <Text className="text-white font-semibold text-center">تواصل معنا</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
