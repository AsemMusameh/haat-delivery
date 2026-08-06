-- Align the wrong side-item policy with the approved policy sheet.
update public.compensation_rules
set compensation_min = 'remake',
    compensation_max = 'remake',
    required_from_customer = 'photo',
    profile_condition = 'na',
    notes = 'يلزم إرفاق صورة. راجع ملف العميل إذا كان لديه 5 طلبات أو أكثر.'
where id = 'wrong-side-1';

update public.compensation_rules
set compensation_min = 'item',
    compensation_max = 'item',
    required_from_customer = 'photo',
    profile_condition = 'na',
    notes = 'يلزم إرفاق صورة. قيمة القسيمة بين 10 و300 شيكل.'
where id in ('wrong-side-2', 'wrong-side-3');
