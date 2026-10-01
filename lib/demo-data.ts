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
    "Abdalrhman Jayosi", "Aws Kharouf", "Mohammad Jarrad", "Mohammad Zerie", "Abed Alrahman Hej...", "Ayham Shar'ab",
    "Ameer Taney", "Tameem Dehmes", "Adam Ghanem", "Mohammad Abu S...", "Yaqeen Safarini", "Ahmad Alya", "Jawad Qablawi",
  ] },
  { departmentId: "voice-center", names: [
    "Asmaa Abedeljawad", "Khaled Faqeeh", "Mays Hamdan", "Masa Belbeisi", "Batool Qaise", "Mera Abu Khalil", "Heba Elayan",
    "Suhaib Hassan", "Qutada Saleh", "Mohammad Noor", "Sami Taweel", "Ahmed Jarrar", "Mohammad Saida", "Ahmed Awad",
    "Abed Alrahman Yah...", "Mohammad Abu L...", "Abd Naghnaghe", "Kareem Kittaneh", "Alaa Abu Shanab", "Jihad Abu Libdah",
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
export const demoProfile = demoEmployees[0];
export const demoAnnouncements: Announcement[] = [];
export const demoNotifications: NotificationItem[] = [];
