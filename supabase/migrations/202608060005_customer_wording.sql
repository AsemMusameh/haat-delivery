-- Standardize the public Arabic wording from "العميل" to "الزبون".
update public.compensation_rules
set notes = replace(replace(notes, 'العملاء', 'الزبائن'), 'العميل', 'الزبون')
where notes like '%العميل%' or notes like '%العملاء%';
