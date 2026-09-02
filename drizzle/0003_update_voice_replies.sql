UPDATE `reply_templates` SET
  `title` = 'افتتاح المكالمة',
  `body_ar` = 'مرحبًا، معك {اسم الموظف}، كيف بقدر أساعدك؟',
  `body_he` = 'שלום, מדבר/ת {שם הנציג}. איך אפשר לעזור לך?',
  `body_en` = 'Hello, this is {agent name}. How can I help you?',
  `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 'voice-opening';
--> statement-breakpoint
DELETE FROM `reply_templates` WHERE `id` = 'voice-verification';
--> statement-breakpoint
UPDATE `reply_templates` SET
  `title` = 'تأخير الطلب',
  `body_ar` = 'بعتذر منك على التأخير الحاصل بطلبيتك. رح أفحص مع المرسل بخصوص التأخير، لحظات من فضلك.',
  `body_he` = 'אני מתנצל/ת על העיכוב בהזמנה שלך. אבדוק מול השליח את סיבת העיכוב, רק רגע בבקשה.',
  `body_en` = 'I apologize for the delay with your order. I’ll check with the driver regarding the delay; one moment, please.',
  `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 'voice-delay';
--> statement-breakpoint
UPDATE `reply_templates` SET
  `title` = 'التعويض',
  `body_ar` = 'الخلل ظاهر عندنا، وكاعتذار من طرفنا عن الخلل اللي صار، حابين نعوضك بكوبون بقيمة {قيمة التعويض}، كتعويض إلك عن الخطأ. ومنتشرف بخدمتكم دائمًا.',
  `body_he` = 'התקלה מופיעה אצלנו, וכהתנצלות על מה שקרה נשמח לפצות אותך בקופון בשווי {סכום הפיצוי}. אנחנו תמיד שמחים לעמוד לשירותך.',
  `body_en` = 'The issue is visible on our side. As an apology for what happened, we would like to compensate you with a coupon worth {compensation value}. It is always our pleasure to serve you.',
  `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 'voice-compensation';
--> statement-breakpoint
UPDATE `reply_templates` SET
  `title` = 'مشكلة تقنية على التطبيق',
  `body_ar` = 'شكرًا لصبرك وتعاونك. حابين نوضح إنه حاليًا في مشكلة تقنية على التطبيق، والقسم المختص شغال على حل المشكلة. ولا يهمك، وشكرًا لتفهمك، ومنتشرف بخدمتك بكل الأوقات 😍',
  `body_he` = 'תודה על הסבלנות ועל שיתוף הפעולה. חשוב לנו לעדכן שקיימת כרגע תקלה טכנית באפליקציה, והצוות המתאים עובד על פתרונה. תודה על ההבנה, ואנחנו תמיד שמחים לעמוד לשירותך 😍',
  `body_en` = 'Thank you for your patience and cooperation. We would like to clarify that there is currently a technical issue with the app, and the responsible team is working to resolve it. Thank you for your understanding; it is always our pleasure to serve you 😍',
  `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 'voice-escalation';
--> statement-breakpoint
UPDATE `reply_templates` SET
  `title` = 'النهاية (1)',
  `body_ar` = 'أي مساعدة ثانية أو أي خدمة ثانية بتحب أساعدك فيها؟',
  `body_he` = 'האם יש עזרה נוספת או שירות נוסף שאוכל לעזור לך בו?',
  `body_en` = 'Is there anything else I can help you with?',
  `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 'voice-closing';
