import { GoogleMap } from "@/components/maps/GoogleMap";
import { Input } from "@/components/ui/input";
import { Search, Phone, Globe } from "lucide-react";
import { useState } from "react";

export default function Map() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1f2e] to-[#0f1419] text-white">
      {/* Header Section */}
      <div className="bg-[#1a1f2e] border-b border-[#2a3441] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 bg-gradient-to-r from-[#d4af37] to-[#f4d03f] bg-clip-text text-transparent">
            خريطة فروع شركة العزب
          </h1>
          <p className="text-center text-gray-300 text-sm md:text-base">
            ابحث عن موقع أي فرع أو عمار بالتاريخ Azab Construction
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن فرع أو عمار بالتاريخ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <GoogleMap 
            height="calc(100vh - 400px)"
            latitude={30.0444}
            longitude={31.2357}
            zoom={12}
            interactive={true}
            markers={[
              {
                id: '1',
                lat: 30.0444,
                lng: 31.2357,
                title: 'B/500 Maadi New, Cairo, Egypt',
                type: 'vendor'
              },
              {
                id: '2',
                lat: 31.0409,
                lng: 31.3785,
                title: '38 Elmahta Street, Nabaroh, Daqahlia',
                type: 'vendor'
              }
            ]}
          />
        </div>
      </div>

      {/* Footer Info Section */}
      <div className="bg-[#0f1419] border-t border-[#2a3441] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-6 text-[#d4af37]">
              Alazab Construction
            </h2>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-gray-300">
                <p className="font-medium mb-1">B/500 Maadi New, Cairo, Egypt</p>
                <p className="text-sm">38 Elmahta Street, Nabaroh, Daqahlia</p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-[#d4af37]">
                <Phone className="h-5 w-5" />
                <a href="tel:+201004006620" className="hover:underline transition-all">
                  (+20) 1004006620
                </a>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-[#d4af37]">
                <Globe className="h-5 w-5" />
                <a 
                  href="https://alazab.services" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline transition-all"
                >
                  alazab.services
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-[#2a3441]">
            <p className="text-gray-400 text-sm">
              © 2025 Alazab Construction Company | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}