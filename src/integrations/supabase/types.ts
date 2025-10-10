export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          created_by: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          description: string | null
          duration_minutes: number
          id: string
          location: string | null
          maintenance_request_id: string | null
          notes: string | null
          property_id: string | null
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean
          status?: string
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          created_by?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean
          status?: string
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments_summary: {
        Row: {
          appointment_count: number
          created_at: string | null
          id: string
          month: string
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_count?: number
          created_at?: string | null
          id?: string
          month: string
          status: string
          updated_at?: string | null
        }
        Update: {
          appointment_count?: number
          created_at?: string | null
          id?: string
          month?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      appointments_summary_secure: {
        Row: {
          appointment_count: number
          created_at: string | null
          id: string
          month: string
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_count?: number
          created_at?: string | null
          id?: string
          month: string
          status: string
          updated_at?: string | null
        }
        Update: {
          appointment_count?: number
          created_at?: string | null
          id?: string
          month?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          city: string | null
          code: string | null
          country_code: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          city?: string | null
          code?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          city?: string | null
          code?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number | null
        }
        Insert: {
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
        }
        Update: {
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          stack: string | null
          url: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: string
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          stack?: string | null
          url: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          stack?: string | null
          url?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_featured: boolean | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      internal_teams: {
        Row: {
          branch_id: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_teams_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          quantity: number
          service_name: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          quantity?: number
          service_name: string
          total_price?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          quantity?: number
          service_name?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          currency: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      kv_store_4e5b82c2: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      maintenance_reports: {
        Row: {
          approved_by: string | null
          attachments: string[] | null
          content: Json
          created_at: string
          data_analysis: Json | null
          id: string
          prepared_by: string | null
          report_type: string
          request_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          attachments?: string[] | null
          content?: Json
          created_at?: string
          data_analysis?: Json | null
          id?: string
          prepared_by?: string | null
          report_type: string
          request_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          attachments?: string[] | null
          content?: Json
          created_at?: string
          data_analysis?: Json | null
          id?: string
          prepared_by?: string | null
          report_type?: string
          request_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_reports_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          actual_completion: string | null
          actual_cost: number | null
          address: string | null
          archived_at: string | null
          assigned_vendor_id: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          completion_photos: string[] | null
          created_at: string
          customer_notes: string | null
          description: string | null
          escalation_level: number | null
          estimated_completion: string | null
          estimated_cost: number | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          priority: string | null
          quality_score: number | null
          rating: number | null
          requested_by: string | null
          service_type: string
          sla_due_date: string | null
          status: string | null
          title: string
          updated_at: string
          vendor_notes: string | null
          workflow_stage:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
        }
        Insert: {
          actual_completion?: string | null
          actual_cost?: number | null
          address?: string | null
          archived_at?: string | null
          assigned_vendor_id?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          completion_photos?: string[] | null
          created_at?: string
          customer_notes?: string | null
          description?: string | null
          escalation_level?: number | null
          estimated_completion?: string | null
          estimated_cost?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string | null
          quality_score?: number | null
          rating?: number | null
          requested_by?: string | null
          service_type: string
          sla_due_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          vendor_notes?: string | null
          workflow_stage?:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
        }
        Update: {
          actual_completion?: string | null
          actual_cost?: number | null
          address?: string | null
          archived_at?: string | null
          assigned_vendor_id?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          completion_photos?: string[] | null
          created_at?: string
          customer_notes?: string | null
          description?: string | null
          escalation_level?: number | null
          estimated_completion?: string | null
          estimated_cost?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string | null
          quality_score?: number | null
          rating?: number | null
          requested_by?: string | null
          service_type?: string
          sla_due_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          vendor_notes?: string | null
          workflow_stage?:
            | Database["public"]["Enums"]["maintenance_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests_summary: {
        Row: {
          avg_actual_cost: number | null
          avg_estimated_cost: number | null
          created_at: string | null
          id: string
          month: string
          request_count: number
          status: string
          updated_at: string | null
        }
        Insert: {
          avg_actual_cost?: number | null
          avg_estimated_cost?: number | null
          created_at?: string | null
          id?: string
          month: string
          request_count?: number
          status: string
          updated_at?: string | null
        }
        Update: {
          avg_actual_cost?: number | null
          avg_estimated_cost?: number | null
          created_at?: string | null
          id?: string
          month?: string
          request_count?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_requests_summary_secure: {
        Row: {
          avg_actual_cost: number | null
          avg_estimated_cost: number | null
          created_at: string | null
          id: string
          month: string
          request_count: number
          status: string
          updated_at: string | null
        }
        Insert: {
          avg_actual_cost?: number | null
          avg_estimated_cost?: number | null
          created_at?: string | null
          id?: string
          month: string
          request_count?: number
          status: string
          updated_at?: string | null
        }
        Update: {
          avg_actual_cost?: number | null
          avg_estimated_cost?: number | null
          created_at?: string | null
          id?: string
          month?: string
          request_count?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      material_requests: {
        Row: {
          actual_cost: number | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          estimated_cost: number | null
          id: string
          issued_at: string | null
          issued_by: string | null
          material_name: string
          notes: string | null
          quantity: number
          request_id: string
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          material_name: string
          notes?: string | null
          quantity: number
          request_id: string
          status?: string
          unit: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          issued_at?: string | null
          issued_by?: string | null
          material_name?: string
          notes?: string | null
          quantity?: number
          request_id?: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_requests_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          id: number
          title: string
        }
        Insert: {
          id?: never
          title: string
        }
        Update: {
          id?: never
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message: string
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_t"]
          id: string
          method: string
          notes: string | null
          provider_ref: string | null
          request_id: string
          status: Database["public"]["Enums"]["payment_status_t"]
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_t"]
          id?: string
          method?: string
          notes?: string | null
          provider_ref?: string | null
          request_id: string
          status?: Database["public"]["Enums"]["payment_status_t"]
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_t"]
          id?: string
          method?: string
          notes?: string | null
          provider_ref?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["payment_status_t"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: never
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: never
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          budget: number | null
          client_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          location: string
          manager_id: string | null
          name: string
          progress: number | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          budget?: number | null
          client_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location: string
          manager_id?: string | null
          name: string
          progress?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          budget?: number | null
          client_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string
          manager_id?: string | null
          name?: string
          progress?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          area: number | null
          bathrooms: number | null
          created_at: string
          description: string | null
          floors: number | null
          id: string
          last_inspection_date: string | null
          maintenance_schedule: string | null
          manager_id: string | null
          name: string
          next_inspection_date: string | null
          parking_spaces: number | null
          region_id: string | null
          rooms: number | null
          status: string
          type: string
          updated_at: string
          value: number | null
        }
        Insert: {
          address: string
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          last_inspection_date?: string | null
          maintenance_schedule?: string | null
          manager_id?: string | null
          name: string
          next_inspection_date?: string | null
          parking_spaces?: number | null
          region_id?: string | null
          rooms?: number | null
          status?: string
          type: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          address?: string
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          last_inspection_date?: string | null
          maintenance_schedule?: string | null
          manager_id?: string | null
          name?: string
          next_inspection_date?: string | null
          parking_spaces?: number | null
          region_id?: string | null
          rooms?: number | null
          status?: string
          type?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      request_approvals: {
        Row: {
          approval_type: string
          approved_at: string | null
          approver_id: string
          comments: string | null
          created_at: string
          id: string
          request_id: string
          status: string
        }
        Insert: {
          approval_type: string
          approved_at?: string | null
          approver_id: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id: string
          status: string
        }
        Update: {
          approval_type?: string
          approved_at?: string | null
          approver_id?: string
          comments?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_approvals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "maintenance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_attachments: {
        Row: {
          created_at: string
          file_name: string | null
          file_path: string
          id: string
          mime_type: string | null
          request_id: string
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          file_path: string
          id?: string
          mime_type?: string | null
          request_id: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string | null
          file_path?: string
          id?: string
          mime_type?: string | null
          request_id?: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_attachments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_lifecycle: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          request_id: string
          status: Database["public"]["Enums"]["maintenance_status"]
          update_notes: string | null
          update_type: Database["public"]["Enums"]["update_type"]
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          request_id: string
          status: Database["public"]["Enums"]["maintenance_status"]
          update_notes?: string | null
          update_type: Database["public"]["Enums"]["update_type"]
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          request_id?: string
          status?: Database["public"]["Enums"]["maintenance_status"]
          update_notes?: string | null
          update_type?: Database["public"]["Enums"]["update_type"]
          updated_by?: string | null
        }
        Relationships: []
      }
      request_lines: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          qty: number
          rate: number
          request_id: string
          service_id: string
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          qty?: number
          rate?: number
          request_id: string
          service_id: string
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          qty?: number
          rate?: number
          request_id?: string
          service_id?: string
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "request_lines_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_lines_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      request_reviews: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          overall_rating: number | null
          photos: string[] | null
          professionalism: number | null
          request_id: string
          reviewer_id: string | null
          reviewer_type: string | null
          service_quality: number | null
          timeliness: number | null
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          overall_rating?: number | null
          photos?: string[] | null
          professionalism?: number | null
          request_id: string
          reviewer_id?: string | null
          reviewer_type?: string | null
          service_quality?: number | null
          timeliness?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          overall_rating?: number | null
          photos?: string[] | null
          professionalism?: number | null
          request_id?: string
          reviewer_id?: string | null
          reviewer_type?: string | null
          service_quality?: number | null
          timeliness?: number | null
          would_recommend?: boolean | null
        }
        Relationships: []
      }
      request_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          from_status: Database["public"]["Enums"]["request_status_t"] | null
          id: string
          note: string | null
          request_id: string
          to_status: Database["public"]["Enums"]["request_status_t"]
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          from_status?: Database["public"]["Enums"]["request_status_t"] | null
          id?: string
          note?: string | null
          request_id: string
          to_status: Database["public"]["Enums"]["request_status_t"]
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          from_status?: Database["public"]["Enums"]["request_status_t"] | null
          id?: string
          note?: string | null
          request_id?: string
          to_status?: Database["public"]["Enums"]["request_status_t"]
        }
        Relationships: [
          {
            foreignKeyName: "request_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_notifications: {
        Row: {
          created_at: string
          id: string
          message_template: string
          notification_type: string
          recipient_id: string
          request_id: string
          scheduled_for: string
          sent_at: string | null
          status: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_template: string
          notification_type: string
          recipient_id: string
          request_id: string
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          message_template?: string
          notification_type?: string
          recipient_id?: string
          request_id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      service_prices: {
        Row: {
          branch_id: string | null
          currency: Database["public"]["Enums"]["currency_t"]
          id: string
          price: number
          service_id: string
          vat_rate: number | null
          vendor_id: string | null
        }
        Insert: {
          branch_id?: string | null
          currency?: Database["public"]["Enums"]["currency_t"]
          id?: string
          price: number
          service_id: string
          vat_rate?: number | null
          vendor_id?: string | null
        }
        Update: {
          branch_id?: string | null
          currency?: Database["public"]["Enums"]["currency_t"]
          id?: string
          price?: number
          service_id?: string
          vat_rate?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_prices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_prices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          assigned_to: string | null
          branch_id: string
          code: string
          contact_user_id: string | null
          created_at: string
          created_by: string
          currency: Database["public"]["Enums"]["currency_t"]
          id: string
          notes: string | null
          paid_amount: number
          property_id: string | null
          provider_type: Database["public"]["Enums"]["provider_type_t"]
          scheduled_at: string | null
          status: Database["public"]["Enums"]["request_status_t"]
          subtotal: number
          team_id: string | null
          temp_contact_country_code: string | null
          temp_contact_name: string | null
          temp_contact_phone: string | null
          total: number
          vat_amount: number
          vendor_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          branch_id: string
          code?: string
          contact_user_id?: string | null
          created_at?: string
          created_by: string
          currency?: Database["public"]["Enums"]["currency_t"]
          id?: string
          notes?: string | null
          paid_amount?: number
          property_id?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type_t"]
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["request_status_t"]
          subtotal?: number
          team_id?: string | null
          temp_contact_country_code?: string | null
          temp_contact_name?: string | null
          temp_contact_phone?: string | null
          total?: number
          vat_amount?: number
          vendor_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          branch_id?: string
          code?: string
          contact_user_id?: string | null
          created_at?: string
          created_by?: string
          currency?: Database["public"]["Enums"]["currency_t"]
          id?: string
          notes?: string | null
          paid_amount?: number
          property_id?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type_t"]
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["request_status_t"]
          subtotal?: number
          team_id?: string | null
          temp_contact_country_code?: string | null
          temp_contact_name?: string | null
          temp_contact_phone?: string | null
          total?: number
          vat_amount?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_contact_user_id_fkey"
            columns: ["contact_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "internal_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number
          code: string | null
          default_vat_rate: number
          description: string | null
          id: string
          is_active: boolean
          max_qty: number | null
          min_qty: number | null
          name: string
          search_keywords: unknown | null
          subcategory_id: string
          unit: string | null
        }
        Insert: {
          base_price?: number
          code?: string | null
          default_vat_rate?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_qty?: number | null
          min_qty?: number | null
          name: string
          search_keywords?: unknown | null
          subcategory_id: string
          unit?: string | null
        }
        Update: {
          base_price?: number
          code?: string | null
          default_vat_rate?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_qty?: number | null
          min_qty?: number | null
          name?: string
          search_keywords?: unknown | null
          subcategory_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number | null
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_vendor_map: {
        Row: {
          user_id: string
          vendor_id: string
        }
        Insert: {
          user_id: string
          vendor_id: string
        }
        Update: {
          user_id?: string
          vendor_id?: string
        }
        Relationships: []
      }
      vendor_locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          last_updated: string
          latitude: number
          longitude: number
          vendor_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated?: string
          latitude: number
          longitude: number
          vendor_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          last_updated?: string
          latitude?: number
          longitude?: number
          vendor_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          name: string
          phone: string | null
          profile_image: string | null
          rating: number | null
          specialization: string[] | null
          status: string | null
          total_jobs: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          name: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
          total_jobs?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          name?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
          total_jobs?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      work_tasks: {
        Row: {
          actual_duration: number | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          materials_needed: string[] | null
          notes: string | null
          request_id: string
          sort_order: number | null
          status: string | null
          task_name: string
          updated_at: string
        }
        Insert: {
          actual_duration?: number | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          materials_needed?: string[] | null
          notes?: string | null
          request_id: string
          sort_order?: number | null
          status?: string | null
          task_name: string
          updated_at?: string
        }
        Update: {
          actual_duration?: number | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          materials_needed?: string[] | null
          notes?: string | null
          request_id?: string
          sort_order?: number | null
          status?: string | null
          task_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      appointments_secure: {
        Row: {
          appointment_date: string | null
          appointment_time: string | null
          created_at: string | null
          created_by: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          description: string | null
          duration_minutes: number | null
          id: string | null
          location: string | null
          maintenance_request_id: string | null
          notes: string | null
          property_id: string | null
          reminder_sent: boolean | null
          status: string | null
          title: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: never
          customer_name?: never
          customer_phone?: never
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: never
          customer_name?: never
          customer_phone?: never
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_appointments: {
        Row: {
          appointment_date: string | null
          appointment_time: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string | null
          location: string | null
          maintenance_request_id: string | null
          notes: string | null
          property_id: string | null
          reminder_sent: boolean | null
          status: string | null
          title: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_time?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          location?: string | null
          maintenance_request_id?: string | null
          notes?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      app_is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      app_is_owner: {
        Args: { row_user_id: string }
        Returns: boolean
      }
      app_is_staff: {
        Args: { uid: string }
        Returns: boolean
      }
      app_is_vendor: {
        Args: { uid: string }
        Returns: boolean
      }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_sla_due_date: {
        Args: {
          created_at: string
          priority_level: string
          service_type: string
        }
        Returns: string
      }
      can_access_full_appointment: {
        Args: { appointment_id: string }
        Returns: boolean
      }
      can_access_service_request: {
        Args: { request_id: string }
        Returns: boolean
      }
      find_nearest_vendor: {
        Args: {
          request_latitude: number
          request_longitude: number
          service_specialization?: string
        }
        Returns: {
          distance: number
          email: string
          phone: string
          vendor_id: string
          vendor_name: string
        }[]
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_appointment_contact_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_appointment_customer_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_appointments_for_staff: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointment_date: string
          appointment_time: string
          created_at: string
          description: string
          duration_minutes: number
          id: string
          location: string
          maintenance_request_id: string
          notes: string
          property_id: string
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string
        }[]
      }
      get_customer_contact_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_customer_email: {
        Args: { appointment_id: string }
        Returns: string
      }
      get_customer_name: {
        Args: { appointment_id: string }
        Returns: string
      }
      get_customer_phone: {
        Args: { appointment_id: string }
        Returns: string
      }
      get_full_customer_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_vendor_appointments: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_name: string
          description: string
          duration_minutes: number
          id: string
          location: string
          maintenance_request_id: string
          notes: string
          property_id: string
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never> | { uid: string }
        Returns: boolean
      }
      is_vendor: {
        Args: { uid: string }
        Returns: boolean
      }
      mask_customer_phone: {
        Args: { phone: string; user_role: string }
        Returns: string
      }
      recalc_request_totals: {
        Args: { p_request_id: string }
        Returns: undefined
      }
      update_summary_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_summary_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      vendor_appointments_func: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointment_date: string
          appointment_time: string
          created_at: string
          created_by: string
          description: string
          duration_minutes: number
          id: string
          location: string
          maintenance_request_id: string
          notes: string
          property_id: string
          reminder_sent: boolean
          status: string
          title: string
          updated_at: string
          vendor_id: string
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "manager"
        | "staff"
        | "technician"
        | "vendor"
        | "customer"
        | "warehouse"
        | "accounting"
        | "engineering"
      currency_t: "EGP" | "USD" | "EUR" | "SAR" | "AED"
      maintenance_status:
        | "draft"
        | "submitted"
        | "acknowledged"
        | "assigned"
        | "scheduled"
        | "in_progress"
        | "inspection"
        | "waiting_parts"
        | "completed"
        | "billed"
        | "paid"
        | "closed"
        | "cancelled"
        | "on_hold"
      payment_status_t:
        | "draft"
        | "pending"
        | "authorized"
        | "captured"
        | "failed"
        | "refunded"
        | "cancelled"
      provider_type_t: "internal_team" | "external_vendor"
      request_status_t:
        | "draft"
        | "awaiting_vendor"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      update_type:
        | "status_change"
        | "assignment"
        | "scheduling"
        | "cost_estimate"
        | "completion"
        | "feedback"
        | "payment"
        | "note"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "manager",
        "staff",
        "technician",
        "vendor",
        "customer",
        "warehouse",
        "accounting",
        "engineering",
      ],
      currency_t: ["EGP", "USD", "EUR", "SAR", "AED"],
      maintenance_status: [
        "draft",
        "submitted",
        "acknowledged",
        "assigned",
        "scheduled",
        "in_progress",
        "inspection",
        "waiting_parts",
        "completed",
        "billed",
        "paid",
        "closed",
        "cancelled",
        "on_hold",
      ],
      payment_status_t: [
        "draft",
        "pending",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "cancelled",
      ],
      provider_type_t: ["internal_team", "external_vendor"],
      request_status_t: [
        "draft",
        "awaiting_vendor",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      update_type: [
        "status_change",
        "assignment",
        "scheduling",
        "cost_estimate",
        "completion",
        "feedback",
        "payment",
        "note",
      ],
    },
  },
} as const
