export type ShiftType="Morning Shift"|"Evening Shift"|"Night Shift"|"Day Off";
export type AttendanceStatus="Working"|"Day Off"|"Late"|"Absent";
export interface ScheduleEntry{id:string;employeeId:string;employeeName:string;department:string;date:string;day:string;start:string;end:string;duration:string;shiftType:ShiftType;breakMinutes:number;status:AttendanceStatus;notes?:string;location?:string}
export interface PerformanceMetric{period:string;quality:number;productivity:number;attendance:number;reviews:number;compliance:number;overall:number}
export interface EmployeeReview{id:string;date:string;reviewer:string;workType:string;overall:number;quality:number;productivity:number;communication:number;compliance:number;attendance:number;cases:number;errors:number;strengths:string;improvement:string;acknowledged:boolean}

export const mockSchedule:ScheduleEntry[]=[
 {id:"s1",employeeId:"1001",employeeName:"أحمد محمد",department:"Customer Chat",date:"2026-08-03",day:"الاثنين",start:"09:00",end:"17:00",duration:"8h",shiftType:"Morning Shift",breakMinutes:45,status:"Working",notes:"Team briefing at 09:15",location:"Ramallah HQ"},
 {id:"s2",employeeId:"1001",employeeName:"أحمد محمد",department:"Customer Chat",date:"2026-08-04",day:"الثلاثاء",start:"09:00",end:"17:00",duration:"8h",shiftType:"Morning Shift",breakMinutes:45,status:"Working",location:"Ramallah HQ"},
 {id:"s3",employeeId:"1001",employeeName:"أحمد محمد",department:"Customer Chat",date:"2026-08-05",day:"الأربعاء",start:"13:00",end:"21:00",duration:"8h",shiftType:"Evening Shift",breakMinutes:45,status:"Working",location:"Remote"},
 {id:"s4",employeeId:"1001",employeeName:"أحمد محمد",department:"Customer Chat",date:"2026-08-06",day:"الخميس",start:"—",end:"—",duration:"—",shiftType:"Day Off",breakMinutes:0,status:"Day Off"},
 {id:"s5",employeeId:"1001",employeeName:"أحمد محمد",department:"Customer Chat",date:"2026-08-07",day:"الجمعة",start:"17:00",end:"01:00",duration:"8h",shiftType:"Night Shift",breakMinutes:45,status:"Working",location:"Ramallah HQ"},
];
export const mockPerformance:PerformanceMetric[]=[
 {period:"Mar",quality:78,productivity:74,attendance:92,reviews:80,compliance:90,overall:82},{period:"Apr",quality:81,productivity:77,attendance:94,reviews:82,compliance:91,overall:85},{period:"May",quality:84,productivity:82,attendance:93,reviews:85,compliance:93,overall:87},{period:"Jun",quality:86,productivity:84,attendance:96,reviews:87,compliance:94,overall:89},{period:"Jul",quality:90,productivity:87,attendance:97,reviews:91,compliance:96,overall:92},
];
export const mockReviews:EmployeeReview[]=[
 {id:"r1",date:"2026-07-28",reviewer:"سارة خالد",workType:"Customer Chat",overall:92,quality:94,productivity:89,communication:93,compliance:96,attendance:97,cases:42,errors:2,strengths:"سرعة الاستجابة، وضوح التواصل، الالتزام بالسياسة",improvement:"تقليل وقت ما بعد المحادثة",acknowledged:true},
 {id:"r2",date:"2026-06-25",reviewer:"رامي منصور",workType:"Customer Chat",overall:87,quality:88,productivity:84,communication:90,compliance:91,attendance:94,cases:38,errors:4,strengths:"التعامل مع الحالات المعقدة",improvement:"توثيق تفاصيل التحويل",acknowledged:true},
 {id:"r3",date:"2026-05-22",reviewer:"سارة خالد",workType:"Customer Chat",overall:84,quality:85,productivity:82,communication:86,compliance:88,attendance:93,cases:36,errors:5,strengths:"رضا الزبائن",improvement:"مراجعة سياسة Coupons",acknowledged:false},
];
