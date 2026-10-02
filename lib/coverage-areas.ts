export type CoverageArea = {
  code: number;
  name: string;
  nameAr: string;
  x: number;
  y: number;
  phone?: string;
  status?: "active" | "pilot" | "test";
};

// The official operating-area catalog supplied by the operations team.
export const coverageAreas: CoverageArea[] = [
  { code: 1, name: "Umm al-Fahem", nameAr: "أم الفحم", x: 194, y: 285 },
  { code: 2, name: "Kfar Qaree - Arara", nameAr: "كفر قرع - عرعرة", x: 177, y: 318 },
  { code: 4, name: "Baqa al-Gharbiyye", nameAr: "باقة الغربية", x: 145, y: 344 },
  { code: 5, name: "Sakhnin - Arraba - Deir Hanna", nameAr: "سخنين - عرابة - دير حنا", x: 238, y: 154 },
  { code: 6, name: "Kfar Kana - Mashhad - Reineh", nameAr: "كفر كنا - المشهد - الرينة", x: 245, y: 199 },
  { code: 7, name: "Shefa-Amr - I'billin", nameAr: "شفاعمرو - إعبلين", x: 169, y: 203 },
  { code: 8, name: "Kfar Qasem", nameAr: "كفر قاسم", x: 169, y: 482 },
  { code: 9, name: "Jerusalem", nameAr: "القدس", x: 225, y: 559 },
  { code: 10, name: "Nazareth area", nameAr: "منطقة الناصرة", x: 228, y: 222 },
  { code: 11, name: "Tira", nameAr: "الطيرة", x: 126, y: 426 },
  { code: 12, name: "Taybeh - Tira - Qalansawe", nameAr: "الطيبة - الطيرة - قلنسوة", x: 139, y: 390 },
  { code: 13, name: "Tamra - Kabul", nameAr: "طمرة - كابول", x: 170, y: 151 },
  { code: 16, name: "Judaydah Almaker - Yarka - Yassif", nameAr: "الجديدة المكر - يركا - ياسيف", x: 149, y: 177 },
  { code: 17, name: "Tulkarm", nameAr: "طولكرم", x: 142, y: 412 },
  { code: 19, name: "Karmiel - Shaghur", nameAr: "كرمئيل - الشاغور", x: 199, y: 125 },
  { code: 20, name: "Rahat", nameAr: "رهط", x: 172, y: 647 },
  { code: 23, name: "Afula", nameAr: "العفولة", x: 252, y: 262 },
  { code: 24, name: "Acre - Nahariya", nameAr: "عكا - نهاريا", x: 118, y: 86 },
  { code: 26, name: "Salfit", nameAr: "سلفيت", x: 219, y: 457 },
  { code: 27, name: "Qalqilya", nameAr: "قلقيلية", x: 151, y: 457 },
  { code: 28, name: "Tangier", nameAr: "طنجة", x: 320, y: 92 },
  { code: 29, name: "Harish", nameAr: "حريش", x: 155, y: 296 },
  { code: 36, name: "Kenitra", nameAr: "القنيطرة", x: 320, y: 126 },
  { code: 37, name: "Tetouan", nameAr: "تطوان", x: 320, y: 160 },
  { code: 38, name: "Al-Sharawiya", nameAr: "الشعراوية", x: 168, y: 371 },
  { code: 39, name: "Wadi Al-Shaeer", nameAr: "وادي الشعير", x: 187, y: 393 },
  { code: 40, name: "Rabat", nameAr: "الرباط", x: 320, y: 194 },
  { code: 41, name: "Mohammedia", nameAr: "المحمدية", x: 320, y: 228 },
  { code: 42, name: "Casablanca", nameAr: "الدار البيضاء", x: 320, y: 262 },
  { code: 43, name: "Haifa", nameAr: "حيفا", x: 112, y: 143 },
  { code: 44, name: "Israel Post Pilot", nameAr: "تجربة بريد إسرائيل", x: 106, y: 548, status: "pilot" },
  { code: 45, name: "Jaffa - Florentin", nameAr: "يافا - فلورنتين", x: 83, y: 522 },
  { code: 46, name: "Hura", nameAr: "حورة", x: 213, y: 672 },
  { code: 47, name: "Ma'alot Tarshiha", nameAr: "معالوت ترشيحا", x: 185, y: 55 },
  { code: 48, name: "Kafr Manda", nameAr: "كفر مندا", x: 205, y: 187 },
  { code: 49, name: "TEST100", nameAr: "TEST100", x: 322, y: 655, status: "test" },
  { code: 50, name: "Abu Ghosh", nameAr: "أبو غوش", x: 180, y: 544 },
  { code: 51, name: "Krayot", nameAr: "الكرايوت", x: 126, y: 112 },
  { code: 52, name: "Tel Aviv", nameAr: "تل أبيب", x: 91, y: 492 },
  { code: 53, name: "Wadi Ara - Baqa - Menashe", nameAr: "وادي عارة - باقة - منشيه", x: 158, y: 337 },
];
