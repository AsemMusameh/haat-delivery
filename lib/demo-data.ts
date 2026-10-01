import type { Announcement, Department, NotificationItem, Profile, Role } from "./types";

export const departments: Department[] = [
  { id: "management", name: "Management", color: "#b40d31" },
  { id: "quality-assurance", name: "Quality Assurance", color: "#16a34a" },
  { id: "shift-managers-chat", name: "Shift Managers - Chat", color: "#7c3aed" },
  { id: "shift-managers-voice", name: "Shift Managers - Voice", color: "#e11d48" },
  { id: "chat", name: "Chat", color: "#2563eb" },
  { id: "voice-center", name: "Voice Center", color: "#db2777" },
  { id: "customer-service-wb", name: "Customer Service - WB", color: "#dc2626" },
  { id: "connect-teams-updates", name: "Connect Teams Updates", color: "#0f6fb5" },
];

type StaffGroup = { departmentId: string; role?: Role; names: string[] };
const staffGroups: StaffGroup[] = [
  { departmentId: "management", role: "manager", names: ["Mohammad Moayyad", "Abdullah Alsayed"] },
  { departmentId: "quality-assurance", names: ["Mujahed", "Abaq Ayman", "Osama Herzallah"] },
  { departmentId: "shift-managers-chat", role: "supervisor", names: ["Sami Moayyad", "Abdulhameed Janem"] },
  { departmentId: "shift-managers-voice", role: "supervisor", names: ["Mahmoud Shaheen", "Mohammad Thneibe", "Asem Musameh"] },
  { departmentId: "chat", names: [
    "Tala Barham", "Athar Bawaqneh", "Noor Thiab", "Aman Salman", "Zainab", "Mahmoud Hantash", "Yazan Arar",
    "Abdalrhman Jayosi", "Aws Kharouf", "Mohammad Jarrad", "Mohammad Zerie", "Abed Alrahman Hejazi", "Ayham Shar'ab",
    "Ameer Taney", "Tameem Dehmes", "Adam Ghanem", "Mohammad Abu Sbeih", "Yaqeen Safarini", "Ahmad Alya", "Jawad Qablawi",
  ] },
  { departmentId: "voice-center", names: [
    "Asmaa Abedeljawad", "Khaled Faqeeh", "Mays Hamdan", "Masa Belbeisi", "Batool Qaise", "Mera Abu Khalil", "Heba Elayan",
    "Suhaib Hassan", "Qutada Saleh", "Mohammad Noor", "Sami Taweel", "Ahmed Jarrar", "Mohammad Saida", "Ahmed Awad",
    "Abed Alrahman Yahya", "Mohammad Abu Leil", "Abd Naghnaghe", "Kareem Kittaneh", "Alaa Abu Shanab", "Jihad Abu Libdah",
    "Muntaser Jbareen", "Mahmood Saddar",
  ] },
  { departmentId: "customer-service-wb", names: ["Asil Ya'qoub", "Ja'far Al-far", "Emad Masri", "Mohammad Kittaneh", "Abdullah Saniora", "Jaber Naje"] },
  { departmentId: "connect-teams-updates", names: ["Lara Nasrallah", "Marah Helal", "Bassel DeBaas", "Sara Jbareen", "Khaled Masarweh", "Majd Younis", "Mohammad Haroon"] },
];

const emailLocalPart = (name: string) => name.toLowerCase().replaceAll("'", "").replaceAll("...", "").replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "");
const staff = staffGroups.flatMap((group) => group.names.map((name) => ({ name, departmentId: group.departmentId, role: group.role ?? "employee" as Role })));

export const demoEmployees: Profile[] = staff.map((person, index) => {
  const department = departments.find((item) => item.id === person.departmentId)!;
  return {
    id: `staff-${String(index + 1).padStart(3, "0")}`,
    employee_id: `HAAT-${String(index + 1).padStart(4, "0")}`,
    full_name: person.name,
    email: `${emailLocalPart(person.name)}@haat.delivery`,
    department_id: person.departmentId,
    department,
    role: person.role,
    is_active: true,
    unread_count: 0,
  };
});

export const rosterEmails = new Set(demoEmployees.map((employee) => employee.email.toLowerCase()));
export const managerEmails = new Set(demoEmployees.filter((employee) => employee.role === "manager").map((employee) => employee.email.toLowerCase()));
export const departmentHeadEmails = new Set(["mohammad.moayyad@haat.delivery"]);
export const demoProfile = demoEmployees[0];
export const demoAnnouncements: Announcement[] = [
  {
    id: "ops-my-market-task-cost",
    title: "توجيه مهم: My Market — Redelivery وRemake",
    body: "يتم التعامل مع My Market مثل باقي المحلات عند عمل Redelivery أو Remake. بعد التواصل معهم بنفس آلية أي محل، يتم تحميلهم تكلفة التوصيل كاملة (Task Cost). يرجى الالتزام بهذه الآلية في جميع الحالات.",
    priority: "urgent", status: "published", author_id: demoEmployees[0].id,
    author: { full_name: "إدارة HAAT" }, published_at: "2026-10-01T03:30:00.000Z",
    is_pinned: true, requires_acknowledgement: true, target_label: "جميع الموظفين ومسؤولي الشفتات",
    read_count: 0, recipient_count: demoEmployees.length, is_read: false,
  },
  {
    id: "ops-customer-alternate-phone",
    title: "توجيه مهم: تواصل المرسل على رقم مختلف",
    body: "عندما يطلب الزبون أن يتواصل معه المرسل على رقم مختلف عن الرقم الموجود في التطبيق:\n\n1) إذا كان هناك مرسل متعيّن: نتصل بالمرسل هاتفياً ونبلغه بالرقم الجديد.\n\n2) إذا لم يكن هناك مرسل متعيّن أو لم يرد المرسل: يجب تحويل التوجيه إلى جروب Issue Tracking على Slack (Connecteam حالياً)، وطلب إبلاغ المرسل فور تعيينه.\n\n3) في جميع الحالات: يجب إضافة الرقم الجديد في الكومنت. تحويل الحالة للمتابعة إلزامي لأن الكومنت وحده قد لا تتم مشاهدته، وقد يتصل المرسل بالرقم القديم ولا تُحل مشكلة الزبون.",
    priority: "urgent", status: "published", author_id: demoEmployees[0].id,
    author: { full_name: "إدارة HAAT" }, published_at: "2026-10-01T03:35:00.000Z",
    is_pinned: true, requires_acknowledgement: true, target_label: "جميع الموظفين ومسؤولي الشفتات",
    read_count: 0, recipient_count: demoEmployees.length, is_read: false,
  },
  {
    id: "ops-voice-hold-policy",
    title: "تعميم بخصوص الهولد بداية المكالمة",
    body: "يعطيكم العافية جميعًا،تعميم\nموضوع مهم ورح أحكي فيه بطريقة مباشرة،\nبخصوص موظفي الفويس: ممنوع منعًا باتًا نرد على الزبون ونحطه بالهولد بداية المكالمة،\nالتصرف بدخل ضمن بند تزوير الأرقام والغش، حتى لو النية مش هيك.\nأي تصرف مثل هاد بعرِّض الموظف لإجراءات\nإدارية.\nكمان أي هولد أكثر من ٣ دقائق مهم نرجع ،للزبون ونطمنه انه  احنا  متابعين معه",
    priority: "urgent", status: "published", author_id: demoEmployees[0].id,
    author: { full_name: "إدارة HAAT" }, published_at: "2026-10-01T05:00:00.000Z",
    is_pinned: true, requires_acknowledgement: true, target_label: "جميع الموظفين ومسؤولي الشفتات",
    read_count: 0, recipient_count: demoEmployees.length, is_read: false,
  },
  {
    id: "ops-courier-compensation-policy",
    title: "تعميم بخصوص تعويضات المرسلين",
    body: "تعميم مساء الخير جميعا،\nيعطيكم العافية بداية على الضغط الي بنمر فيه، قريبا رح يتحسن الموضوع إن شاء الله.\nملاحظات مهمة بخصوص تعويضات المرسلين ،\nإرجاع الطلبية للمحل : الحالات الي مسموح للمرسل يرجع الطلبية فيها للمحل، لما تكون الطلبية ماركت فقط .\nفي حال كانت مطعم والمرسل ما معه مصاري، ما بنرجعه للمحل الا بطلب من الكنترول ، يعني وجهوا المرسل يتواصل مع شات المرسلين.\n----\nالحالات الي المحل بتواصل معنا بده يعيد الطلبية بسبب تأخير المرسل، الشروط كالتالي:\n1- لازم تكون الطلبية -13 من Ready time \n2- لازم نفحص مع المرسل كم بده وقت قبل ما نحكي للمحل يبلش بالاعادة، بلاش المرسل يتأخر بزيادة ونخسر مبلغها كمان مرة.\n3- بنفحص مع الزبون اذا رح يستنى وقت إضافي.\n----\nأمور التعويضات جدا حساسة، سواء للمرسل أو للمطعم أو للزبون، لازم كل طرف يتحمل مسؤوليته وفي حال طرف أخطأ نعمل تشارج عليه ،\n**بالنهاية، هاي التعويضات عبارة عن مبالغ بتتحملها الشركة ، لذلك راح يكون في قسم مختص بمتابعة ومراجعة التعويضات بشكل مستمر. فمهم تكون إجراءاتنا سليمة وكل التفاصيل واضحة بالكومنتات.",
    priority: "urgent", status: "published", author_id: demoEmployees[0].id,
    author: { full_name: "إدارة HAAT" }, published_at: "2026-10-01T05:05:00.000Z",
    is_pinned: true, requires_acknowledgement: true, target_label: "جميع الموظفين ومسؤولي الشفتات",
    read_count: 0, recipient_count: demoEmployees.length, is_read: false,
  },
  {
    id: "ops-restaurant-compensation-contact",
    title: "تعميم استفسارات المطاعم عن التعويض والتشارج",
    body: "ابتداء من اليوم،\nاي مطعم بستفر عن تعويض/ تشارج،\nبنطلب منه يتواصل على شات المطاعم، او عن طريق رقم الواتس الي بوصلهم على شات المطاعم (نفس الاشي)\nالقسم بشتغل كم يوم من ال٩-٥.\n+972 52-994-0743 على هاد الرقم",
    priority: "important", status: "published", author_id: demoEmployees[0].id,
    author: { full_name: "إدارة HAAT" }, published_at: "2026-10-01T05:10:00.000Z",
    is_pinned: true, requires_acknowledgement: true, target_label: "جميع الموظفين ومسؤولي الشفتات",
    read_count: 0, recipient_count: demoEmployees.length, is_read: false,
  },
  {
    id: "ops-break-time-policy",
    title: "تعميم بخصوص وقت الاستراحات",
    body: "يعطيكم العافية، تعميم بخصوص وقت الاسترحات يبدأ تطبيقه من اليوم،\nوقت الاستراحة رح يكون كما هو موضح في الصورة لجميع الأقسام.\nتوضيح بخصوص تقسيمة الاسترحات (Voice center):\nLunch : استراحة 20 دقيقة متواصلة\nPrivate : استراحة قصيرة بموافقة مسؤول الشفت، لا تتعدى 10 دقائق بالمجمل (صلاة ، تدخين)\nAdministrative: استراحة بطلب من مسؤول الشفت لأي شيء يتعلق بالعمل",
    priority: "important", status: "published", author_id: demoEmployees[0].id,
    author: { full_name: "إدارة HAAT" }, published_at: "2026-10-01T05:15:00.000Z",
    is_pinned: true, requires_acknowledgement: true, target_label: "جميع الموظفين ومسؤولي الشفتات",
    read_count: 0, recipient_count: demoEmployees.length, is_read: false,
  },
];
export const demoNotifications: NotificationItem[] = demoAnnouncements.map((announcement) => ({
  id: `notification-${announcement.id}`,
  title: "تعميم جديد يتطلب القراءة",
  body: announcement.title,
  is_read: false,
  created_at: announcement.published_at,
  announcement_id: announcement.id,
  link: `/announcements/${announcement.id}`,
  kind: "announcement",
}));
