# Project TODO

## Phase 1: Database & Auth Setup
- [x] تعديل schema.ts لإضافة جداول النقاط والسحب
- [x] إضافة جدول user_points لتتبع نقاط المستخدمين
- [x] إضافة جدول withdrawal_requests لطلبات السحب
- [x] إضافة جدول ad_views لتتبع مشاهدات الإعلانات
- [x] تشغيل migrations لإنشاء الجداول

## Phase 2: Database Functions
- [x] إضافة دوال قاعدة البيانات في server/db.ts
- [x] دالة getUserPoints للحصول على نقاط المستخدم
- [x] دالة addPoints لإضافة نقاط
- [x] دالة createWithdrawalRequest لإنشاء طلب سحب
- [x] دالة getWithdrawalRequests للحصول على طلبات السحب
- [x] دالة updateWithdrawalStatus لتحديث حالة الطلب
- [x] دالة getAdViews لتتبع مشاهدات الإعلانات

## Phase 3: API Routes (tRPC)
- [x] إضافة routes في server/routers.ts
- [x] route للحصول على نقاط المستخدم
- [x] route لإضافة نقطة بعد مشاهدة إعلان
- [x] route لإنشاء طلب سحب
- [x] route للحصول على طلبات السحب للمستخدم
- [x] route للأدمن للحصول على جميع الطلبات
- [x] route للأدمن لتحديث حالة الطلب
- [x] route للأدمن لتعديل نقاط المستخدمين

## Phase 4: UI Components
- [x] تحديث icon-symbol.tsx بالأيقونات المطلوبة
- [x] إنشاء مكون PointsCard لعرض النقاط
- [x] إنشاء مكون WatchAdButton لزر مشاهدة الإعلان
- [x] إنشاء مكون WithdrawalForm لنموذج السحب
- [x] إنشاء مكون WithdrawalRequestCard لعرض طلبات السحب

## Phase 5: Screens
- [x] تحديث شاشة Home (app/(tabs)/index.tsx)
- [x] إضافة شاشة Withdraw (app/(tabs)/withdraw.tsx)
- [x] إضافة شاشة Profile (app/(tabs)/profile.tsx)
- [x] إضافة شاشة Admin (app/admin.tsx)
- [x] تحديث Tab Navigation في _layout.tsx

## Phase 6: Unity Ads Integration
- [x] تثبيت expo-ads-admob
- [x] إنشاء UnityAdsManager لإدارة الإعلانات
- [x] ربط Rewarded_Android بزر مشاهدة الإعلان
- [x] تحديث app.config.ts بإضافة expo-ads-admob plugin
- [x] تفعيل Production Mode للإعلانات الحقيقية

## Phase 7: Admin Features
- [x] إضافة صفحة إدارة المستخدمين
- [x] إضافة صفحة إدارة طلبات السحب
- [x] إضافة وظيفة تعديل النقاط
- [x] إضافة وظيفة قبول/رفض الطلبات
- [x] إضافة لوحة الإحصائيات

## Phas## Phase 8: Testing & Polish
- [x] إنشاء شعار التطبيق
- [x] تحديث app.config.ts باسم التطبيق والشعار
- [x] نسخ الشعار لجميع المواقع المطلوبةig.ts بالشعار واسم التطبيق
- [ ] إنشاء checkpoint نهائي

## Phase 9: Documentation
- [x] كتابة دليل الاستخدام (USER_GUIDE.md)
- [x] كتابة دليل Unity Ads (UNITY_ADS_SETUP.md)

## المشروع جاهز للتسليم! ✅
- [ ] كتابة دليل الأدمن
- [ ] كتابة تعليمات إعداد Unity Ads
- [ ] كتابة تعليمات النشر


## Phase 10: Guest Login Feature
- [x] إضافة خيار "تجربة بدون تسجيل" في شاشة الدخول
- [x] تحديث use-auth hook لدعم Guest mode
- [x] إضافة بيانات وهمية للاختبار
- [x] تحديث جميع الشاشات لدعم Guest mode

## Phase 11: FAQ & Terms Pages
- [x] إنشاء مكون FAQ Accordion
- [x] إنشاء صفحة FAQ (app/faq.tsx)
- [x] إنشاء صفحة شروط الاستخدام (app/terms.tsx)
- [x] إضافة روابط في صفحة Profile
- [x] تحديث icon-symbol.tsx بالأيقونات الجديدة
