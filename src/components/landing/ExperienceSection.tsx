import { useEffect, useRef } from 'react';

export const ExperienceSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const teamImages = [
    '/img/team001.jpg',
    '/img/team002.jpg',
    '/img/team003.jpg',
    '/img/team004.jpg',
    '/img/team005.jpg',
    '/img/team006.jpg',
    '/img/team007.jpg',
    '/img/team008.jpg',
  ];

  // تكرار الصور للحصول على تأثير لا نهائي
  const doubledImages = [...teamImages, ...teamImages, ...teamImages];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // إعادة تعيين الموضع عند الوصول لنهاية المجموعة الأولى
      if (scrollPosition >= scrollContainer.scrollWidth / 3) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">اختبر اللحظة</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground">
            اغمر نفسك في أحدث الاتجاهات وما وراء الكواليس
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-12">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden"
            style={{ scrollBehavior: 'auto' }}
          >
            {doubledImages.map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40"
              >
                <div className="relative w-full h-full rounded-full border-4 border-dashed border-primary/30 p-1 hover:scale-110 transition-transform duration-300">
                  <img
                    src={image}
                    alt={`فريق العمل ${(index % teamImages.length) + 1}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
