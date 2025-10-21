import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  approverEmail: string;
  approverName: string;
  requestId: string;
  requestTitle: string;
  requestDescription: string;
  requestPriority: string;
  requestCategory: string;
  approvalToken: string;
  stepOrder: number;
  totalSteps: number;
  expiresAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      approverEmail,
      approverName,
      requestId,
      requestTitle,
      requestDescription,
      requestPriority,
      requestCategory,
      approvalToken,
      stepOrder,
      totalSteps,
      expiresAt
    }: ApprovalEmailRequest = await req.json();

    const baseUrl = Deno.env.get("SUPABASE_URL")?.replace("/v1", "") || "";
    const approveUrl = `${baseUrl}/functions/v1/process-approval?token=${approvalToken}&action=approve`;
    const rejectUrl = `${baseUrl}/functions/v1/process-approval?token=${approvalToken}&action=reject`;
    const viewUrl = `${baseUrl}/requests/${requestId}`;

    const priorityEmoji = {
      'high': '🔴',
      'medium': '🟡',
      'low': '🟢',
      'urgent': '🔴⚡'
    }[requestPriority] || '⚪';

    const emailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #f5bf23 0%, #e5a513 100%);
            color: #111;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
          }
          .info-box {
            background-color: #f9f9f9;
            border-right: 4px solid #f5bf23;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: bold;
            color: #666;
          }
          .info-value {
            color: #111;
          }
          .description {
            background-color: #fff9e6;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            line-height: 1.6;
          }
          .buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s;
          }
          .approve {
            background-color: #10b981;
            color: white;
          }
          .approve:hover {
            background-color: #059669;
            transform: translateY(-2px);
          }
          .reject {
            background-color: #ef4444;
            color: white;
          }
          .reject:hover {
            background-color: #dc2626;
            transform: translateY(-2px);
          }
          .view-link {
            text-align: center;
            margin: 20px 0;
          }
          .view-link a {
            color: #f5bf23;
            text-decoration: none;
            font-weight: bold;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
          }
          .progress-bar {
            background-color: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            margin: 20px 0;
            overflow: hidden;
          }
          .progress-fill {
            background: linear-gradient(90deg, #f5bf23 0%, #e5a513 100%);
            height: 100%;
            transition: width 0.3s;
          }
          .warning {
            background-color: #fef3c7;
            border-right: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 6px;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 طلب صيانة يحتاج موافقتك</h1>
          </div>
          
          <div class="content">
            <p class="greeting">مرحباً ${approverName}،</p>
            
            <p>تم إرسال طلب صيانة جديد يحتاج موافقتك كجزء من سير الموافقات.</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">رقم الطلب:</span>
                <span class="info-value">${requestId.substring(0, 8)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">العنوان:</span>
                <span class="info-value">${requestTitle}</span>
              </div>
              <div class="info-row">
                <span class="info-label">التصنيف:</span>
                <span class="info-value">${requestCategory || 'غير محدد'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">الأولوية:</span>
                <span class="info-value">${priorityEmoji} ${requestPriority}</span>
              </div>
              <div class="info-row">
                <span class="info-label">خطوة الموافقة:</span>
                <span class="info-value">${stepOrder} من ${totalSteps}</span>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(stepOrder / totalSteps) * 100}%"></div>
            </div>
            
            <div class="description">
              <strong>وصف المشكلة:</strong><br>
              ${requestDescription || 'لا يوجد وصف'}
            </div>
            
            <div class="warning">
              ⏰ <strong>تنبيه:</strong> هذا الرابط صالح حتى ${new Date(expiresAt).toLocaleString('ar-EG', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}
            </div>

            <div class="buttons">
              <a href="${approveUrl}" class="button approve">
                ✅ موافقة
              </a>
              <a href="${rejectUrl}" class="button reject">
                ❌ رفض
              </a>
            </div>

            <div class="view-link">
              <a href="${viewUrl}">👁️ عرض تفاصيل الطلب كاملة</a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              💡 <strong>ملاحظة:</strong> عند الضغط على أحد الأزرار، سيتم تسجيل قرارك تلقائياً مع التوقيت وعنوان IP.
            </p>
          </div>
          
          <div class="footer">
            <p>هذا بريد إلكتروني تلقائي من نظام إدارة الصيانة</p>
            <p>للاستفسارات، يرجى التواصل مع قسم الدعم الفني</p>
            <p style="margin-top: 10px; color: #999;">
              © ${new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "نظام الصيانة <onboarding@resend.dev>",
      to: [approverEmail],
      subject: `🔔 طلب موافقة صيانة - ${requestTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending approval email:", error);
      throw error;
    }

    console.log("Approval email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
