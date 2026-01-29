import { getDb } from "@/server/db";
import { ads } from "@/drizzle/schema";

const sampleAds = [
  {
    id: "ad-001",
    title: "تطبيق Spotify - استمع إلى الموسيقى بلا حدود",
    description: "استمتع بملايين الأغاني والبودكاست مع Spotify. جرب مجاناً لمدة 3 أشهر!",
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
    advertiserName: "Spotify",
    advertiserLogo:
      "https://www.svgrepo.com/show/303600/spotify-2-logo.svg",
    rewardPoints: 5,
    duration: 30,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-002",
    title: "Netflix - أفلام وسلاسل درامية حصرية",
    description: "شاهد أفضل الأفلام والمسلسلات. اشترك الآن واستمتع بشهر مجاني!",
    imageUrl:
      "https://images.unsplash.com/photo-1522869635100-ce306e08e75f?w=400&h=300&fit=crop",
    advertiserName: "Netflix",
    advertiserLogo:
      "https://www.svgrepo.com/show/303541/netflix-1-logo.svg",
    rewardPoints: 5,
    duration: 30,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-003",
    title: "Amazon Prime Video - أفضل الأفلام والمسلسلات",
    description: "شاهد الأفلام الحصرية والمسلسلات الأصلية. جرب مجاناً!",
    imageUrl:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
    advertiserName: "Amazon Prime",
    advertiserLogo:
      "https://www.svgrepo.com/show/303542/amazon-prime-video-logo.svg",
    rewardPoints: 5,
    duration: 30,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-004",
    title: "Uber Eats - اطلب طعامك المفضل الآن",
    description: "اطلب من أفضل المطاعم واستمتع بتوصيل سريع. استخدم كود الخصم!",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900152-b8b80e7ddb3d?w=400&h=300&fit=crop",
    advertiserName: "Uber Eats",
    advertiserLogo:
      "https://www.svgrepo.com/show/303542/uber-eats-logo.svg",
    rewardPoints: 3,
    duration: 20,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-005",
    title: "Duolingo - تعلم لغة جديدة بسهولة",
    description: "تعلم الإنجليزية والفرنسية والإسبانية وأكثر. مجاني وممتع!",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f70674e90?w=400&h=300&fit=crop",
    advertiserName: "Duolingo",
    advertiserLogo:
      "https://www.svgrepo.com/show/303542/duolingo-logo.svg",
    rewardPoints: 4,
    duration: 25,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-006",
    title: "Canva - صمم بسهولة مثل المحترفين",
    description: "أنشئ تصاميم احترافية بدون خبرة. آلاف القوالب الجاهزة!",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    advertiserName: "Canva",
    advertiserLogo:
      "https://www.svgrepo.com/show/303542/canva-logo.svg",
    rewardPoints: 4,
    duration: 25,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-007",
    title: "Adobe Creative Cloud - أدوات احترافية",
    description: "Photoshop, Illustrator, Premiere Pro وأكثر. جرب مجاناً!",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    advertiserName: "Adobe",
    advertiserLogo:
      "https://www.svgrepo.com/show/303542/adobe-logo.svg",
    rewardPoints: 5,
    duration: 30,
    isActive: true,
    targetCountry: "EG",
  },
  {
    id: "ad-008",
    title: "Grammarly - اكتب بثقة وصحة",
    description: "تحسين الكتابة والقواعس النحوية. مجاني مع خيارات متقدمة!",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    advertiserName: "Grammarly",
    advertiserLogo:
      "https://www.svgrepo.com/show/303542/grammarly-logo.svg",
    rewardPoints: 3,
    duration: 20,
    isActive: true,
    targetCountry: "EG",
  },
];

async function seedAds() {
  try {
    console.log("🌱 بدء إضافة بيانات الإعلانات...");

    const db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Delete existing ads
    // await db.delete(ads).execute();
    // console.log("✓ تم حذف الإعلانات القديمة");

    // Insert new ads
    await db.insert(ads).values(sampleAds as any).execute();

    console.log(`✅ تم إضافة ${sampleAds.length} إعلان بنجاح!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ خطأ أثناء إضافة الإعلانات:", error);
    process.exit(1);
  }
}

seedAds();
