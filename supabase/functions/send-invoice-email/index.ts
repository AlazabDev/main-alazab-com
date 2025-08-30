import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  invoice: {
    id: string;
    invoice_number: string;
    customer_name: string;
    amount: number;
    currency: string;
    due_date?: string;
    issue_date: string;
    payment_method?: string;
    notes?: string;
    items: Array<{
      service_name: string;
      description?: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
    total_amount: number;
  };
  customer_email: string;
}

const generateInvoiceHTML = (invoice: InvoiceEmailRequest['invoice']) => {
  const itemsHTML = invoice.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.service_name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.unit_price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${item.total_price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة ${invoice.invoice_number}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          direction: rtl;
          background-color: #f8fafc;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
        }
        .invoice-title {
          color: #1e40af;
          font-size: 28px;
          margin: 0;
        }
        .invoice-number {
          color: #6b7280;
          font-size: 18px;
          margin: 5px 0;
        }
        .customer-info {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          color: #374151;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        th {
          background: #3b82f6;
          color: white;
          padding: 15px 12px;
          text-align: right;
          font-weight: bold;
        }
        .total-section {
          background: #eff6ff;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
          border-left: 4px solid #3b82f6;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
        }
        .payment-info {
          background: #fef3c7;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
          border-left: 4px solid #f59e0b;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="invoice-title">فاتورة</h1>
          <div class="invoice-number">رقم الفاتورة: ${invoice.invoice_number}</div>
          <div>تاريخ الإصدار: ${new Date(invoice.issue_date).toLocaleDateString('ar-EG')}</div>
        </div>

        <div class="customer-info">
          <h3 style="margin-top: 0; color: #1e40af;">معلومات العميل</h3>
          <div class="info-grid">
            <div>
              <div class="info-item">
                <span class="label">اسم العميل:</span> ${invoice.customer_name}
              </div>
              ${invoice.due_date ? `
              <div class="info-item">
                <span class="label">تاريخ الاستحقاق:</span> ${new Date(invoice.due_date).toLocaleDateString('ar-EG')}
              </div>
              ` : ''}
            </div>
            <div>
              ${invoice.payment_method ? `
              <div class="info-item">
                <span class="label">طريقة الدفع:</span> ${invoice.payment_method === 'bank_transfer' ? 'تحويل بنكي' : 
                  invoice.payment_method === 'instapay' ? 'انستاباي' : 
                  invoice.payment_method === 'cash' ? 'نقداً' : 
                  invoice.payment_method === 'check' ? 'شيك' : invoice.payment_method}
              </div>
              ` : ''}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>الخدمة</th>
              <th style="text-align: center;">الكمية</th>
              <th style="text-align: right;">السعر</th>
              <th style="text-align: right;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-amount">
            الإجمالي: ${invoice.total_amount.toFixed(2)} ${invoice.currency}
          </div>
        </div>

        ${invoice.payment_method ? `
        <div class="payment-info">
          <h4 style="margin-top: 0; color: #92400e;">معلومات الدفع</h4>
          <p>برجاء الدفع عن طريق ${invoice.payment_method === 'bank_transfer' ? 'التحويل البنكي' : 
            invoice.payment_method === 'instapay' ? 'انستاباي' : 
            invoice.payment_method === 'cash' ? 'النقد' : 
            invoice.payment_method === 'check' ? 'الشيك' : invoice.payment_method}</p>
          ${invoice.due_date ? `<p><strong>موعد الاستحقاق:</strong> ${new Date(invoice.due_date).toLocaleDateString('ar-EG')}</p>` : ''}
        </div>
        ` : ''}

        ${invoice.notes ? `
        <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <h4 style="margin-top: 0; color: #374151;">ملاحظات</h4>
          <p style="margin-bottom: 0;">${invoice.notes}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>شكراً لك على تعاملك معنا</p>
          <p style="font-size: 14px;">هذه فاتورة مُنشأة إلكترونياً</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoice, customer_email }: InvoiceEmailRequest = await req.json();

    console.log(`Sending invoice ${invoice.invoice_number} to ${customer_email}`);

    const emailResponse = await resend.emails.send({
      from: "نظام الفواتير <onboarding@resend.dev>",
      to: [customer_email],
      subject: `فاتورة ${invoice.invoice_number} - ${invoice.customer_name}`,
      html: generateInvoiceHTML(invoice),
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invoice-email function:", error);
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