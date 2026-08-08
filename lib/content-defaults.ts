export type ToolIcon = "dashboard" | "store" | "coupon" | "sheet" | "form" | "warning" | "device" | "link";
export type ToolColor = "rose" | "orange" | "pink" | "green" | "blue" | "purple" | "slate";

export type WorkTool = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  url: string;
  icon: ToolIcon;
  color: ToolColor;
  sortOrder: number;
  isActive: boolean;
};

export type ReplyDepartment = "chat" | "voice" | "both";
export type ReplyContentType = "guide" | "macro";

export type ReplyTemplate = {
  id: string;
  department: ReplyDepartment;
  contentType?: ReplyContentType;
  category: string;
  title: string;
  bodyAr: string;
  bodyHe: string;
  bodyEn: string;
  sortOrder: number;
  isActive: boolean;
};

export const replyCategories = [
  { id: "guide-basics", ar: "أساسيات العمل", en: "Work basics", emoji: "📌" },
  { id: "system-cancelled", ar: "طلبية أُلغيت بعد قبولها", en: "Order cancelled after acceptance", emoji: "🚫" },
  { id: "product-search", ar: "البحث عن صنف", en: "Product search", emoji: "🔎" },
  { id: "restaurant-driver-note", ar: "ملاحظة لمطعم أو مرسل", en: "Restaurant or driver note", emoji: "📝" },
  { id: "not-received", ar: "الطلبية لم تُستلم", en: "Order not received", emoji: "📦" },
  { id: "delayed", ar: "الطلبية متأخرة", en: "Delayed order", emoji: "⏱️" },
  { id: "missing", ar: "الطلبية ناقصة", en: "Missing items", emoji: "🧾" },
  { id: "conversation-closing", ar: "إغلاق المحادثة", en: "Closing the chat", emoji: "✅" },
  { id: "conduct", ar: "آداب المحادثة", en: "Chat conduct", emoji: "🛡️" },
  { id: "quality", ar: "جودة الطلبية", en: "Order quality", emoji: "🍽️" },
  { id: "customer-cancel", ar: "الزبون يريد الإلغاء", en: "Customer cancellation", emoji: "↩️" },
  { id: "important-notes", ar: "ملاحظات هامة", en: "Important notes", emoji: "💡" },
  { id: "voice-hold-policy", ar: "قواعد الهولد", en: "Hold rules", emoji: "⏸️" },
  { id: "voice-supervisor", ar: "طلب مسؤول", en: "Supervisor request", emoji: "👤" },
  { id: "voice-resolution", ar: "إنهاء التوجّه", en: "Resolve before closing", emoji: "🎯" },
  { id: "voice-rating", ar: "رسالة التقييم", en: "Rating message", emoji: "⭐" },
  { id: "voice-late-order", ar: "إجراء Late Order", en: "Late Order procedure", emoji: "⏱️" },
  { id: "voice-areen-gaming", ar: "حالات Areen Gaming", en: "Areen Gaming cases", emoji: "🎮" },
  { id: "voice-callback", ar: "الرجوع للزبون", en: "Customer callback", emoji: "📞" },
  { id: "voice-empathy", ar: "التعاطف", en: "Empathy", emoji: "🤝" },
  { id: "voice-no-sound", ar: "مكالمة بدون صوت", en: "No-audio calls", emoji: "🔇" },
  { id: "welcome", ar: "الترحيب والمتابعة", en: "Welcome & follow-up", emoji: "👋" },
  { id: "orders", ar: "الطلبات والتوصيل", en: "Orders & delivery", emoji: "🛵" },
  { id: "compensation", ar: "التعويضات", en: "Compensation", emoji: "🎁" },
  { id: "account", ar: "الحساب والدفع", en: "Account & payment", emoji: "💳" },
  { id: "technical", ar: "المشاكل التقنية", en: "Technical issues", emoji: "🛠️" },
  { id: "closing", ar: "إغلاق المحادثة", en: "Closing the chat", emoji: "✅" },
] as const;

export const defaultTools: WorkTool[] = [
  { id: "backoffice", titleAr: "داشبورد الطلبات", titleEn: "Orders Dashboard", descriptionAr: "متابعة الطلبات، حالتها، والتفاصيل التشغيلية من مكان واحد.", descriptionEn: "Track orders, statuses, and operational details in one place.", url: "https://backoffice-dashboard.haat.delivery/login", icon: "dashboard", color: "rose", sortOrder: 10, isActive: true },
  { id: "menu", titleAr: "إدارة المنيو", titleEn: "Menu Management", descriptionAr: "الدخول إلى صفحات المطاعم والماركت وتحديث بيانات المنيو.", descriptionEn: "Open restaurant and market pages and manage menu information.", url: "https://business-management-dashboard.haat.delivery/login?callbackUrl=%2Frestaurants", icon: "store", color: "orange", sortOrder: 20, isActive: true },
  { id: "coupons", titleAr: "صفحة الكوبونات", titleEn: "Coupons Dashboard", descriptionAr: "مراجعة الكوبونات والعروض الترويجية وإدارتها بسهولة.", descriptionEn: "Review and manage coupons and promotional offers.", url: "https://marketing-dashboard.haat.delivery/login?callbackUrl=%2Fpromo-coupon", icon: "coupon", color: "pink", sortOrder: 30, isActive: true },
  { id: "accounts", titleAr: "شيت الحسابات", titleEn: "Accounts Sheet", descriptionAr: "فتح شيت الحسابات المشترك ومراجعة البيانات المطلوبة.", descriptionEn: "Open the shared accounts sheet and review the required data.", url: "https://docs.google.com/spreadsheets/d/1cebn91RrukmCX0Ve-nFWTqUo_Y93sOJRV8fDmLn-1cc/edit?gid=1232803912#gid=1232803912", icon: "sheet", color: "green", sortOrder: 40, isActive: true },
  { id: "restaurant-compensation", titleAr: "تعويضات المطاعم", titleEn: "Restaurant Compensation", descriptionAr: "تعبئة نموذج تعويضات المطاعم وإرسال الحالة للمتابعة.", descriptionEn: "Submit restaurant compensation cases for follow-up.", url: "https://docs.google.com/forms/d/e/1FAIpQLSeSkB6S6bW_CTf2C3OG6_nF51oXF1BgxZEsZigHJZp6uCXBPg/viewform", icon: "form", color: "blue", sortOrder: 50, isActive: true },
  { id: "driver-violations", titleAr: "شكوى على مرسل", titleEn: "Driver Violations", descriptionAr: "تسجيل مخالفات المرسلين وإرسال الشكوى للجهة المختصة.", descriptionEn: "Report driver violations to the responsible team.", url: "https://forms.monday.com/forms/88c41518b98addf89d696de234dba968?r=use1", icon: "warning", color: "purple", sortOrder: 60, isActive: true },
  { id: "devices", titleAr: "مشاكل الأجهزة (تيكت)", titleEn: "Device Issues Ticket", descriptionAr: "فتح تيكت جديد لمشاكل الأجهزة ومتابعة طلب الصيانة.", descriptionEn: "Open a new device issue ticket and follow up on maintenance.", url: "https://hub.haat.delivery/devices-management/tickets/new", icon: "device", color: "slate", sortOrder: 70, isActive: true },
  { id: "haat-requests", titleAr: "طلبات HAAT", titleEn: "HAAT Requests", descriptionAr: "فتح صفحة الطلبات الداخلية ومتابعة جميع الطلبات من مكان واحد.", descriptionEn: "Open and follow up on internal HAAT requests in one place.", url: "https://hub.haat.delivery/haat-requests/requests", icon: "form", color: "blue", sortOrder: 80, isActive: true },
  { id: "chatgpt", titleAr: "ChatGPT", titleEn: "ChatGPT", descriptionAr: "فتح ChatGPT للمساعدة في الكتابة والترجمة وتنظيم المعلومات.", descriptionEn: "Open ChatGPT for writing, translation, and organizing information.", url: "https://chatgpt.com/", icon: "link", color: "purple", sortOrder: 90, isActive: true },
  { id: "google-docs", titleAr: "مستندات Google", titleEn: "Google Docs", descriptionAr: "إنشاء المستندات وفتحها وتعديلها ومشاركتها بسهولة.", descriptionEn: "Create, open, edit, and share documents easily.", url: "https://docs.google.com/document/u/0/", icon: "form", color: "blue", sortOrder: 100, isActive: true },
  { id: "google-sheets", titleAr: "جداول Google", titleEn: "Google Sheets", descriptionAr: "إنشاء جداول البيانات وفتحها وتنظيم العمل المشترك.", descriptionEn: "Create, open, and organize shared spreadsheets.", url: "https://docs.google.com/spreadsheets/u/0/?tgif=d", icon: "sheet", color: "green", sortOrder: 110, isActive: true },
  { id: "gemini", titleAr: "Gemini", titleEn: "Gemini", descriptionAr: "فتح مساعد Gemini للبحث والكتابة وتلخيص المعلومات.", descriptionEn: "Open Gemini for research, writing, and summarizing information.", url: "https://gemini.google.com/", icon: "link", color: "blue", sortOrder: 120, isActive: true },
  { id: "connecteam", titleAr: "Connecteam", titleEn: "Connecteam", descriptionAr: "الدخول إلى منصة Connecteam ومتابعة مهام واحتياجات الفريق.", descriptionEn: "Open Connecteam to follow team tasks and workforce needs.", url: "https://app.connecteam.com/", icon: "dashboard", color: "orange", sortOrder: 130, isActive: true },
  { id: "voicenter", titleAr: "لوحة المكالمات", titleEn: "Voicenter", descriptionAr: "فتح لوحة Voicenter لإدارة ومتابعة مكالمات الزبائن.", descriptionEn: "Open Voicenter to manage and follow customer calls.", url: "https://cpanel.voicenter.com/", icon: "dashboard", color: "slate", sortOrder: 140, isActive: true },
  { id: "intercom", titleAr: "Intercom", titleEn: "Intercom", descriptionAr: "فتح Intercom لمتابعة محادثات الزبائن والدعم المباشر.", descriptionEn: "Open Intercom for customer conversations and live support.", url: "https://www.intercom.com/", icon: "link", color: "purple", sortOrder: 150, isActive: true },
  { id: "customer-care-form", titleAr: "قسم العناية بالزبائن", titleEn: "Customer Care Form", descriptionAr: "فتح نموذج قسم العناية بالزبائن وتعبئة الحالة المطلوبة للمتابعة.", descriptionEn: "Open the customer care form and submit a case for follow-up.", url: "https://docs.google.com/forms/d/e/1FAIpQLSfbzLrzZFd1uaZycA2Hg3SK0tL40jtDWyfsrYdKAdhaDjPhow/viewform", icon: "form", color: "rose", sortOrder: 160, isActive: true },
];

export const defaultReplies: ReplyTemplate[] = [
  {
    id: "guide-chat-basics", department: "chat", contentType: "guide", category: "guide-basics", title: "أساسيات استقبال المحادثات", sortOrder: 10, isActive: true,
    bodyAr: "1) استقبال المحادثات ومعالجة التوجهات حسب السياسات.\n2) التنسيق مع مسؤول الشفت قبل الخروج لأي Away.\n3) تحويل المحادثات عند الخروج للبريك حسب تعليمات مسؤول الشفت.",
    bodyHe: "1) לקבל את השיחות ולטפל בפניות בהתאם למדיניות.\n2) לתאם עם אחראי המשמרת לפני מעבר למצב Away.\n3) להעביר את השיחות לפני היציאה להפסקה בהתאם להנחיות אחראי המשמרת.",
    bodyEn: "1) Receive chats and handle each request according to policy.\n2) Coordinate with the shift supervisor before switching to Away.\n3) Transfer chats before going on break, following the shift supervisor's instructions."
  },
  {
    id: "guide-system-cancelled", department: "chat", contentType: "guide", category: "system-cancelled", title: "الطلبية أُلغيت بعد قبولها لأي سبب", sortOrder: 20, isActive: true,
    bodyAr: "1) اعتذار من الزبون: في خطأ منا صار أكيد 😅\n2) بنوضحله السبب، وبنحكيله إنه بقدر يرجع يطلب كمان مرة.\n3) إذا مر على طلبه أكثر من 20 دقيقة من وقت الطلب بنعوضه توصيل مجاني على التجربة.\n4) إذا مر أقل من 20 دقيقة من وقت الطلب وكان مستاء، استشير مسؤول الشفت.\n5) إذا كان الإلغاء بطلب من الزبون، التعويض حسب السياسة.",
    bodyHe: "1) להתנצל בפני הלקוח ולהבהיר שכנראה אירעה טעות מצידנו 😅\n2) להסביר את הסיבה ולומר שניתן לבצע הזמנה חדשה.\n3) אם עברו יותר מ-20 דקות מרגע ההזמנה, לתת פיצוי של משלוח חינם עבור החוויה.\n4) אם עברו פחות מ-20 דקות והלקוח אינו מרוצה, להתייעץ עם אחראי המשמרת.\n5) אם הביטול נעשה לבקשת הלקוח, הפיצוי יהיה בהתאם למדיניות.",
    bodyEn: "1) Apologize to the customer and explain that an error likely occurred on our side 😅\n2) Explain the reason and let the customer know they can place a new order.\n3) If more than 20 minutes passed since the order was placed, offer free-delivery compensation for the experience.\n4) If less than 20 minutes passed and the customer is upset, consult the shift supervisor.\n5) If the cancellation was requested by the customer, compensation follows policy."
  },
  {
    id: "guide-product-search", department: "chat", contentType: "guide", category: "product-search", title: "زبون بسأل عن صنف على التطبيق", sortOrder: 30, isActive: true,
    bodyAr: "1) بنبعثله ماكرو (بحث عن صنف) المناسب للمذكر أو المؤنث.\n2) بنتأكد منه إذا لقى طلبه.\n3) إذا لا، بنحاول نساعده أكثر: بنسأله عن محل معين أو بندور إحنا على الجوال.",
    bodyHe: "1) לשלוח את מאקרו חיפוש הפריט המתאים ללקוח או ללקוחה.\n2) לוודא שהפריט המבוקש נמצא.\n3) אם לא, להמשיך לעזור: לשאול אם יש עסק מסוים או לחפש מהטלפון.",
    bodyEn: "1) Send the appropriate Product Search macro for the customer's gender.\n2) Confirm whether the customer found the item.\n3) If not, continue helping by asking about a specific store or searching from the phone."
  },
  {
    id: "macro-product-search-male", department: "chat", contentType: "macro", category: "product-search", title: "بحث عن صنف - مذكر", sortOrder: 31, isActive: true,
    bodyAr: "عندك خانة البحث الموجودة بأعلى الصفحة، بإمكانك تكتب فيها أي صنف حابب تطلبه، ورح تظهرلك جميع المحلات اللي متوفر عندها هاد الصنف 🌹\nهيك بتقدر تختار المحل الأنسب وتطلب منه بكل سهولة 😊\nوإذا ما لقيت الصنف اللي بدك إياه، ابعتلي اسمه وبساعدك بكل سرور بالبحث عنه 🙏🏻🤍",
    bodyHe: "בחלק העליון של העמוד יש שדה חיפוש. אפשר להקליד בו כל פריט שתרצה להזמין, ויופיעו כל העסקים שבהם הפריט זמין 🌹\nכך תוכל לבחור את העסק המתאים ביותר ולהזמין ממנו בקלות 😊\nאם לא מצאת את הפריט שאתה מחפש, שלח לי את שמו ואשמח לעזור לך לחפש אותו 🙏🏻🤍",
    bodyEn: "There is a search box at the top of the page. You can type in any item you'd like to order, and all the stores where it is available will appear 🌹\nThis way, you can choose the most suitable store and order easily 😊\nIf you can't find the item you want, send me its name and I'll be happy to help you search for it 🙏🏻🤍"
  },
  {
    id: "macro-product-search-female", department: "chat", contentType: "macro", category: "product-search", title: "بحث عن صنف - مؤنث", sortOrder: 32, isActive: true,
    bodyAr: "عندك خانة البحث الموجودة بأعلى الصفحة، بإمكانك تكتبي فيها أي صنف حابة تطلبيه، ورح تظهرلك جميع المحلات اللي متوفر عندها هاد الصنف 🌹\nهيك بتقدري تختاري المحل الأنسب وتطلبي منه بكل سهولة 😊\nوإذا ما لقيتي الصنف اللي بدك إياه، ابعتلي اسمه وبساعدك بكل سرور بالبحث عنه 🙏🏻🤍",
    bodyHe: "בחלק העליון של העמוד יש שדה חיפוש. אפשר להקליד בו כל פריט שתרצי להזמין, ויופיעו כל העסקים שבהם הפריט זמין 🌹\nכך תוכלי לבחור את העסק המתאים ביותר ולהזמין ממנו בקלות 😊\nאם לא מצאת את הפריט שאת מחפשת, שלחי לי את שמו ואשמח לעזור לך לחפש אותו 🙏🏻🤍",
    bodyEn: "There is a search box at the top of the page. You can type in any item you'd like to order, and all the stores where it is available will appear 🌹\nThis way, you can choose the most suitable store and order easily 😊\nIf you can't find the item you want, send me its name and I'll be happy to help you search for it 🙏🏻🤍"
  },
  {
    id: "guide-restaurant-driver-note", department: "chat", contentType: "guide", category: "restaurant-driver-note", title: "ملاحظة لمطعم أو مرسل", sortOrder: 40, isActive: true,
    bodyAr: "1) بوصل الملاحظة للمرسل أو المطعم، وبسجل كومنت.\n2) بسأل الزبون إذا بده مساعدة ثانية.\n3) بنخلي المحادثة احتياط في حال لم يلتزم المطعم أو المرسل بالملاحظة.\n4) نطمئن على الزبون بعد الاستلام.",
    bodyHe: "1) להעביר את ההערה לשליח או למסעדה ולתעד תגובה.\n2) לשאול את הלקוח אם נדרשת עזרה נוספת.\n3) להשאיר את השיחה פתוחה ליתר ביטחון, במקרה שהמסעדה או השליח לא יפעלו לפי ההערה.\n4) לבדוק עם הלקוח לאחר קבלת ההזמנה.",
    bodyEn: "1) Pass the note to the driver or restaurant and document a comment.\n2) Ask the customer whether they need any further help.\n3) Keep the chat open as a precaution in case the restaurant or driver does not follow the note.\n4) Check on the customer after delivery."
  },
  {
    id: "guide-not-received", department: "chat", contentType: "guide", category: "not-received", title: "الزبون لم يستلم الطلبية", sortOrder: 50, isActive: true,
    bodyAr: "حسب متابعة الكنترول، لم يكن هناك رد من الزبون:\n1) نوضح للزبون شو صار.\n2) إذا فيزا: نعرض عليه ريميك. إذا رفض الريميك، نلغي الطلبية - ممنوع كوبون محلها بسبب الإجراءات القانونية.\n3) إذا كاش: بعد التوضيح للزبون، بنخبره إنه بقدر يرجع يطلب من جديد.\nملاحظة: بنقدر نشرحله كيف يغير رقمه على التطبيق إذا فيه مشكلة، أو نحكيله يحط ملاحظة للمرسل يتواصل واتس إذا ما عنده كليتا.",
    bodyHe: "לפי המעקב מהבקרה, לא התקבלה תשובה מהלקוח:\n1) להסביר ללקוח מה קרה.\n2) אם התשלום ב-Visa: להציע הכנה מחדש. אם הלקוח מסרב, לבטל את ההזמנה - אסור לתת קופון במקום בגלל ההליכים המשפטיים.\n3) אם התשלום במזומן: לאחר ההסבר, לומר שניתן להזמין מחדש.\nהערה: אפשר להסביר כיצד לשנות את מספר הטלפון באפליקציה, או להוסיף הערה שהשליח ייצור קשר ב-WhatsApp אם אין קליטה.",
    bodyEn: "According to control follow-up, the customer did not answer:\n1) Explain what happened.\n2) If paid by Visa: offer a remake. If the customer refuses, cancel the order - do not issue a coupon instead due to legal procedures.\n3) If paid in cash: after explaining, let the customer know they can place a new order.\nNote: Explain how to change the phone number in the app if needed, or suggest adding a note asking the driver to contact them on WhatsApp when there is no signal."
  },
  {
    id: "guide-delayed", department: "chat", contentType: "guide", category: "delayed", title: "الطلبية متأخرة", sortOrder: 60, isActive: true,
    bodyAr: "1) اعتذار وتعاطف.\n2) نعطي الزبون وقت تقريبي للاستلام.\n3) بنتطمن على جودة الطلبية.\n4) في حال الزبون رد: حسب السياسات.\n5) في حال ما رد الزبون: اتصال هاتفي. إذا الوقت بعد الساعة 12 فلا مجال للاتصال، أو إذا ما تجاوب هاتفيًا، بنبعث تعويض حسب السياسة إذا ما شكى عن جودة الطلبية باستخدام ماكرو (تعويض بدون رد).\n- Late: في حال الزبون ما شكى إنها باردة.\n- إذا شكى إنها باردة: تعتبر مشكلة عالقة إذا ما رد، وما بنبعث الكوبون بدون موافقته، وما بنسكرها.",
    bodyHe: "1) להתנצל ולהביע אמפתיה.\n2) לתת ללקוח זמן הגעה משוער.\n3) לבדוק את איכות ההזמנה.\n4) אם הלקוח מגיב: לפעול לפי המדיניות.\n5) אם הלקוח לא מגיב: לנסות שיחה טלפונית. אחרי השעה 12 אין לבצע שיחה. אם אין מענה טלפוני, לשלוח פיצוי לפי המדיניות רק אם לא הייתה תלונה על איכות ההזמנה, באמצעות מאקרו פיצוי ללא מענה.\n- Late: כאשר הלקוח לא טען שההזמנה קרה.\n- אם הלקוח טען שהיא קרה: להשאיר את המקרה פתוח, לא לשלוח קופון ללא אישורו ולא לסגור את השיחה.",
    bodyEn: "1) Apologize and show empathy.\n2) Give the customer an estimated delivery time.\n3) Check on the order's quality.\n4) If the customer responds, follow policy.\n5) If the customer does not respond, try a phone call. Do not call after 12. If there is no phone response, send compensation according to policy only when the customer did not report a quality issue, using the No-response Compensation macro.\n- Late: when the customer did not complain that the order was cold.\n- If the customer said it was cold: keep the case open, do not send a coupon without consent, and do not close the chat."
  },
  {
    id: "macro-no-response-compensation", department: "chat", contentType: "macro", category: "delayed", title: "تعويض بدون رد", sortOrder: 61, isActive: true,
    bodyAr: "حرصًا منا على رضاك 🌸، قمنا بإضافة تعويض لحسابك بقيمة توصيل مجاني.\nبنعتذر عن الإزعاج، ونتمنى تكون تجربتك القادمة أفضل. وإذا كنت شايف إن التعويض الحالي مش ملائم لإلك، بإمكانك التواصل معنا من خلال محادثة جديدة، ورح نكون سعيدين بخدمتك ومتابعة الموضوع معك 🤍",
    bodyHe: "מתוך רצון לשביעות רצונך 🌸, הוספנו לחשבונך פיצוי של משלוח חינם.\nאנו מתנצלים על אי הנוחות ומקווים שהחוויה הבאה שלך תהיה טובה יותר. אם הפיצוי הנוכחי אינו מתאים עבורך, אפשר לפנות אלינו בשיחה חדשה ונשמח לעזור ולהמשיך לטפל בנושא 🤍",
    bodyEn: "To ensure your satisfaction 🌸, we have added free-delivery compensation to your account.\nWe apologize for the inconvenience and hope your next experience will be better. If you feel the current compensation is not suitable, you can contact us through a new chat, and we will be happy to assist you and follow up on the matter 🤍"
  },
  {
    id: "guide-missing", department: "chat", contentType: "guide", category: "missing", title: "الطلبية ناقصة", sortOrder: 70, isActive: true,
    bodyAr: "نتعامل معها مثل الطلبية المتأخرة تمامًا. ما تنسى التوصيل المجاني إذا كانت وجبة أساسية، أو إذا في تأخير على الطلبية (Late + missing).",
    bodyHe: "מטפלים בדיוק כמו בהזמנה מאוחרת. לא לשכוח משלוח חינם אם חסרה מנה עיקרית, או אם ההזמנה גם מאוחרת (Late + missing).",
    bodyEn: "Handle it exactly like a delayed order. Do not forget free delivery when a main meal is missing, or when the order is both late and missing items (Late + missing)."
  },
  {
    id: "guide-closing", department: "chat", contentType: "guide", category: "conversation-closing", title: "متى أسكر المحادثة ومتى ممنوع أسكرها؟", sortOrder: 80, isActive: true,
    bodyAr: "في حالتين أساسيتين: الزبون برد وبتجاوب، أو الزبون ما برد.\n\nالزبون برد علينا:\n- الزبون راض؟ سكرها وأنت مرتاح.\n- الزبون غير راض؟ استنى شوي، احكي معه بطريقة مختلفة وحاول تقنعه - رنله تلفون أفضل. إذا ظل غير راضٍ، استشير مسؤول الشفت أو حوله للعناية. ما تعطيه التعويض وهو مش مبسوط؛ بتقدر تعطيه الكوبون وتحوله للعناية.\n\nالزبون ما رد علينا:\n- ما أبدى استياء خلال المحادثة وما في مشكلة؟ إذا متأكد إنه مش مستاء، سكرها.\n- مستاء وما في مشكلة واضحة؟ كونه مستاء لحالها مشكلة. إذا رنيت وما رد اعتبرها عالقة واستشير مسؤول الشفت.\nممنوع تسكر أي محادثة والزبون مستاء - استشير مسؤول الشفت.",
    bodyHe: "יש שני מצבים עיקריים: הלקוח מגיב ומשתף פעולה, או שאינו מגיב.\n\nהלקוח מגיב:\n- הלקוח מרוצה? אפשר לסגור את השיחה.\n- הלקוח אינו מרוצה? להמתין, לנסות להסביר בדרך אחרת ולשכנע - עדיף להתקשר. אם עדיין אינו מרוצה, להתייעץ עם אחראי המשמרת או להעביר לשירות הלקוחות. לא לתת פיצוי כשהלקוח עדיין כועס; אפשר לתת קופון ולהעביר לשירות הלקוחות.\n\nהלקוח לא מגיב:\n- לא הביע חוסר שביעות רצון ואין בעיה? אם בטוחים שאינו כועס, אפשר לסגור.\n- הוא כועס גם בלי בעיה ברורה? עצם חוסר שביעות הרצון הוא בעיה. אם התקשרתם ואין מענה, להשאיר את המקרה פתוח ולהתייעץ עם אחראי המשמרת.\nאסור לסגור שיחה כשהלקוח אינו מרוצה - יש להתייעץ עם אחראי המשמרת.",
    bodyEn: "There are two main situations: the customer is responding and cooperating, or the customer is not responding.\n\nCustomer responds:\n- Satisfied? Close the chat comfortably.\n- Not satisfied? Wait, try a different explanation, and persuade them - a phone call is better. If they remain dissatisfied, consult the shift supervisor or transfer the case to Customer Care. Do not give compensation while they are still unhappy; you may issue the coupon and also transfer the case.\n\nCustomer does not respond:\n- No dissatisfaction and no issue? If you are sure they are not upset, close the chat.\n- Upset even without a clear issue? Their dissatisfaction is itself an issue. If you called and got no answer, keep the case open and consult the shift supervisor.\nNever close a chat while the customer is upset - consult the shift supervisor."
  },
  {
    id: "guide-conduct", department: "chat", contentType: "guide", category: "conduct", title: "زبون بسيء الأدب - كيف أتصرف معه؟", sortOrder: 90, isActive: true,
    bodyAr: "1) التجاهل: إذا كان السب خلال الكلام وكان عنده مشكلة، بحاول أتجاهل الموضوع وأفهم منه المشكلة.\n2) تحذير أول: إذا كان الكلام مسيء جدًا، أو فيه شتم للذات الإلهية، أو إساءة لمندوب أو شخص بذاته - استخدم ماكرو آداب المحادثة / تحذير 1.\n3) تحذير ثانٍ: إذا استمر بالشتائم - استخدم ماكرو آداب المحادثة / تحذير 2.\n4) استمر بنفس الأسلوب؟ استخدم ماكرو آداب المحادثة / تحذير نهائي، وحوّل لمسؤول الشفت مع منشن أو اتصال.",
    bodyHe: "1) להתעלם: אם הקללות נאמרו תוך כדי תיאור בעיה, לנסות להתעלם ולהבין את הבעיה.\n2) אזהרה ראשונה: אם השפה פוגענית מאוד, כוללת קללה כלפי האל, שליח או אדם מסוים - להשתמש במאקרו כללי שיחה / אזהרה 1.\n3) אזהרה שנייה: אם הקללות נמשכות - להשתמש במאקרו כללי שיחה / אזהרה 2.\n4) אם ההתנהגות נמשכת: להשתמש במאקרו אזהרה סופית ולהעביר לאחראי המשמרת עם תיוג או שיחת טלפון.",
    bodyEn: "1) Ignore it: if the insult occurs while the customer is explaining a problem, try to overlook it and understand the issue.\n2) First warning: if the language is severely abusive, includes blasphemy, or insults a driver or a specific person, use the Chat Conduct / Warning 1 macro.\n3) Second warning: if the insults continue, use Chat Conduct / Warning 2.\n4) If the same behavior continues, use Chat Conduct / Final Warning and transfer the case to the shift supervisor with a mention or phone call."
  },
  {
    id: "macro-conduct-warning-1", department: "chat", contentType: "macro", category: "conduct", title: "آداب المحادثة / تحذير 1", sortOrder: 91, isActive: true,
    bodyAr: "أنا متفهم انزعاجك أكيد، ويهمني أساعدك وألاقي حل. لكن بتمنى نحكي باحترام متبادل حتى أقدر أخدمك بشكل أفضل 🙏",
    bodyHe: "אני בהחלט מבין את התסכול שלך, וחשוב לי לעזור ולמצוא פתרון. עם זאת, אבקש שננהל את השיחה בכבוד הדדי כדי שאוכל לסייע לך בצורה הטובה ביותר 🙏",
    bodyEn: "I completely understand your frustration, and it is important to me to help you find a solution. However, I kindly ask that we communicate with mutual respect so I can assist you in the best possible way 🙏"
  },
  {
    id: "macro-conduct-warning-2", department: "chat", contentType: "macro", category: "conduct", title: "آداب المحادثة / تحذير 2", sortOrder: 92, isActive: true,
    bodyAr: "إحنا جاهزين نساعدك ونتابع مشكلتك، لكن ما رح نتمكن من الاستمرار بالمحادثة مع وجود إساءات أو ألفاظ غير لائقة. إذا حابب نكمل ونتوصل لحل، بنرجو الالتزام بأسلوب مناسب.",
    bodyHe: "אנחנו כאן כדי לעזור ולהמשיך לטפל בבעיה, אך לא נוכל להמשיך את השיחה כאשר נעשה שימוש בהעלבות או בשפה בלתי הולמת. אם ברצונך שנמשיך ונגיע לפתרון, נבקש לשמור על שיח מכבד.",
    bodyEn: "We are ready to help and continue handling your issue, but we will not be able to continue the conversation while insults or inappropriate language are being used. If you would like us to continue and reach a solution, please keep the conversation respectful."
  },
  {
    id: "macro-conduct-final-warning", department: "chat", contentType: "macro", category: "conduct", title: "آداب المحادثة / تحذير نهائي", sortOrder: 93, isActive: true,
    bodyAr: "للأسف، بسبب استمرار استخدام ألفاظ غير لائقة، لن أتمكن من متابعة المحادثة. بإمكانك التواصل معنا مرة أخرى عندما يكون الحوار بشكل مناسب.",
    bodyHe: "לצערי, בעקבות המשך השימוש בשפה בלתי הולמת, לא אוכל להמשיך את השיחה. אפשר לפנות אלינו שוב כאשר השיח יתנהל בצורה מכבדת.",
    bodyEn: "Unfortunately, due to the continued use of inappropriate language, I will not be able to continue this conversation. You may contact us again when the conversation can be conducted respectfully."
  },
  {
    id: "guide-quality", department: "chat", contentType: "guide", category: "quality", title: "مشكلة بجودة الطلبية", sortOrder: 100, isActive: true,
    bodyAr: "مثل: مش زاكية، مزيتة، الكمية قليلة، أو محروقة. لازم نفرق إذا فعلًا هناك مشكلة حقيقية أو فقط وصفة مطعم، عن طريق:\n1) أخذ تفاصيل كافية من الزبون.\n2) وجهة نظرك كمندوب مهمة بتقدير المشكلة.\n3) فحص مع المطعم - هام جدًا توصيل المشكلة للمطعم.\n4) سجل الزبون.\nحسب المعطيات الأربعة بنقرر إذا المشكلة عليها تعويض، أو وصفة مطعم وما بطلعله تعويض. بالحالتين تفهم الزبون وما تدافع عن المطعم. إذا كان مستاء افحص مع مسؤول الشفت.",
    bodyHe: "לדוגמה: לא טעים, שמנוני, כמות קטנה או שרוף. יש להבדיל בין בעיית איכות אמיתית לבין מתכון של המסעדה באמצעות:\n1) קבלת מספיק פרטים מהלקוח.\n2) שיקול הדעת של הנציג בהערכת הבעיה.\n3) בדיקה מול המסעדה - חשוב מאוד להעביר לה את הבעיה.\n4) היסטוריית הלקוח.\nלפי ארבעת הנתונים מחליטים אם מגיע פיצוי או שמדובר במתכון של המסעדה ללא פיצוי. בשני המקרים יש להבין את הלקוח ולא להגן על המסעדה. אם הלקוח כועס, לבדוק מול אחראי המשמרת.",
    bodyEn: "Examples: not tasty, oily, small quantity, or burnt. Distinguish a genuine quality issue from the restaurant's recipe by reviewing:\n1) Sufficient details from the customer.\n2) Your judgment as an agent when assessing the issue.\n3) A check with the restaurant - it is very important to communicate the issue to the restaurant.\n4) The customer's history.\nUse these four inputs to decide whether compensation applies or whether it is simply the restaurant's recipe and no compensation is due. In both cases, understand the customer and do not defend the restaurant. If the customer is upset, check with the shift supervisor."
  },
  {
    id: "guide-customer-cancel", department: "chat", contentType: "guide", category: "customer-cancel", title: "الزبون بده يلغي الطلبية", sortOrder: 110, isActive: true,
    bodyAr: "1) فحص سريع مهم: بنحاول نوقفها مع المحل قبل ما نفهم من الزبون.\n2) بنفهم السبب من الزبون، وبنحاول نقنعه نستعجل بالطلبية، أو إذا ماركت وفش أصناف متوفرة نعرض عليه بدائل. أهم خطوة: نحاول نقنع الزبون.\n3) إذا أصر على الإلغاء بنلغي الطلبية.\n4) في حال تكرر الإلغاء عند الزبون: منشن لمسؤول الشفت، بس تصرف طبيعي والغي عادي.\nإذا الطلبية ماركت ومبلغها أعلى من 200 شيقل، بقدر أقترح على الزبون توصيل مجاني.",
    bodyHe: "1) לבצע בדיקה מהירה ולנסות לעצור את ההזמנה מול העסק עוד לפני בירור מלא עם הלקוח.\n2) להבין את הסיבה, לנסות לשכנע את הלקוח לזרז את ההזמנה, או להציע חלופות אם זו הזמנת מרקט ומוצרים חסרים. הצעד החשוב ביותר הוא לנסות לשכנע את הלקוח.\n3) אם הלקוח מתעקש, לבטל את ההזמנה.\n4) אם הביטולים חוזרים אצל אותו לקוח, לתייג את אחראי המשמרת, אך לפעול כרגיל ולבטל.\nאם זו הזמנת מרקט מעל 200 ש\"ח, אפשר להציע משלוח חינם.",
    bodyEn: "1) Make a quick check and try to stop the order with the store before fully discussing it with the customer.\n2) Understand the reason and try to persuade the customer by expediting the order, or offer alternatives if it is a market order with unavailable items. The most important step is to try to persuade the customer.\n3) If the customer insists, cancel the order.\n4) If the customer repeatedly cancels, mention the shift supervisor, but handle the cancellation normally.\nFor a market order above NIS 200, you may suggest free delivery."
  },
  {
    id: "guide-important-notes", department: "chat", contentType: "guide", category: "important-notes", title: "ملاحظات هامة", sortOrder: 120, isActive: true,
    bodyAr: "1) التعاطف والأسلوب أهم إشي. غلط نكذب الزبون أو نحسسه إن الموضوع مادي وهو بدور على تعويض - حتى لو كان هيك.\n2) بنتعامل حسب السياسات: ما بطلب من الزبون إرجاع الطلبية إلا إذا السياسة بتحكي هيك.\n3) إذا مر عليك سؤال أو حالة ما عرفت تتصرف فيها، مسؤول الشفت دائمًا موجود - ما تتردد تسأل.\n4) احرص إن الزبون يطلع راضي كمعاملة وأسلوب قبل التعويض.\n5) قبل ما أعرض على الزبون أحوله عناية، لازم أكون فعلًا أقنعته وحاولت معه. لا تستخدموا جملة: ملائم إلك ولا أحولك عناية 😅\n6) جمل قصيرة قريبة من الزبون أفضل من ماكرو طويلة بأسلوب ممل.\n7) الحل لازم يكون سريع، خصوصًا إذا الزبون بده ريميك.\n8) دائمًا لازم أعوض الزبون إذا تأخرت الطلبية، حتى لو ما اعترض على الوقت (Late).\n9) بنقدر نعوض الزبون ونحوله عناية كمان إذا هو حابب حدا يحكي معه: ابعث تعويضك وخلي الباقي عند العناية.\n10) إذا وافق الزبون على التحويل للعناية، اعمل منشن لمسؤول الشفت فورًا. ممنوع أي مشكلة تتحول للعناية بدون موافقة مسؤول الشفت خلال وقت قصير. المشكلة العالقة نفس الإشي - ما تأخرهاش.\n11) مسؤول الشفت ما رد؟ رنله.",
    bodyHe: "1) אמפתיה וסגנון הם הדבר החשוב ביותר. אסור להכחיש את דברי הלקוח או לגרום לו להרגיש שהנושא כספי ושהוא רק מחפש פיצוי.\n2) פועלים לפי המדיניות: לא מבקשים מהלקוח להחזיר את ההזמנה אלא אם המדיניות דורשת זאת.\n3) במקרה של שאלה או מצב לא ברור, אחראי המשמרת תמיד זמין - אל תהססו לשאול.\n4) חשוב שהלקוח יהיה מרוצה מהיחס ומהסגנון עוד לפני הפיצוי.\n5) לפני שמציעים העברה לשירות הלקוחות, יש לנסות באמת לשכנע ולעזור. אין להשתמש במשפט: האם זה מתאים לך או שאעביר אותך לשירות הלקוחות 😅\n6) משפטים קצרים וקרובים ללקוח עדיפים על מאקרו ארוך ומשעמם.\n7) הפתרון חייב להיות מהיר, במיוחד כשהלקוח מבקש הכנה מחדש.\n8) תמיד יש לפצות על הזמנה מאוחרת, גם אם הלקוח לא התלונן על הזמן (Late).\n9) אפשר לפצות וגם להעביר לשירות הלקוחות אם הלקוח רוצה לדבר עם מישהו: לשלוח את הפיצוי ולהשאיר את ההמשך לצוות.\n10) אם הלקוח מסכים להעברה, יש לתייג מיד את אחראי המשמרת. אסור להעביר בעיה ללא אישור מהיר של אחראי המשמרת. כך גם במקרה פתוח - אין לעכב אותו.\n11) אחראי המשמרת לא ענה? להתקשר אליו.",
    bodyEn: "1) Empathy and tone matter most. Do not deny the customer's account or make them feel the matter is only financial and that they are seeking compensation.\n2) Follow policy: do not ask the customer to return the order unless the policy requires it.\n3) If you face a question or case you do not know how to handle, the shift supervisor is always available - do not hesitate to ask.\n4) Make sure the customer is satisfied with the treatment and communication style before compensation.\n5) Before offering a Customer Care transfer, genuinely try to persuade and help. Do not use the phrase: Is that suitable, or should I transfer you to Customer Care? 😅\n6) Short, customer-friendly sentences are better than long, boring macros.\n7) The solution must be quick, especially when the customer wants a remake.\n8) Always compensate the customer when the order is late, even if they did not object to the time (Late).\n9) You may compensate the customer and also transfer them to Customer Care if they want to speak with someone: send the compensation and leave the remaining follow-up to the team.\n10) If the customer agrees to the transfer, mention the shift supervisor immediately. No issue may be transferred without prompt supervisor approval. The same applies to an open case - do not delay it.\n11) If the shift supervisor does not respond, call them."
  },
  {
    id: "guide-voice-hold-policy", department: "voice", contentType: "guide", category: "voice-hold-policy", title: "نقطة الهولد", sortOrder: 130, isActive: true,
    bodyAr: "• ما نخلي الزبون أو المطعم على الانتظار أكثر من 3 دقائق متواصلة.\n• إذا حل المشكلة بحتاج وقت أطول، منرجع للزبون قبل انتهاء الـ3 دقائق، ومنبلغه إنه يحتاج منا دقائق إضافية، وبعدها منرجع للهولد إذا لزم الأمر.\n\nمهم جدًا: وقت الهولد لازم يكون منطقي، وما نحط الزبون أو المطعم على الهولد بدون سبب.",
    bodyHe: "• אין להשאיר את הלקוח או המסעדה בהמתנה יותר מ-3 דקות רצופות.\n• אם פתרון הבעיה דורש יותר זמן, יש לחזור ללקוח לפני תום 3 הדקות, לעדכן שנדרשות כמה דקות נוספות, ורק אז להחזיר אותו להמתנה במידת הצורך.\n\nחשוב מאוד: זמן ההמתנה חייב להיות הגיוני, ואין להעביר את הלקוח או המסעדה להמתנה ללא סיבה.",
    bodyEn: "• Do not leave the customer or restaurant on hold for more than 3 continuous minutes.\n• If resolving the issue needs more time, return to the customer before the 3 minutes end, explain that you need a few additional minutes, and place them on hold again only if necessary.\n\nVery important: hold time must be reasonable. Never place a customer or restaurant on hold without a valid reason."
  },
  {
    id: "guide-voice-supervisor", department: "voice", contentType: "guide", category: "voice-supervisor", title: "إذا الزبون طلب مسؤول", sortOrder: 131, isActive: true,
    bodyAr: "أولًا:\n• بنحاول نفهم المشكلة بشكل أكبر ونحلها قدر الإمكان.\n• إذا أصرّ الزبون إنه يحكي مع مسؤول، لازم نحوله للمسؤول.\n\nقبل التحويل:\n• بنبلغ المسؤول.\n• بنبعث التوجّه على الجروب بالشكل التالي:\n  1) رقم الطلبية.\n  2) ملخص للمشكلة بحد أقصى 5 كلمات، مع توضيح التفاصيل بالكومنت.\n  3) كتابة: الزبون بدو مسؤول، مع منشن للمسؤول.\n\nالتواصل مع الزبون:\n• بنحكيله: \"المسؤول رح يرجعلك باتصال خلال فترة قصيرة.\"\n• إذا رفض ينهي المكالمة، بنبلغه: \"رح نحطك على الانتظار لحتى يقدر المسؤول يتواصل معك خلال دقائق قليلة.\" وبعدها بنحوله للمسؤول.",
    bodyHe: "תחילה:\n• יש להבין את הבעיה לעומק ולנסות לפתור אותה ככל האפשר.\n• אם הלקוח מתעקש לדבר עם אחראי, יש להעביר אותו לאחראי.\n\nלפני ההעברה:\n• לעדכן את האחראי.\n• לשלוח את הפנייה בקבוצה בפורמט הבא:\n  1) מספר ההזמנה.\n  2) סיכום הבעיה בחמש מילים לכל היותר, ואת הפרטים המלאים בתגובה.\n  3) לכתוב: הלקוח מבקש אחראי, ולתייג את האחראי.\n\nתקשורת עם הלקוח:\n• לומר: \"האחראי יחזור אליך בשיחה תוך זמן קצר.\"\n• אם הלקוח מסרב לסיים את השיחה, לומר: \"אעביר אותך להמתנה כדי שהאחראי יוכל לדבר איתך בתוך כמה דקות.\" לאחר מכן להעביר לאחראי.",
    bodyEn: "First:\n• Understand the issue in greater depth and try to resolve it as much as possible.\n• If the customer insists on speaking with a supervisor, transfer the customer to a supervisor.\n\nBefore the transfer:\n• Inform the supervisor.\n• Send the case to the group in this format:\n  1) Order number.\n  2) A problem summary of no more than 5 words, with full details in the comment.\n  3) Write: Customer wants a supervisor, and mention the supervisor.\n\nCommunicating with the customer:\n• Say: \"The supervisor will call you back shortly.\"\n• If the customer refuses to end the call, say: \"I will place you on hold so the supervisor can speak with you within a few minutes.\" Then transfer the call to the supervisor."
  },
  {
    id: "guide-voice-resolution", department: "voice", contentType: "guide", category: "voice-resolution", title: "ما ننهي المكالمة قبل ما ننهي توجّه الزبون", sortOrder: 132, isActive: true,
    bodyAr: "• لما نحكي للزبون إنه رح نستعجل المرسل أو نفحص مع المحل، ما بننهي المكالمة مباشرة.\n• بنخلي الزبون معنا، وبنفحص فعليًا، وبعدها بنرجعله بالنتيجة.\n• الهدف إن الزبون يشوف إنه في متابعة حقيقية، مش مجرد وعود.",
    bodyHe: "• כאשר אומרים ללקוח שנזרז את השליח או שנבדוק מול העסק, אין לסיים מיד את השיחה.\n• משאירים את הלקוח איתנו, מבצעים את הבדיקה בפועל, ואז חוזרים אליו עם התוצאה.\n• המטרה היא שהלקוח ירגיש שיש מעקב אמיתי ולא רק הבטחות.",
    bodyEn: "• When you tell the customer that you will expedite the driver or check with the restaurant, do not end the call immediately.\n• Keep the customer with you, complete the actual check, and return with the result.\n• The customer should see genuine follow-up, not just hear promises."
  },
  {
    id: "guide-voice-rating", department: "voice", contentType: "guide", category: "voice-rating", title: "رسالة التقييم", sortOrder: 133, isActive: true,
    bodyAr: "• ضروري نحكي رسالة التقييم بنهاية كل مكالمة حسب الإجراء.\n• عدم ذكر رسالة التقييم بخلي كثير من الزبائن يقيّموا الطلبية نفسها بدل تجربة التواصل مع المندوب.",
    bodyHe: "• חובה לומר את הודעת הדירוג בסוף כל שיחה בהתאם לנוהל.\n• אם לא מציינים את הודעת הדירוג, לקוחות רבים עלולים לדרג את ההזמנה עצמה במקום את חוויית השירות עם הנציג.",
    bodyEn: "• Always deliver the rating message at the end of every call according to procedure.\n• Without it, many customers may rate the order itself instead of their service experience with the agent."
  },
  {
    id: "guide-voice-late-order", department: "voice", contentType: "guide", category: "voice-late-order", title: "الالتزام بإجراء Late Order", sortOrder: 134, isActive: true,
    bodyAr: "• ضروري نلتزم بإجراء الـ Late Order حتى لو المرسل حكى إنه باقي دقيقتين أو خمس دقائق ويوصل.\n• الهدف من الإجراء هو ضمان المتابعة والرجوع للزبون، مش فقط معرفة الوقت المتوقع للوصول.",
    bodyHe: "• חובה לפעול לפי נוהל Late Order גם אם השליח אמר שנותרו רק שתיים או חמש דקות להגעה.\n• מטרת הנוהל היא להבטיח מעקב וחזרה ללקוח, ולא רק לדעת את זמן ההגעה המשוער.",
    bodyEn: "• Follow the Late Order procedure even if the driver says they will arrive in two or five minutes.\n• The procedure exists to guarantee follow-up and a return to the customer, not merely to learn the expected arrival time."
  },
  {
    id: "guide-voice-areen-gaming", department: "voice", contentType: "guide", category: "voice-areen-gaming", title: "التعامل مع حالات Areen Gaming", sortOrder: 135, isActive: true,
    bodyAr: "• إذا الزبون كان على تواصل مع مندوب على الشات ورجع تواصل معنا على الفويس، ما بنحكيله: تواصل على الشات، أو إني ما بقدر أساعدك.\n• بنحكيله: \"لحظات أفحص الموضوع.\" وبنراجع المحادثة أو بنفحص مع مسؤول الشات شو آخر تحديث.\n• بعد الفحص، بنطمن الزبون وبنوضحله الإجراء الحالي وآخر المستجدات.\n\nمثال:\n\"فحصت الموضوع حاليًا، المندوب على الشات متواصل مع المحل وبانتظار رد منهم بخصوص المشكلة. أول ما نحصل على تحديث رح يتم التواصل معك على الشات ونتأكد إن المشكلة تنحل.\"",
    bodyHe: "• אם הלקוח היה בקשר עם נציג בצ'אט ופנה שוב דרך שיחה, אין לומר לו לחזור לצ'אט או שאיננו יכולים לעזור.\n• יש לומר: \"רק רגע, אני בודק/ת את הנושא.\" לאחר מכן לבדוק את השיחה או לברר עם אחראי הצ'אט מהו העדכון האחרון.\n• לאחר הבדיקה, להרגיע את הלקוח ולהסביר את הפעולה הנוכחית ואת העדכונים האחרונים.\n\nדוגמה:\n\"בדקתי את הנושא. הנציג בצ'אט נמצא בקשר עם העסק וממתין לתשובתם לגבי הבעיה. ברגע שיהיה עדכון, ניצור איתך קשר בצ'אט ונוודא שהבעיה מטופלת.\"",
    bodyEn: "• If the customer was speaking with an agent on chat and then contacts Voice, do not tell them to return to chat or say that you cannot help.\n• Say: \"One moment while I check the case.\" Review the conversation or ask the Chat supervisor for the latest update.\n• After checking, reassure the customer and explain the current action and latest update.\n\nExample:\n\"I checked the case. The Chat agent is in contact with the restaurant and is waiting for their response about the issue. As soon as we receive an update, we will contact you on chat and make sure the issue is resolved.\""
  },
  {
    id: "guide-voice-callback", department: "voice", contentType: "guide", category: "voice-callback", title: "الرجوع للزبون", sortOrder: 136, isActive: true,
    bodyAr: "• إذا انقطعت المكالمة قبل انتهاء المتابعة، ضروري نرجع للزبون.\n• إذا كان الزبون على الانتظار أثناء الفحص وانقطعت المكالمة، لازم نرجع نتواصل معه ونكمل المتابعة.\n• إذا انقطع الخط بسبب مشكلة كواليتي أو أي سبب تقني أثناء شرح التوجّه، لازم نرجع نرن على الزبون حتى ما يعتقد إنه تم إنهاء المكالمة من طرفنا.\n• إذا أغلق الزبون الخط بسبب استياء واضح من الخدمة، ضروري يتم توجيه الحالة لمسؤول الشفت للمتابعة.",
    bodyHe: "• אם השיחה התנתקה לפני סיום הטיפול, חובה לחזור ללקוח.\n• אם הלקוח היה בהמתנה בזמן הבדיקה והשיחה התנתקה, יש ליצור איתו קשר שוב ולהשלים את המעקב.\n• אם הקו התנתק בגלל בעיית איכות או תקלה טכנית בזמן הסבר הפנייה, יש להתקשר שוב כדי שהלקוח לא יחשוב שסיימנו את השיחה מצידנו.\n• אם הלקוח ניתק בשל חוסר שביעות רצון ברור מהשירות, יש להעביר את המקרה לאחראי המשמרת למעקב.",
    bodyEn: "• If the call disconnects before follow-up is complete, call the customer back.\n• If the customer was on hold during a check and the call disconnected, reconnect and complete the follow-up.\n• If the line drops because of a quality or technical issue while the customer is explaining the case, call back so they do not think we ended the call.\n• If the customer hangs up because of clear dissatisfaction with the service, direct the case to the shift supervisor for follow-up."
  },
  {
    id: "guide-voice-empathy", department: "voice", contentType: "guide", category: "voice-empathy", title: "التعاطف", sortOrder: 137, isActive: true,
    bodyAr: "• التعاطف جزء أساسي من حل المشكلة.\n• كثير من الحالات ممكن يرضى فيها الزبون من طريقة التعامل والاهتمام قبل ما نوصل لمرحلة التعويض.\n• كل ما حس الزبون إننا فاهمين انزعاجه ومتابعين مشكلته بشكل جدي، كل ما كانت التجربة أفضل.",
    bodyHe: "• אמפתיה היא חלק מרכזי בפתרון הבעיה.\n• במקרים רבים הלקוח יכול להיות מרוצה מהיחס ומהאכפתיות עוד לפני שמגיעים לשלב הפיצוי.\n• ככל שהלקוח מרגיש שאנחנו מבינים את התסכול שלו ועוקבים ברצינות אחר הבעיה, כך החוויה טובה יותר.",
    bodyEn: "• Empathy is an essential part of resolving the issue.\n• In many cases, the customer may be satisfied by the care and handling before compensation is even considered.\n• The more the customer feels that we understand their frustration and are seriously following the issue, the better the experience."
  },
  {
    id: "guide-voice-no-sound", department: "voice", contentType: "guide", category: "voice-no-sound", title: "المكالمات بدون صوت", sortOrder: 138, isActive: true,
    bodyAr: "في حال وصلتنا مكالمة وما كان في صوت من طرف الزبون، بنعطيه فرصة كافية قبل إنهاء المكالمة:\n\n1) بعد الترحيب بنحكي: \"ألو، ما في صوت من طرفك.\"\n2) بعد حوالي 5 ثوانٍ بنحكي: \"لسا ما في صوت من طرفك، ممكن تكون عامل كتم للصوت.\"\n3) إذا ما كان في أي تجاوب، بنحكي: \"لعدم وجود تجاوب من طرفك، مضطر أنهي المكالمة حاليًا. بتقدر ترجع تتواصل معنا من جديد أو تتوجهلنا على الشات إذا كان عندك مشكلة بالصوت.\"",
    bodyHe: "אם מתקבלת שיחה ואין קול מצד הלקוח, יש לתת לו זמן מספק לפני סיום השיחה:\n\n1) לאחר הברכה לומר: \"הלו, אין קול מהצד שלך.\"\n2) לאחר כ-5 שניות לומר: \"עדיין אין קול מהצד שלך, ייתכן שהמיקרופון על השתקה.\"\n3) אם אין תגובה, לומר: \"מכיוון שאין תגובה, אצטרך לסיים את השיחה כרגע. אפשר ליצור איתנו קשר שוב או לפנות אלינו בצ'אט אם קיימת בעיית שמע.\"",
    bodyEn: "If a call arrives with no sound from the customer, give them enough time before ending it:\n\n1) After the greeting, say: \"Hello, I cannot hear any sound from your side.\"\n2) After about 5 seconds, say: \"I still cannot hear you. Your microphone may be muted.\"\n3) If there is still no response, say: \"Since I am not receiving a response, I will need to end the call for now. You can contact us again or reach us by chat if you are having an audio problem.\""
  },
  { id: "voice-opening", department: "voice", category: "welcome", title: "افتتاح المكالمة", sortOrder: 150, isActive: true, bodyAr: "مرحبًا، معك {اسم الموظف} من HAAT. هل أتحدث مع {اسم الزبون} بخصوص الطلب رقم {رقم الطلب}؟ يسعدني مساعدتك.", bodyHe: "שלום, מדבר/ת {שם הנציג} מ-HAAT. האם אני מדבר/ת עם {שם הלקוח} בנוגע להזמנה מספר {מספר ההזמנה}? אשמח לעזור.", bodyEn: "Hello, this is {agent name} from HAAT. Am I speaking with {customer name} about order {order number}? I’ll be happy to help." },
  { id: "voice-verification", department: "voice", category: "account", title: "تأكيد بيانات الطلب", sortOrder: 160, isActive: true, bodyAr: "للتأكد من الطلب الصحيح، هل يمكنك تأكيد رقم الطلب ورقم الهاتف المسجل؟ لن نطلب منك مشاركة بيانات البطاقة كاملة.", bodyHe: "כדי לוודא שזו ההזמנה הנכונה, אפשר לאשר את מספר ההזמנה ואת מספר הטלפון הרשום? לא נבקש פרטי כרטיס מלאים.", bodyEn: "To verify the correct order, could you confirm the order number and registered phone number? We will never ask for full card details." },
  { id: "voice-hold", department: "voice", category: "welcome", title: "طلب الانتظار", sortOrder: 170, isActive: true, bodyAr: "سأتحقق من التفاصيل الآن. هل تسمح لي بوضع المكالمة على الانتظار لدقيقة؟ سأعود إليك فور توفر التحديث.", bodyHe: "אבדוק עכשיו את הפרטים. האם אפשר להעביר את השיחה להמתנה לדקה? אחזור אליך מיד כשיהיה עדכון.", bodyEn: "I’ll check the details now. May I place the call on hold for a minute? I’ll return as soon as I have an update." },
  { id: "voice-hold-return", department: "voice", category: "welcome", title: "العودة بعد الانتظار", sortOrder: 180, isActive: true, bodyAr: "شكرًا لانتظارك. راجعت الحالة، والتحديث الحالي هو: {التحديث}. سأوضح لك الآن الخطوة التالية.", bodyHe: "תודה על ההמתנה. בדקתי את המקרה, והעדכון הנוכחי הוא: {העדכון}. אסביר עכשיו את השלב הבא.", bodyEn: "Thank you for waiting. I reviewed the case, and the current update is: {update}. I’ll now explain the next step." },
  { id: "voice-delay", department: "voice", category: "orders", title: "شرح تأخر الطلب", sortOrder: 190, isActive: true, bodyAr: "أعتذر عن التأخير. الطلب حاليًا {حالة الطلب}، والوقت المتوقع للوصول هو {الوقت المتوقع}. سأبقى متابعًا للحالة معك.", bodyHe: "אני מתנצל/ת על העיכוב. ההזמנה כעת במצב {סטטוס ההזמנה}, וזמן ההגעה המשוער הוא {הזמן המשוער}. אמשיך לעקוב איתך.", bodyEn: "I apologize for the delay. The order is currently {order status}, and the estimated arrival time is {estimated time}. I’ll keep following the case with you." },
  { id: "voice-compensation", department: "voice", category: "compensation", title: "شرح التعويض", sortOrder: 200, isActive: true, bodyAr: "بعد مراجعة الحالة وفق سياسة HAAT، التعويض المستحق هو {قيمة التعويض}. سيتم إضافته إلى {طريقة التعويض} خلال {المدة}.", bodyHe: "לאחר בדיקת המקרה לפי מדיניות HAAT, הפיצוי המאושר הוא {סכום הפיצוי}. הוא יתווסף ל-{אופן הפיצוי} בתוך {משך הזמן}.", bodyEn: "After reviewing the case under HAAT policy, the approved compensation is {compensation value}. It will be added to {compensation method} within {timeframe}." },
  { id: "voice-escalation", department: "voice", category: "technical", title: "رفع الحالة للمتابعة", sortOrder: 210, isActive: true, bodyAr: "سأرفع الحالة الآن إلى الفريق المختص برقم متابعة {رقم المتابعة}. سيتم التواصل معك خلال {المدة المتوقعة} على الرقم المسجل.", bodyHe: "אעביר כעת את המקרה לצוות המתאים עם מספר מעקב {מספר המעקב}. ניצור איתך קשר בתוך {הזמן המשוער} במספר הרשום.", bodyEn: "I’ll escalate the case to the responsible team under reference {reference number}. You’ll be contacted within {expected timeframe} on the registered number." },
  { id: "voice-no-answer", department: "voice", category: "closing", title: "تعذر التواصل هاتفيًا", sortOrder: 220, isActive: true, bodyAr: "حاولنا التواصل معك هاتفيًا بخصوص الطلب رقم {رقم الطلب} ولم نتمكن من الوصول إليك. سنرسل لك التحديث عبر التشات ويمكنك الرد في أي وقت.", bodyHe: "ניסינו ליצור איתך קשר טלפוני בנוגע להזמנה מספר {מספר ההזמנה}, אך לא הצלחנו להשיג אותך. נשלח את העדכון בצ'אט וניתן להשיב בכל עת.", bodyEn: "We tried to reach you by phone regarding order {order number} but could not connect. We’ll send the update by chat, and you can reply anytime." },
  { id: "voice-closing", department: "voice", category: "closing", title: "إنهاء المكالمة", sortOrder: 230, isActive: true, bodyAr: "هل يوجد أي شيء آخر يمكنني مساعدتك فيه؟ شكرًا لتواصلك مع HAAT، ونتمنى لك يومًا سعيدًا.", bodyHe: "האם יש עוד משהו שאוכל לעזור בו? תודה שפנית ל-HAAT, ושיהיה לך יום נעים.", bodyEn: "Is there anything else I can help you with? Thank you for contacting HAAT, and have a wonderful day." },
  {
    id: "shared-stolen-card", department: "both", contentType: "macro", category: "account", title: "فيزا مسروقة", sortOrder: 240, isActive: true,
    bodyAr: "إذا ممكن، من بعد إذنك ابعثلي اسم الزبون اللي نزلت منه الدفعة، وآخر أربع أرقام من البطاقة، ورقم واتساب للتواصل.\n\nوأنا حالًا رح أحوّل الأمر للمحاسبة. وحتى يكون الموضوع آمن أكثر إلك، ضروري تتواصل مع شركة بطاقة الائتمان وتراجع الحركات على الحساب؛ وقتها بتتأكد من أمان الفيزا وإنه ما حدا استخدمها غيرك 🌷",
    bodyHe: "אם אפשר, אשמח לקבל את שם הלקוח שממנו ירד החיוב, את ארבע הספרות האחרונות של הכרטיס ומספר WhatsApp ליצירת קשר.\n\nאעביר את הנושא מיד למחלקת הנהלת החשבונות. כדי לשמור על הביטחון שלך, חשוב ליצור קשר גם עם חברת האשראי ולבדוק את התנועות בחשבון. כך ניתן לוודא שהכרטיס מוגן ושלא נעשה בו שימוש על ידי אדם אחר 🌷",
    bodyEn: "If possible, please send me the name of the customer whose card was charged, the last four digits of the card, and a WhatsApp number for contact.\n\nI will forward the case to Accounting immediately. For your security, please also contact the card issuer and review the account transactions. This will help confirm that the card is secure and has not been used by anyone else 🌷"
  },
  {
    id: "shared-card-cancel-refund", department: "both", contentType: "macro", category: "account", title: "كوبون بدل إلغاء طلب فيزا", sortOrder: 241, isActive: true,
    bodyAr: "للأسف ما في إمكانية لإضافة كوبون، وبنعتذر منك. بما إن الطلبية تم إلغاؤها، المبلغ تم تحويله للاسترجاع على حسابك. هاي إجراءات مرتبطة بشركة البطاقة والبنك وبتحتاج بعض الوقت، بحد أقصى 14 يوم عمل.\n\nمهم أخبرك إن استرجاع المبلغ يتم تلقائيًا خلال الفترة من وقت إلغاء الطلبية وحتى 14 يوم عمل كحد أقصى، مع استثناء يومي الجمعة والسبت 👌\n\nمدة الاسترجاع ممكن تختلف شوي حسب نوع بطاقة الائتمان اللي عندك، لكن تأكد إن حقك محفوظ 💕",
    bodyHe: "לצערנו אין אפשרות להוסיף קופון, ואנחנו מתנצלים. מאחר שההזמנה בוטלה, הסכום הועבר להחזר לחשבונך. מדובר בתהליך של חברת האשראי והבנק, והוא עשוי להימשך עד 14 ימי עסקים.\n\nחשוב לדעת שההחזר מתבצע אוטומטית ממועד ביטול ההזמנה ועד 14 ימי עסקים לכל היותר, ללא ימי שישי ושבת 👌\n\nמשך ההחזר עשוי להשתנות מעט לפי סוג כרטיס האשראי, אך הכסף שלך שמור ויוחזר 💕",
    bodyEn: "Unfortunately, we cannot add a coupon, and we apologize. Since the order was cancelled, the amount has been submitted for a refund to your account. This process is handled by the card issuer and the bank and may take up to 14 business days.\n\nThe refund is processed automatically from the cancellation date within a maximum of 14 business days, excluding Fridays and Saturdays 👌\n\nThe exact time may vary slightly depending on the card type, but please be assured that your funds are protected 💕"
  },
  {
    id: "shared-card-duplicate-charge", department: "both", contentType: "macro", category: "account", title: "خلل فيزا - دفعة مكررة", sortOrder: 242, isActive: true,
    bodyAr: "الدفعة نزلت مرتين بسبب إجراء عام للتحقق من استخدام البطاقة على التطبيق، وهذا ممكن يصير أحيانًا بشكل طبيعي. وما تقلق، الدفعة الإضافية بتنلغي أكيد وبشكل تلقائي ✅\n\nخلال فترة تصل إلى 6 أيام عمل كحد أقصى، مع استثناء يومي الجمعة والسبت.\n\nوأي إشي بتحتاجه، إحنا دائمًا جاهزين نساعدك 🤝",
    bodyHe: "החיוב הופיע פעמיים בעקבות תהליך אימות כללי של השימוש בכרטיס באפליקציה, ולעיתים זה יכול לקרות באופן תקין. אין צורך לדאוג — החיוב הנוסף יתבטל אוטומטית ✅\n\nהביטול עשוי להימשך עד 6 ימי עסקים לכל היותר, ללא ימי שישי ושבת.\n\nאנחנו תמיד כאן לכל עזרה שתצטרך 🤝",
    bodyEn: "The charge appeared twice because of a standard card-verification process in the app, which can occasionally happen. Please do not worry—the additional charge will be cancelled automatically ✅\n\nThis may take up to 6 business days, excluding Fridays and Saturdays.\n\nWe are always here if you need any help 🤝"
  },
  {
    id: "shared-card-charge-no-order", department: "both", contentType: "macro", category: "account", title: "دفعة نزلت - فش طلبية", sortOrder: 243, isActive: true,
    bodyAr: "الدفعة نزلت بسبب إجراء عام للتحقق من استخدام البطاقة على التطبيق، وهذا ممكن يصير أحيانًا بشكل طبيعي. وما تقلق، الدفعة بتنلغي أكيد وبشكل تلقائي ✅\n\nخلال فترة تصل إلى 6 أيام عمل كحد أقصى، مع استثناء يومي الجمعة والسبت.\n\nوأي إشي بتحتاجه، إحنا دائمًا جاهزين نساعدك 🤝",
    bodyHe: "החיוב הופיע בעקבות תהליך אימות כללי של השימוש בכרטיס באפליקציה, ולעיתים זה יכול לקרות באופן תקין. אין צורך לדאוג — החיוב יתבטל אוטומטית ✅\n\nהביטול עשוי להימשך עד 6 ימי עסקים לכל היותר, ללא ימי שישי ושבת.\n\nאנחנו תמיד כאן לכל עזרה שתצטרך 🤝",
    bodyEn: "The charge appeared because of a standard card-verification process in the app, which can occasionally happen. Please do not worry—the charge will be cancelled automatically ✅\n\nThis may take up to 6 business days, excluding Fridays and Saturdays.\n\nWe are always here if you need any help 🤝"
  },
  {
    id: "shared-quality-restaurant-recipe", department: "both", contentType: "macro", category: "quality", title: "جودة 2 / رفض إعادة / وصفة مطعم", sortOrder: 244, isActive: true,
    bodyAr: "بقدّر انزعاجك أكيد 🙏 وما بنرضى تكون تجربتك أقل من اللي بتتوقعه.\n\nتمت متابعة ملاحظتك مع المطعم، وأفادونا إن هاي هي طريقة التحضير المعتمدة عندهم. ومع هيك، ملاحظتك مهمة جدًا بالنسبة إلنا، وتم نقلها للمطعم حتى ياخدوها بعين الاعتبار.\n\nشكرًا لمشاركتنا رأيك، وبنأمل تكون تجربتك القادمة أفضل 💕",
    bodyHe: "אני בהחלט מבין/ה את אי הנוחות שלך 🙏 ואיננו רוצים שהחוויה שלך תהיה פחות ממה שציפית.\n\nבדקנו את ההערה מול המסעדה, והם מסרו שזו שיטת ההכנה המקובלת אצלם. עם זאת, ההערה שלך חשובה לנו מאוד והעברנו אותה למסעדה כדי שייקחו אותה בחשבון.\n\nתודה ששיתפת אותנו בדעתך, ואנחנו מקווים שהחוויה הבאה שלך תהיה טובה יותר 💕",
    bodyEn: "I completely understand your frustration 🙏 and we do not want your experience to fall below your expectations.\n\nWe followed up with the restaurant, and they confirmed that this is their standard preparation method. Even so, your feedback is very important to us, and we shared it with the restaurant for their consideration.\n\nThank you for sharing your feedback. We hope your next experience will be better 💕"
  },
];
