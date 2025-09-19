
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { GoogleMap } from "@/components/maps/GoogleMap";

export default function Map() {
  return (
    <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">الخريطة</h1>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  مواقع العقارات والطلبات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GoogleMap 
                  height="600px"
                  markers={[
                    // يمكن إضافة markers هنا لعرض مواقع العقارات والطلبات
                  ]}
                />
              </CardContent>
            </Card>
    </div>
  );
}