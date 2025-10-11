import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const FOLDERS = [
  { key: "commercial", label: "تجاري" },
  { key: "construction", label: "إنشائي" },
  { key: "cuate", label: "كوّات" },
  { key: "live_edge", label: "خشب طبيعي" },
  { key: "maintenance", label: "صيانة" },
  { key: "residential", label: "سكني" },
  { key: "shops", label: "محلات" },
];

const Gallery: React.FC = () => {
  const [selected, setSelected] = useState("commercial");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fetchImages = async (folder: string) => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("az_gallery")
      .list(`images/${folder}`, { limit: 100 });

    if (error) {
      console.error(error);
      setImages([]);
      setLoading(false);
      return;
    }

    const urls =
      data?.map(
        (file) =>
          `https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/az_gallery/images/${folder}/${file.name}`
      ) || [];

    setImages(urls);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages(selected);
  }, [selected]);

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white text-center">
      <h3 className="text-orange-500 font-semibold text-sm">📸 معرض أعمالنا</h3>
      <h2 className="text-3xl font-bold mb-2 text-gray-900">شاهد إنجازاتنا</h2>
      <p className="text-gray-500 mb-6">
        مجموعة مختارة من أفضل أعمالنا ومشاريعنا المنجزة بنجاح.
      </p>

      {/* الفلاتر */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {FOLDERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setSelected(f.key)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
              selected === f.key
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* الصور */}
      {loading ? (
        <p className="text-gray-500">جارٍ تحميل الصور...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={selected}
              onClick={() => setLightbox(url)}
              className="rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
