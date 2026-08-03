# HAAT Employee Hub — ملف تسليم المشروع

هذا الملف مخصص لإرفاق المشروع في دردشة أخرى أو تسليمه لمطور آخر.

## وصف سريع

نظام داخلي لشركة HAAT لإدارة التعميمات ومتابعة القراءة، جداول الموظفين، الأداء، المراجعات، الشكاوى والإنذارات. الواجهة تدعم العربية RTL والإنجليزية LTR، وتستخدم شعار HAAT الرسمي الموجود في `public/haat-logo.png`.

## التقنية

- Next.js + TypeScript + Tailwind CSS.
- Supabase للمصادقة وقاعدة البيانات والتخزين مع Row Level Security.
- Firebase Cloud Messaging لإشعارات Push.
- PWA مع Manifest وService Worker وصفحة Offline.
- جاهز للنشر على Vercel، ومهيأ كذلك لتشغيل Vinext/Sites.

## أهم الصفحات

- `/login` تسجيل الدخول.
- `/dashboard` لوحة الموظف.
- `/announcements` التعميمات وتأكيد القراءة والمرفقات.
- `/schedule` جدول الموظف Weekly/Monthly.
- `/performance` الأداء والإحصائيات.
- `/reviews` مراجعات الموظف وخطة التحسين.
- `/profile` ملف الموظف والمهام والصلاحيات.
- `/admin` لوحة الإدارة.
- `/admin/reports` تقارير القراءة.
- `/admin/employees` إدارة الموظفين والاستيراد.
- `/admin/records` الشكاوى والإنذارات.
- `/admin/settings` الأقسام وسجل العمليات.

## اللغات

الترجمات الأساسية في `lib/i18n.ts`. تدير `components/locale-provider.tsx` تغيير اللغة، اتجاه الصفحة، حفظ اختيار المستخدم، وترجمة النصوص في الصفحات القديمة والجديدة. زر اللغة موجود في صفحة الدخول وداخل النظام.

## قاعدة البيانات

شغّل بالترتيب:

1. `supabase/migrations/202607230001_initial.sql`
2. `supabase/migrations/202608030001_employee_suite.sql`
3. `supabase/seed.sql` للبيانات التجريبية.

## التشغيل

```bash
npm install
cp .env.example .env.local
npm run dev
```

الحسابات التجريبية وكلمة المرور ومتغيرات البيئة موضحة بالكامل في `README.md` و`.env.example`.

## قبل الإنتاج

- أضف مفاتيح Supabase وFirebase الحقيقية.
- غيّر نطاق البريد في `ALLOWED_EMAIL_DOMAINS` و`NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS`.
- فعّل Google Workspace أو البريد وكلمة المرور في Supabase.
- أضف مزود SMS للتحقق من الهاتف عند الحاجة.
- اربط روابط APIs الخاصة بالجدول والأداء والمراجعات والحضور وأخطاء Coupons.
- لا ترفع `.env.local` أو مفاتيح الخدمة إلى Git.

