# HAAT Employee Hub

نظام ويب داخلي عربي/إنجليزي لإدارة تعميمات HAAT وبيانات الموظفين، مبني بـ Next.js 16 وTypeScript وTailwind CSS وSupabase وFirebase Cloud Messaging. يعمل كتطبيق PWA وقابل للنشر على Vercel.

## ما تم تنفيذه

- تسجيل دخول بالبريد أو الرقم الوظيفي، واستعادة كلمة المرور.
- صفحات محمية مع حماية البيانات الفعلية عبر Supabase RLS.
- لوحة موظف: آخر التعميمات، العاجلة، المثبتة، غير المقروءة، المحفوظات والإشعارات.
- تفاصيل التعميم، تنزيل المرفقات، حفظ التعميم، وتأكيد «تمت القراءة والفهم» مع الوقت.
- لوحة إدارة وإحصاءات ونسب قراءة حسب القسم.
- إنشاء مسودة أو تعميم منشور/مجدول، استهداف قسم أو عدة أقسام، أهمية، تثبيت، تأكيد قراءة ومرفقات.
- تقارير قراءة، أسماء القارئين وغير القارئين، إعادة الإشعار، وتصدير CSV.
- إدارة موظفين مع البحث والفلاتر والاستيراد وواجهات الإضافة/التعديل/التعطيل والحذف.
- إشعارات داخل النظام وFCM لعدة أجهزة مع سجل نجاح/فشل وإبطال الرموز غير الصالحة.
- PWA: Manifest وService Worker وOffline page وزر تثبيت وتعامل مع فتح التعميم من الإشعار.
- وضع ليلي/نهاري، تصميم هاتف أولًا، RTL، حالات فارغة، رسائل نجاح/خطأ ونوافذ تأكيد.
- مخطط SQL كامل، فهارس، Storage buckets، سياسات RLS وسجل عمليات.
- واجهة ثنائية اللغة مع RTL/LTR وحفظ اللغة المفضلة، وبنية ترجمة مستقلة.
- Employee Schedule بعرض أسبوعي/شهري وبطاقات هاتف، مع Service وAdapter مستقلين للـAPI.
- Employee Profile موسّع يفرق بين Role وJob Title وAssigned Duties وPermissions.
- Performance & Analytics برسوم اتجاهات ومؤشرات موزونة، وEmployee Reviews مع خطة تحسين.
- إدارة Complaints & Warnings بسجلات خاصة وأرشفة وسياسات RLS دقيقة.
- مركز جودة وأداء موحّد يستورد صيغة QA، يعرض المتوسط الشهري والترتيب والمعايير والملاحظات.
- Office Brain كقاعدة معرفة مشتركة، وAI Agent Assist بإجابات موثقة، وHAAT Simulator بتقييم تدريبي محفوظ.
- تعميمات على شكل بطاقات قابلة للسحب، مع فتح التفاصيل من كل بطاقة.

> عند عدم إضافة مفاتيح البيئة يعمل المشروع تلقائيًا بوضع عرض تجريبي. بعد إضافة Supabase تُقرأ البيانات من القاعدة عبر hooks ولا تكون بيانات العرض هي مصدر الحقيقة.

## التشغيل محليًا

يتطلب Node.js 22 أو أحدث.

```bash
npm install
cp .env.example .env.local
npm run dev
```

ثم افتح `http://localhost:3000`.

## إعداد Supabase

1. أنشئ مشروعًا جديدًا في Supabase.
2. افتح SQL Editor ونفّذ `supabase/migrations/202607230001_initial.sql`.
3. انسخ Project URL وAnon key وService role key إلى `.env.local`.
4. في Authentication > URL Configuration أضف عنوان الموقع المحلي وعنوان Vercel إلى Redirect URLs.
5. أنشئ البيانات والحسابات التجريبية:

```bash
npm run seed:demo
```

المرفقات تحفظ في bucket خاص باسم `announcement-attachments` والصور الشخصية في `avatars`. ينشئ ملف SQL كليهما مع سياسات الوصول.

## إعداد Firebase Cloud Messaging

1. أنشئ مشروع Firebase ثم Web App.
2. فعّل Cloud Messaging وأنشئ Web Push certificate (VAPID key).
3. أضف قيم Web App إلى متغيرات `NEXT_PUBLIC_FIREBASE_*`.
4. من Project settings > Service accounts أنشئ مفتاحًا خاصًا، وضع JSON كاملًا كسطر واحد في `FIREBASE_SERVICE_ACCOUNT_JSON`.
5. من إعدادات المتصفح اضغط تفعيل إشعارات الجوال. يحفظ النظام token مستقل لكل جهاز.

نقطة الإرسال `/api/push/send` تتحقق من أن المستخدم مشرف/مدير/مسؤول، تنشئ إشعارات داخلية، ترسل FCM، وتسجل نتيجة كل جهاز. إعادة الإرسال تستخدم `onlyUnread: true`.

## ربط أنظمة الموظفين الخارجية

ضع روابط الخدمات في `.env.local` باستخدام المتغيرات `NEXT_PUBLIC_EMPLOYEE_SCHEDULE_API_URL` و`NEXT_PUBLIC_EMPLOYEE_PERFORMANCE_API_URL` و`NEXT_PUBLIC_EMPLOYEE_REVIEWS_API_URL` و`NEXT_PUBLIC_ATTENDANCE_API_URL` و`NEXT_PUBLIC_COUPON_ERRORS_API_URL`. عند الحاجة إلى Token خادومي ضعه في `EMPLOYEE_API_AUTH_TOKEN` ولا تستخدم له بادئة `NEXT_PUBLIC_`.

طبقة الربط موجودة في `lib/services/employee-services.ts`. كل خدمة تمر عبر Adapter مستقل، لذلك يمكن تعديل شكل الاستجابة المستقبلية دون تغيير مكونات الواجهة. عندما تكون الروابط فارغة تستخدم الصفحات بيانات Mock من `lib/employee-data.ts` تلقائيًا. الخدمات تتضمن معالجة الخطأ وRetry وCaching لمدة خمس دقائق.

## بريد الشركة والتحقق

عدّل `ALLOWED_EMAIL_DOMAINS` و`NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS` بالنطاقات الرسمية مفصولة بفاصلة. تسجيل الدخول العام غير متاح؛ مسؤول النظام ينشئ الحسابات مسبقًا. مخطط التحقق بالبريد/SMS والأجهزة الموثوقة ومحاولات الدخول موجود في `supabase/migrations/202608030001_employee_suite.sql`، ويحتاج تفعيل مزود البريد أو SMS في Supabase قبل الاستخدام الفعلي.

## الجدولة

ضع قيمة قوية لـ`CRON_SECRET`. يتضمن `vercel.json` مهمة دقيقة تستدعي `/api/cron/publish-scheduled`. في خطة Vercel التي لا تسمح بتشغيل كل دقيقة، غيّر الجدول إلى cadence مدعوم أو استخدم Supabase Cron.

## النشر على Vercel

1. ارفع المشروع إلى GitHub واربطه بـVercel.
2. أضف جميع متغيرات `.env.example` في Project Settings > Environment Variables.
3. Build Command مضبوط في `vercel.json` على `npm run build:vercel`.
4. انشر، ثم أضف رابط الإنتاج إلى Supabase Auth Redirect URLs.

## الحسابات التجريبية

بعد تشغيل `npm run seed:demo` يُنشأ الحساب الأول بكلمة مرور مؤقتة `123456789`، ويمكن تغييرها من الملف الشخصي.

| الحساب | البريد | الرقم الوظيفي | الدور |
|---|---|---:|---|
| مسؤول النظام الأول | asem.msameh@team.haat.delivery | 1001 | مسؤول نظام |

## ملاحظات أمنية

- لا تضع `SUPABASE_SERVICE_ROLE_KEY` أو Firebase Service Account في متغير يبدأ بـ`NEXT_PUBLIC_`.
- RLS يمنع الموظف من رؤية أي تعميم غير موجّه إليه أو إلى قسمه أو إلى الجميع.
- إنشاء المستخدمين واستيراد ملفات Excel/CSV يجب أن يتم من مسار خادوم يستخدم Service Role، وليس من المتصفح مباشرة.
- واجهة العرض التجريبي ليست بديلًا عن إنشاء مفاتيح Supabase/Firebase قبل الاستخدام الفعلي.
