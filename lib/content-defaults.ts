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

export type ReplyTemplate = {
  id: string;
  category: string;
  title: string;
  bodyAr: string;
  bodyHe: string;
  bodyEn: string;
  sortOrder: number;
  isActive: boolean;
};

export const replyCategories = [
  { id: "welcome", ar: "الترحيب والمتابعة", en: "Welcome & follow-up", emoji: "👋" },
  { id: "orders", ar: "الطلبات والتوصيل", en: "Orders & delivery", emoji: "🛵" },
  { id: "restaurant", ar: "المطاعم والماركت", en: "Restaurants & markets", emoji: "🍽️" },
  { id: "compensation", ar: "التعويضات", en: "Compensation", emoji: "🎁" },
  { id: "drivers", ar: "المرسلون", en: "Drivers", emoji: "🚗" },
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
  { id: "devices", titleAr: "مشاكل الأجهزة (تيكت)", titleEn: "Device Issues Ticket", descriptionAr: "فتح تيكت لمشاكل أجهزة المخاشير ومتابعة طلب الصيانة.", descriptionEn: "Open a ticket for device issues and follow up on maintenance.", url: "https://devices.haat.delivery/", icon: "device", color: "slate", sortOrder: 70, isActive: true },
];

export const defaultReplies: ReplyTemplate[] = [
  { id: "welcome-help", category: "welcome", title: "ترحيب وطلب التفاصيل", sortOrder: 10, isActive: true, bodyAr: "مرحبًا {اسم الزبون}، شكرًا لتواصلك مع HAAT 🌸 أنا هنا لمساعدتك. يرجى تزويدي برقم الطلب وتوضيح المشكلة حتى أتابعها معك مباشرة.", bodyHe: "שלום {שם הלקוח}, תודה שפנית ל-HAAT 🌸 אני כאן כדי לעזור. נא לשלוח את מספר ההזמנה ולתאר את הבעיה כדי שאוכל לבדוק אותה מיד.", bodyEn: "Hello {customer name}, thank you for contacting HAAT 🌸 I’m here to help. Please share the order number and describe the issue so I can check it right away." },
  { id: "welcome-call", category: "welcome", title: "محاولة تواصل هاتفي", sortOrder: 20, isActive: true, bodyAr: "حاولت التواصل معك هاتفيًا، لكن يبدو أنك مشغول حاليًا. عندما تكون متاحًا، أرسل لنا ردًا بسيطًا وسنكمل المتابعة معك مباشرة.", bodyHe: "ניסיתי ליצור איתך קשר טלפוני, אך נראה שאינך פנוי כרגע. כשתהיה זמין, אפשר לשלוח לנו הודעה קצרה ונמשיך לטפל במקרה מיד.", bodyEn: "I tried to reach you by phone, but it seems you’re unavailable at the moment. When convenient, send us a short reply and we’ll continue the follow-up right away." },
  { id: "order-delay", category: "orders", title: "تأخر الطلب", sortOrder: 30, isActive: true, bodyAr: "نعتذر عن تأخر طلبك 🙏 أتابع الآن مع الجهة المعنية للتأكد من موقع الطلب والوقت المتوقع لوصوله، وسأعود إليك بالتحديث فورًا.", bodyHe: "אנו מתנצלים על העיכוב בהזמנה 🙏 אני בודק כעת מול הגורם הרלוונטי את מיקום ההזמנה וזמן ההגעה המשוער, ואעדכן אותך מיד.", bodyEn: "We apologize for the delay 🙏 I’m checking with the relevant team for the order’s location and estimated arrival time, and I’ll update you shortly." },
  { id: "order-not-received", category: "orders", title: "الطلب لم يصل", sortOrder: 40, isActive: true, bodyAr: "أتفهم أن الطلب لم يصلك حتى الآن، ونعتذر عن الإزعاج. سأتحقق من حالة الطلب مع المرسل والمطعم، وسأتابع معك حتى يتم توضيح الحالة.", bodyHe: "אני מבין שההזמנה עדיין לא הגיעה, ומתנצל על אי הנוחות. אבדוק את הסטטוס מול השליח והמסעדה ואמשיך לעדכן אותך עד לבירור המקרה.", bodyEn: "I understand that your order has not arrived yet, and we apologize for the inconvenience. I’ll verify the status with the driver and restaurant and keep you updated until it is resolved." },
  { id: "order-cancelled", category: "orders", title: "إلغاء الطلب", sortOrder: 50, isActive: true, bodyAr: "تمت مراجعة طلب الإلغاء. سأتحقق أولًا من مرحلة تجهيز الطلب، لأن إمكانية الإلغاء تعتمد على حالته الحالية، وسأبلغك بالنتيجة مباشرة.", bodyHe: "בקשת הביטול נבדקה. תחילה אבדוק באיזה שלב נמצאת הכנת ההזמנה, מכיוון שאפשרות הביטול תלויה בסטטוס הנוכחי שלה, ואעדכן אותך מיד.", bodyEn: "Your cancellation request has been received. I’ll first check the preparation stage, as cancellation depends on the current order status, and I’ll update you immediately." },
  { id: "restaurant-no-answer", category: "restaurant", title: "المطعم لا يرد", sortOrder: 60, isActive: true, bodyAr: "حاولنا التواصل مع المطعم، لكن لم نتلقَّ ردًا حتى الآن. سنواصل المحاولة ونبقيك على اطلاع، ونعتذر عن وقت الانتظار.", bodyHe: "ניסינו ליצור קשר עם המסעדה, אך טרם התקבלה תשובה. נמשיך לנסות ונעדכן אותך, ומתנצלים על זמן ההמתנה.", bodyEn: "We tried to contact the restaurant but have not received a response yet. We’ll keep trying and keep you updated. We apologize for the wait." },
  { id: "restaurant-quality", category: "restaurant", title: "مشكلة جودة أو طلب بارد", sortOrder: 70, isActive: true, bodyAr: "نعتذر لأن الطلب وصلك بهذه الجودة. يرجى إرسال صورة واضحة للطلب وذكر الأصناف المتأثرة، وسنراجع الحالة وفق سياسة التعويض المعتمدة.", bodyHe: "אנו מתנצלים שההזמנה הגיעה באיכות זו. נא לשלוח תמונה ברורה ולציין אילו פריטים נפגעו, ונבדוק את המקרה בהתאם למדיניות הפיצוי.", bodyEn: "We’re sorry the order arrived in this condition. Please send a clear photo and list the affected items, and we’ll review the case under the approved compensation policy." },
  { id: "comp-added", category: "compensation", title: "تمت إضافة تعويض", sortOrder: 80, isActive: true, bodyAr: "حرصًا منا على رضاك، تمت إضافة تعويض إلى حسابك بقيمة {قيمة التعويض}. نعتذر عن الإزعاج ونتمنى أن تكون تجربتك القادمة أفضل 🤍", bodyHe: "כדי לשמור על שביעות רצונך, נוסף לחשבונך פיצוי בסך {סכום הפיצוי}. אנו מתנצלים על אי הנוחות ומקווים שהחוויה הבאה תהיה טובה יותר 🤍", bodyEn: "To ensure your satisfaction, compensation of {compensation value} has been added to your account. We apologize for the inconvenience and hope your next experience is better 🤍" },
  { id: "comp-review", category: "compensation", title: "مراجعة التعويض", sortOrder: 90, isActive: true, bodyAr: "أتفهم أن التعويض الحالي قد لا يكون مناسبًا لك. سأرفع الحالة للمراجعة وفق تفاصيل الطلب والسياسة المعتمدة، وسنبلغك بالنتيجة بعد اكتمال المتابعة.", bodyHe: "אני מבין שהפיצוי הנוכחי אינו מתאים עבורך. אעביר את המקרה לבדיקה בהתאם לפרטי ההזמנה ולמדיניות, ונעדכן אותך לאחר השלמת הטיפול.", bodyEn: "I understand the current compensation may not feel suitable. I’ll escalate the case for review based on the order details and approved policy, and we’ll update you once the review is complete." },
  { id: "driver-complaint", category: "drivers", title: "شكوى على مرسل", sortOrder: 100, isActive: true, bodyAr: "نعتذر عن التصرف الذي واجهته من المرسل. تم توثيق الشكوى وسيتم تحويلها إلى الفريق المختص للمراجعة واتخاذ الإجراء المناسب.", bodyHe: "אנו מתנצלים על ההתנהלות שחווית מצד השליח. התלונה תועדה ותועבר לצוות האחראי לבדיקה ולטיפול מתאים.", bodyEn: "We apologize for the behavior you experienced from the driver. The complaint has been documented and will be forwarded to the responsible team for review and appropriate action." },
  { id: "account-payment", category: "account", title: "مشكلة دفع أو حساب", sortOrder: 110, isActive: true, bodyAr: "سأراجع مشكلة الحساب أو الدفع معك. يرجى إرسال صورة للرسالة الظاهرة وذكر طريقة الدفع، مع عدم مشاركة بيانات البطاقة الكاملة حفاظًا على خصوصيتك.", bodyHe: "אבדוק איתך את בעיית החשבון או התשלום. נא לשלוח צילום מסך של ההודעה ולציין את אמצעי התשלום, מבלי לשתף פרטי כרטיס מלאים לשמירה על פרטיותך.", bodyEn: "I’ll review the account or payment issue with you. Please send a screenshot of the message and mention the payment method, without sharing full card details for your privacy." },
  { id: "technical-ticket", category: "technical", title: "فتح تيكت تقني", sortOrder: 120, isActive: true, bodyAr: "تم تسجيل المشكلة التقنية. يرجى تزويدنا باسم الجهاز، وصف مختصر للمشكلة، وصورة إن أمكن، حتى يتم فتح التيكت ومتابعته مع الفريق التقني.", bodyHe: "התקלה הטכנית תועדה. נא לשלוח את שם המכשיר, תיאור קצר ותמונה במידת האפשר, כדי לפתוח קריאה ולהעביר אותה לצוות הטכני.", bodyEn: "The technical issue has been recorded. Please provide the device name, a short description, and a photo if possible so a ticket can be opened and followed up with the technical team." },
  { id: "closing-busy", category: "closing", title: "الزبون مشغول", sortOrder: 130, isActive: true, bodyAr: "يبدو أنك مشغول حاليًا، لذلك سأغلق المحادثة مؤقتًا. يمكنك العودة في أي وقت والضغط على «أرسل لنا رسالة»، وسنكون سعداء بمتابعة الموضوع معك من النقطة نفسها. يومك سعيد 🌸", bodyHe: "נראה שאינך פנוי כרגע, ולכן אסגור את השיחה זמנית. ניתן לחזור בכל עת וללחוץ על 'שלחו לנו הודעה', ונשמח להמשיך מאותה נקודה. יום נעים 🌸", bodyEn: "It looks like you’re busy, so I’ll close the chat for now. You can return anytime and select ‘Send us a message’; we’ll be happy to continue from where we stopped. Have a lovely day 🌸" },
  { id: "closing-thanks", category: "closing", title: "شكر وإنهاء المحادثة", sortOrder: 140, isActive: true, bodyAr: "شكرًا لتواصلك مع HAAT. يسعدنا خدمتك دائمًا، وإذا احتجت إلى أي مساعدة إضافية يمكنك التواصل معنا في أي وقت. نتمنى لك يومًا سعيدًا 🌸", bodyHe: "תודה שפנית ל-HAAT. נשמח לעמוד לשירותך תמיד, ואם תזדקק לעזרה נוספת ניתן ליצור איתנו קשר בכל עת. יום נעים 🌸", bodyEn: "Thank you for contacting HAAT. We’re always happy to help, and you can reach us anytime if you need further assistance. Have a wonderful day 🌸" },
];
