// إعدادات الإنتاج للتطبيق
export const PRODUCTION_CONFIG = {
  // إعدادات الأمان
  security: {
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 60 * 60 * 24 * 7, // أسبوع
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 دقيقة
  },

  // إعدادات الأداء
  performance: {
    pageSize: 20,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    cacheTimeout: 5 * 60 * 1000, // 5 دقائق
    debounceDelay: 300,
  },

  // إعدادات التطبيق
  app: {
    name: 'Azab Property Management',
    version: '1.0.0',
    supportEmail: 'support@azab.com',
    maxNotifications: 50,
    defaultLanguage: 'ar',
  },

  // إعدادات API
  api: {
    timeout: 30000, // 30 ثانية
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // إعدادات الصور والملفات
  files: {
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'text/plain'],
    maxImageSize: 2 * 1024 * 1024, // 2MB
    maxDocSize: 10 * 1024 * 1024, // 10MB
  },

  // إعدادات الإشعارات
  notifications: {
    enablePush: true,
    enableEmail: true,
    enableSms: false,
    batchSize: 100,
  },

  // إعدادات الخريطة
  maps: {
    defaultZoom: 15,
    maxZoom: 20,
    minZoom: 10,
    defaultCenter: { lat: 24.7136, lng: 46.6753 }, // الرياض
  },

  // إعدادات العملة
  currency: {
    default: 'SAR',
    symbol: 'ر.س',
    precision: 2,
  },

  // إعدادات التاريخ والوقت
  datetime: {
    timezone: 'Asia/Riyadh',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    locale: 'ar-SA',
  },
} as const;

// دالة للتحقق من إعدادات البيئة
export const validateEnvironment = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  const missing: string[] = [];
  
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY');
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  // تحذير إذا كانت المفاتيح تبدو غير صحيحة
  if (!supabaseUrl.includes('supabase.co')) {
    console.warn('VITE_SUPABASE_URL may be invalid');
  }
  
  if (!supabaseKey.startsWith('eyJ')) {
    console.warn('VITE_SUPABASE_PUBLISHABLE_KEY may be invalid');
  }

  return true;
};

// دالة لتطبيق إعدادات الأمان
export const applySecuritySettings = () => {
  // منع النقر بالزر الأيمن في الإنتاج
  if (window.location.hostname !== 'localhost') {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // إخفاء أدوات المطور في الإنتاج
  if (import.meta.env.PROD) {
    const devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.warn('Developer tools detected!');
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }
};

// دالة لتحسين الأداء
export const applyPerformanceSettings = () => {
  // تحسين الصور بالتحميل التدريجي
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // مراقبة جميع الصور مع data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // تحسين التمرير
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // منطق معالجة التمرير هنا
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};