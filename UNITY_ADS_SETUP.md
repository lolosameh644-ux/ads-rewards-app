# دليل إعداد Unity Ads

## نظرة عامة

التطبيق حالياً يستخدم محاكاة (simulation) لعرض الإعلانات. لتفعيل Unity Ads الحقيقي، اتبع الخطوات التالية.

## معلومات Unity Ads الخاصة بك

- **Game ID**: 6033471
- **Rewarded Ad Unit ID**: Rewarded_Android

## خطوات التكامل

### 1. تثبيت Unity Ads Package

يمكنك استخدام أحد الحلول التالية:

#### الخيار أ: استخدام expo-ads-admob (موصى به للمبتدئين)

```bash
pnpm add expo-ads-admob
```

#### الخيار ب: استخدام react-native-unity-ads (للتحكم الكامل)

```bash
pnpm add react-native-unity-ads
```

### 2. تحديث app.config.ts

أضف Unity Ads plugin إلى `app.config.ts`:

```typescript
plugins: [
  // ... existing plugins
  [
    "expo-ads-admob",
    {
      androidAppId: "ca-app-pub-xxxxx~xxxxx", // Unity Ads ID
      iosAppId: "ca-app-pub-xxxxx~xxxxx",
    }
  ],
],
```

### 3. تحديث WatchAdButton Component

استبدل المحاكاة في `components/watch-ad-button.tsx` بكود Unity Ads الحقيقي:

```typescript
import { AdMobRewarded } from 'expo-ads-admob';

// Initialize Unity Ads
AdMobRewarded.setAdUnitID('Rewarded_Android'); // For Android
// AdMobRewarded.setAdUnitID('Rewarded_iOS'); // For iOS

export function WatchAdButton({ onPress, loading = false, disabled = false }: WatchAdButtonProps) {
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  const showRewardedAd = async () => {
    try {
      setIsLoadingAd(true);
      
      // Request ad
      await AdMobRewarded.requestAdAsync();
      
      // Show ad
      await AdMobRewarded.showAdAsync();
      
      // Ad completed successfully
      onPress(); // This will add points
    } catch (error) {
      console.error('Error showing ad:', error);
      Alert.alert('خطأ', 'فشل تحميل الإعلان. حاول مرة أخرى.');
    } finally {
      setIsLoadingAd(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={showRewardedAd}
      disabled={loading || disabled || isLoadingAd}
      // ... rest of the component
    >
      {/* ... */}
    </TouchableOpacity>
  );
}
```

### 4. تحديث HomeScreen

في `app/(tabs)/index.tsx`, قم بإزالة المحاكاة:

```typescript
const handleWatchAd = async () => {
  if (!isAuthenticated) {
    Alert.alert("تسجيل الدخول مطلوب", "يرجى تسجيل الدخول أولاً لمشاهدة الإعلانات");
    return;
  }

  // Remove the setTimeout simulation
  // Unity Ads will be handled in WatchAdButton component
  
  try {
    await addPointsMutation.mutateAsync({
      points: 1,
      adId: `ad_${Date.now()}`,
    });
  } catch (error) {
    console.error("Error adding points:", error);
  }
};
```

### 5. اختبار الإعلانات

#### وضع الاختبار (Test Mode)

أثناء التطوير، استخدم Test Ads:

```typescript
// For testing
AdMobRewarded.setAdUnitID('ca-app-pub-3940256099942544/5224354917'); // Test ad unit
```

#### وضع الإنتاج (Production Mode)

عند النشر، استخدم الـ Ad Unit ID الحقيقي:

```typescript
// For production
AdMobRewarded.setAdUnitID('Rewarded_Android'); // Your real ad unit
```

### 6. التعامل مع الأخطاء

أضف معالجة أخطاء شاملة:

```typescript
AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', (error) => {
  console.error('Ad failed to load:', error);
  Alert.alert('خطأ', 'فشل تحميل الإعلان');
});

AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
  console.log('Ad closed');
});

AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', (reward) => {
  console.log('User rewarded:', reward);
  // Add points here
});
```

## الحالة الحالية

التطبيق حالياً يعمل بنظام محاكاة (simulation) حيث:
- الضغط على زر "شاهد إعلان" ينتظر ثانيتين
- يتم إضافة نقطة واحدة تلقائياً
- لا يتم عرض إعلان حقيقي

هذا يسمح لك باختبار جميع وظائف التطبيق دون الحاجة لإعداد Unity Ads أولاً.

## ملاحظات مهمة

1. **الصلاحيات**: تأكد من إضافة الصلاحيات المطلوبة في `app.json`:
   ```json
   {
     "android": {
       "permissions": [
         "INTERNET",
         "ACCESS_NETWORK_STATE"
       ]
     }
   }
   ```

2. **الخصوصية**: أضف سياسة الخصوصية المطلوبة من Unity Ads

3. **معدل العرض**: Unity Ads قد يحد من عدد الإعلانات المعروضة لكل مستخدم يومياً

4. **الأرباح**: تأكد من إعداد حساب Unity Ads للحصول على الأرباح

## الدعم

إذا واجهت مشاكل:
1. راجع [Unity Ads Documentation](https://docs.unity.com/ads/)
2. تحقق من [Expo Ads Documentation](https://docs.expo.dev/versions/latest/sdk/admob/)
3. تأكد من صحة Game ID و Ad Unit ID
