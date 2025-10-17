-- إضافة أعمدة للروابط الجديدة
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS gallery_url TEXT,
ADD COLUMN IF NOT EXISTS sketch_url TEXT;

-- إضافة المشاريع الأربعة الفعلية بحالات صحيحة
INSERT INTO projects (
  name, 
  client_name, 
  location, 
  status, 
  progress, 
  magicplan_iframe_url,
  gallery_url,
  sketch_url,
  description,
  start_date,
  budget
) VALUES 
(
  'مشروع أبو عوف طنطا 3',
  'أبو عوف',
  'طنطا، محافظة الغربية',
  'completed',
  100,
  'https://3d.magicplan.app/#embed/?key=MjJkOGJkODY5MWU3NGNhNDE2N2Y4NGJiODkwNzFmMWE0YjRlZTgzM2U0ZjEzOWQ5NzRmNDMyMzk1NmMyNzE3Y7vUOqY0Sne1Rr7LQHXXzP2FrrNbrm6R0iqEu3Vij6QbLBqs698F%2Fr2856diXZD4GA%3D%3D',
  'https://cloud.magicplan.app/estimator/photo-export/2220cf8e-437c-4dca-8586-da6b3b51396f',
  'https://cloud.magicplan.app/plan/e29d9b8f-8d7e-443f-a850-e7c4b507837d/sketch/2d/687f8bfd.345a9fff',
  'مشروع تصميم وتنفيذ فرع أبو عوف بمدينة طنطا - فرع رقم 3',
  '2023-01-15',
  2500000
),
(
  'مشروع أبو عوف الإسكندرية - لوران',
  'أبو عوف',
  'الإسكندرية - منطقة لوران',
  'completed',
  100,
  'https://3d.magicplan.app/#embed/?key=Y2IyYjgzYzYxNjZlZjUwMWQ4YjYwNGQ4MmMzOWQ4ODMzOGFkNzc2MDgwOWMzNzA2N2FkNGIxNjRlOWM5OGY4Yjp3jq3OBnsW%2Buvbuu4j0vL35xMYHBD2TSImZ%2BSXLA0k7%2BB%2F4Q9YawR3EJjeJv%2F5l7wJ92KQlb7CvvdS9sr8FgKPsUG8lIxd7OYhWmr%2FiZ6%2F',
  'https://cloud.magicplan.app/estimator/photo-export/b7652002-08e3-41d5-8e5c-710060e66201',
  'https://cloud.magicplan.app/plan/e29d9b8f-8d7e-443f-a850-e7c4b507837d/sketch/2d/687f8bfd.345a9fff',
  'تصميم وتنفيذ فرع أبو عوف بمنطقة لوران بالإسكندرية',
  '2023-03-20',
  3200000
),
(
  'مشروع المنصورة الجديدة - المشاوة',
  'العميل الخاص',
  'المنصورة الجديدة - منطقة المشاوة',
  'in_progress',
  75,
  'https://3d.magicplan.app/#embed/?key=MGI5Nzg3ZWE0MTIzMmY2M2M2OTlmMWIwNTU3OWY1MDhhOWYwYzRhMzAwMDYwNzI1YmQwMzc1YmFkMGFlMDhlZbPKEiO6OpnJ%2F7dDPIgzmYjYuNy5xjHrbIsqF0sTi5sem9cj9%2BPdvDf%2BFratYhYT2dtzNjKPAXqRZxp5BTrBvDkVUmd%2BAp5D5ykmRbjj0m5h',
  'https://cloud.magicplan.app/estimator/photo-export/07e01944-8b1a-4749-9f62-43093be35bc0',
  'https://cloud.magicplan.app/plan/717c0eea-6ddc-4ea6-bec6-27158c2c0137',
  'مشروع سكني بالمنصورة الجديدة في منطقة المشاوة',
  '2024-01-10',
  4500000
),
(
  'مشروع أبو عوف بنها',
  'أبو عوف',
  'بنها، محافظة القليوبية',
  'completed',
  100,
  'https://3d.magicplan.app/#embed/?key=YTc2OGUwY2IxODYwMWRmMjUzNWI0YjcyMzdmNDk0YjFlMjczZjAxODkwZDYyNTRmM2U4NmE3OGQ5MzM4MzYzObR0rv%2BTdV8Lcs4kPHejYxFHU0kzryDz2wgyu1jnmZ201WnDkZusQrJPn4KM6K1Qa2TkNZ1RHrpfFwBMfJXa2GjoAbP4Rd1r5Yn5LJw3xWKU',
  'https://cloud.magicplan.app/estimator/photo-export/d1237b3e-0d80-4113-8396-473cc3f550b8',
  'https://cloud.magicplan.app/plan/fb891225-8359-47aa-b544-68ab8040f964',
  'تصميم وتنفيذ فرع أبو عوف في مدينة بنها',
  '2023-06-01',
  2800000
);

-- إضافة تعليقات على الأعمدة
COMMENT ON COLUMN projects.gallery_url IS 'رابط معرض صور المشروع من MagicPlan';
COMMENT ON COLUMN projects.sketch_url IS 'رابط المخطط ثنائي الأبعاد من MagicPlan';