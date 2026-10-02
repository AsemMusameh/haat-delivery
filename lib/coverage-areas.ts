export type CoverageArea = {
  code: number;
  name: string;
  nameAr: string;
  x: number;
  y: number;
  phone?: string;
  status?: "active" | "pilot" | "test";
  hours?: CoverageHours[];
};

export type CoverageHours = {
  zone?: string;
  start: string;
  end: string;
  exception?: string;
};

// The official operating-area catalog supplied by the operations team.
export const coverageAreas: CoverageArea[] = [
  { code: 1, name: "Umm al-Fahem", nameAr: "أم الفحم", x: 194, y: 285, hours: [{ start: "07:00 صباحًا", end: "03:00 فجرًا", exception: "الجمعة: 24 ساعة" }] },
  { code: 5, name: "Sakhnin - Arraba - Deir Hanna", nameAr: "سخنين - عرابة - دير حنا", x: 238, y: 154, hours: [{ start: "09:00 صباحًا", end: "01:30 فجرًا", exception: "الجمعة: 10:00 صباحًا–01:30 فجرًا" }] },
  { code: 8, name: "Kfar Qasem", nameAr: "كفر قاسم", x: 169, y: 482, hours: [{ start: "09:00 صباحًا", end: "01:00 فجرًا", exception: "الجمعة: 11:00 صباحًا–01:00 فجرًا" }] },
  { code: 9, name: "Jerusalem", nameAr: "القدس", x: 225, y: 559, hours: [{ start: "08:00 صباحًا", end: "01:00 فجرًا", exception: "الجمعة: 09:00 صباحًا–01:00 فجرًا" }] },
  { code: 10, name: "Nazareth area", nameAr: "منطقة الناصرة", x: 228, y: 222, hours: [{ start: "07:00 صباحًا", end: "03:00 فجرًا", exception: "الجمعة: 24 ساعة · السبت: 05:00 صباحًا–03:00 فجرًا" }] },
  { code: 13, name: "Tamra - Kabul", nameAr: "طمرة - كابول", x: 170, y: 151, hours: [{ start: "09:00 صباحًا", end: "02:00 فجرًا", exception: "الجمعة: 13:00–02:00 فجرًا" }] },
  { code: 17, name: "Tulkarm", nameAr: "طولكرم", x: 142, y: 412, hours: [{ start: "08:00 صباحًا", end: "02:00 فجرًا", exception: "الجمعة: 08:00–12:15 و13:30–02:00 فجرًا" }] },
  { code: 23, name: "Afula", nameAr: "العفولة", x: 252, y: 262, hours: [{ start: "08:00 صباحًا", end: "00:00 منتصف الليل" }] },
  { code: 24, name: "Acre - Nahariya", nameAr: "عكا - نهاريا", x: 118, y: 86, hours: [{ start: "08:00 صباحًا", end: "01:30 فجرًا" }] },
  { code: 27, name: "Qalqilya", nameAr: "قلقيلية", x: 151, y: 457, hours: [{ start: "08:00 صباحًا", end: "02:00 فجرًا", exception: "الجمعة: 08:00–12:15 و13:30–02:00 فجرًا" }] },
  { code: 38, name: "Al-Sharawiya", nameAr: "الشعراوية", x: 168, y: 371, hours: [{ start: "09:00 صباحًا", end: "02:00 فجرًا", exception: "الجمعة: 08:00–12:15 و14:00–02:00 فجرًا" }] },
  { code: 43, name: "Haifa", nameAr: "حيفا", x: 112, y: 143, hours: [{ start: "08:00 صباحًا", end: "01:30 فجرًا" }] },
  { code: 45, name: "Jaffa - Florentin", nameAr: "يافا - فلورنتين", x: 83, y: 522, hours: [{ start: "00:00", end: "24:00", exception: "24 ساعة يوميًا" }] },
  { code: 47, name: "Ma'alot Tarshiha", nameAr: "معالوت ترشيحا", x: 185, y: 55, hours: [{ start: "09:00 صباحًا", end: "00:00 منتصف الليل" }] },
  { code: 53, name: "Wadi Ara - Baqa - Menashe", nameAr: "وادي عارة - باقة - منشة", x: 158, y: 337, hours: [{ start: "08:00 صباحًا", end: "03:00 فجرًا", exception: "جميع الأيام" }] },
];
