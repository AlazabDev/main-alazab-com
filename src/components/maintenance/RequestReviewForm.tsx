import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { RequestReview } from "@/hooks/useRequestLifecycle";

interface RequestReviewFormProps {
  requestId: string;
  onSubmit: (review: Partial<RequestReview>) => Promise<RequestReview>;
}

export function RequestReviewForm({ requestId, onSubmit }: RequestReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    overall_rating: 0,
    service_quality: 0,
    timeliness: 0,
    professionalism: 0,
    feedback_text: '',
    would_recommend: undefined as boolean | undefined
  });

  const handleStarClick = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };

  const renderStarRating = (field: string, label: string, value: number) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(field, star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= value 
                  ? 'text-warning fill-warning' 
                  : 'text-muted-foreground hover:text-warning/50'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        request_id: requestId,
        reviewer_type: 'customer',
        ...formData
      });

      // Reset form
      setFormData({
        overall_rating: 0,
        service_quality: 0,
        timeliness: 0,
        professionalism: 0,
        feedback_text: '',
        would_recommend: undefined
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Overall Rating */}
          {renderStarRating('overall_rating', 'التقييم العام', formData.overall_rating)}

          {/* Detailed Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderStarRating('service_quality', 'جودة الخدمة', formData.service_quality)}
            {renderStarRating('timeliness', 'الالتزام بالوقت', formData.timeliness)}
            {renderStarRating('professionalism', 'المهنية', formData.professionalism)}
          </div>

          {/* Written Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback_text">التعليق (اختياري)</Label>
            <Textarea
              id="feedback_text"
              value={formData.feedback_text}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback_text: e.target.value }))}
              placeholder="شاركنا تجربتك وملاحظاتك حول الخدمة"
              rows={4}
            />
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <Label>هل توصي بخدماتنا؟</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, would_recommend: true }))}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  formData.would_recommend === true
                    ? 'bg-success text-success-foreground border-success'
                    : 'border-border hover:bg-muted'
                }`}
              >
                نعم، أوصي
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, would_recommend: false }))}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  formData.would_recommend === false
                    ? 'bg-destructive text-destructive-foreground border-destructive'
                    : 'border-border hover:bg-muted'
                }`}
              >
                لا، لا أوصي
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isSubmitting || formData.overall_rating === 0}
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </Button>
      </div>
    </form>
  );
}