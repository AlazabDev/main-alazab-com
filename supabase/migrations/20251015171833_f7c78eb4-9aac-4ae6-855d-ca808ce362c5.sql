-- إضافة عمود magicplan_iframe_url إذا لم يكن موجوداً
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS magicplan_iframe_url text;

-- تحديث جميع المشاريع بإضافة رابط العارض الثلاثي الأبعاد المؤقت
UPDATE public.projects
SET magicplan_iframe_url = 'https://3d.magicplan.app/#embed/?key=YjlmNmE4Mjg2MzA4MTM0NWE0NGZjYjFmMWIzZjNlMTJkYjNiZjIzMWM1NGI2NWFjYTJhYjk4Mzg0ODhjMjgyMsOrJx7UqLcFg7NpyxsLvKyFduUi3Jh3NczXBNX%2BANVEOSiVrpdZCFvvNiXzb973dImx8%2Br%2BsP3jqy0pjFH381TsMhrk8xNhGL5ml8Ilzbeu'
WHERE magicplan_iframe_url IS NULL OR magicplan_iframe_url = '';