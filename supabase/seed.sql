insert into public.departments(name,description,color) values
('Management','Management accounts','#b40d31'),
('Quality Assurance','Quality assurance team','#16a34a'),
('Shift Managers - Chat','Chat shift supervisors','#7c3aed'),
('Shift Managers - Voice','Voice shift supervisors','#e11d48'),
('Chat','Customer chat team','#2563eb'),
('Voice Center','Voice center team','#db2777'),
('Customer Service - WB','West Bank customer service','#dc2626'),
('Connect Teams Updates','Connect teams updates','#0f6fb5')
on conflict(name) do nothing;
-- حسابات Auth التجريبية تُنشأ بواسطة: npm run seed:demo
