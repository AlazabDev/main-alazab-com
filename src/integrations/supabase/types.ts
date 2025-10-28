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
          address: string | null
          city: string | null
          code: string | null
          company_id: string
          created_at: string
          created_by: string | null
          geo: Json | null
          id: string
          name: string
          opening_hours: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          geo?: Json | null
          id?: string
          name: string
          opening_hours?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          geo?: Json | null
          id?: string
          name?: string
          opening_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      companies: {
        Row: {
          billing_cycle: string | null
          created_at: string
          created_by: string | null
          eta_tax_profile_id: string | null
          id: string
          name: string
          pricing_model: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string
          created_by?: string | null
          eta_tax_profile_id?: string | null
          id?: string
          name: string
          pricing_model?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string
          created_by?: string | null
          eta_tax_profile_id?: string | null
          id?: string
          name?: string
          pricing_model?: string | null
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
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          maintenance_request_id: string | null
          request_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          maintenance_request_id?: string | null
          request_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          maintenance_request_id?: string | null
          request_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          folder: string | null
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
          folder?: string | null
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
          folder?: string | null
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
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          archived_at: string | null
          asset_id: string | null
          assigned_vendor_id: string | null
          branch_id: string
          category_id: string | null
          channel: string | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          location: string | null
          opened_by_role: string | null
          priority: string | null
          rating: number | null
          service_type: string | null
          sla_deadline: string | null
          sla_due_date: string | null
          status: Database["public"]["Enums"]["mr_status"]
          subcategory_id: string | null
          title: string
          updated_at: string | null
          vendor_notes: string | null
          workflow_stage: string | null
        }
        Insert: {
          actual_cost?: number | null
          archived_at?: string | null
          asset_id?: string | null
          assigned_vendor_id?: string | null
          branch_id: string
          category_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          opened_by_role?: string | null
          priority?: string | null
          rating?: number | null
          service_type?: string | null
          sla_deadline?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"]
          subcategory_id?: string | null
          title: string
          updated_at?: string | null
          vendor_notes?: string | null
          workflow_stage?: string | null
        }
        Update: {
          actual_cost?: number | null
          archived_at?: string | null
          asset_id?: string | null
          assigned_vendor_id?: string | null
          branch_id?: string
          category_id?: string | null
          channel?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          opened_by_role?: string | null
          priority?: string | null
          rating?: number | null
          service_type?: string | null
          sla_deadline?: string | null
          sla_due_date?: string | null
          status?: Database["public"]["Enums"]["mr_status"]
          subcategory_id?: string | null
          title?: string
          updated_at?: string | null
          vendor_notes?: string | null
          workflow_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_assigned_vendor_id_fkey"
            columns: ["assigned_vendor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "service_subcategories"
            referencedColumns: ["id"]
          },
        ]
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
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          email: string
          first_name: string | null
          id: string
          iframe_key: string | null
          is_deleted: boolean | null
          last_name: string | null
          link_3d: string | null
          name: string
          phone: string | null
          photo_link: string | null
          plan_link: string | null
          position: string | null
          reports_to: string | null
          role: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email: string
          first_name?: string | null
          id?: string
          iframe_key?: string | null
          is_deleted?: boolean | null
          last_name?: string | null
          link_3d?: string | null
          name: string
          phone?: string | null
          photo_link?: string | null
          plan_link?: string | null
          position?: string | null
          reports_to?: string | null
          role: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          email?: string
          first_name?: string | null
          id?: string
          iframe_key?: string | null
          is_deleted?: boolean | null
          last_name?: string | null
          link_3d?: string | null
          name?: string
          phone?: string | null
          photo_link?: string | null
          plan_link?: string | null
          position?: string | null
          reports_to?: string | null
          role?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          actual_start_date: string | null
          budget: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          progress: number | null
          project_id: string
          sort_order: number | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          progress?: number | null
          project_id: string
          sort_order?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          actual_start_date?: string | null
          budget?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          progress?: number | null
          project_id?: string
          sort_order?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          attachments: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          project_id: string
          title: string
          update_type: string | null
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          project_id: string
          title: string
          update_type?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          project_id?: string
          title?: string
          update_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_views: {
        Row: {
          area_label: string | null
          category: string | null
          challenges: string | null
          city: string | null
          company_name: string | null
          country: string | null
          cover_image: string | null
          created_at: string | null
          display_status: string | null
          duration_label: string | null
          end_date: string | null
          featured: boolean | null
          full_description: string | null
          gallery: Json | null
          id: number
          is_deleted: boolean | null
          link_3d: string | null
          order_priority: number | null
          plan_link: string | null
          project_name: string
          short_description: string | null
          slug: string | null
          solutions: string | null
          start_date: string | null
          status: string | null
          technical_specs: Json | null
          updated_at: string | null
        }
        Insert: {
          area_label?: string | null
          category?: string | null
          challenges?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          display_status?: string | null
          duration_label?: string | null
          end_date?: string | null
          featured?: boolean | null
          full_description?: string | null
          gallery?: Json | null
          id?: number
          is_deleted?: boolean | null
          link_3d?: string | null
          order_priority?: number | null
          plan_link?: string | null
          project_name: string
          short_description?: string | null
          slug?: string | null
          solutions?: string | null
          start_date?: string | null
          status?: string | null
          technical_specs?: Json | null
          updated_at?: string | null
        }
        Update: {
          area_label?: string | null
          category?: string | null
          challenges?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          display_status?: string | null
          duration_label?: string | null
          end_date?: string | null
          featured?: boolean | null
          full_description?: string | null
          gallery?: Json | null
          id?: number
          is_deleted?: boolean | null
          link_3d?: string | null
          order_priority?: number | null
          plan_link?: string | null
          project_name?: string
          short_description?: string | null
          slug?: string | null
          solutions?: string | null
          start_date?: string | null
          status?: string | null
          technical_specs?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_cost: number | null
          actual_end_date: string | null
          budget: number | null
          company_name: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          gallery_url: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          magicplan_iframe_url: string | null
          manager_id: string | null
          name: string
          progress: number | null
          project_type: string | null
          sketch_url: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          actual_end_date?: string | null
          budget?: number | null
          company_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          gallery_url?: string | null
          id: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          magicplan_iframe_url?: string | null
          manager_id?: string | null
          name: string
          progress?: number | null
          project_type?: string | null
          sketch_url?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          actual_end_date?: string | null
          budget?: number | null
          company_name?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          gallery_url?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          magicplan_iframe_url?: string | null
          manager_id?: string | null
          name?: string
          progress?: number | null
          project_type?: string | null
          sketch_url?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
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
          qr_code_data: string | null
          qr_code_generated_at: string | null
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
          qr_code_data?: string | null
          qr_code_generated_at?: string | null
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
          qr_code_data?: string | null
          qr_code_generated_at?: string | null
          region_id?: string | null
          rooms?: number | null
          status?: string
          type?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      quick_maintenance_requests: {
        Row: {
          contact_email: string | null
          contact_name: string
          contact_phone: string
          converted_to_request_id: string | null
          created_at: string
          id: string
          images: string[] | null
          issue_description: string
          location_details: string | null
          property_id: string
          status: string
          updated_at: string
          urgency_level: string
        }
        Insert: {
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          converted_to_request_id?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          issue_description: string
          location_details?: string | null
          property_id: string
          status?: string
          updated_at?: string
          urgency_level?: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          converted_to_request_id?: string | null
          created_at?: string
          id?: string
          images?: string[] | null
          issue_description?: string
          location_details?: string | null
          property_id?: string
          status?: string
          updated_at?: string
          urgency_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          code: string | null
          coordinates: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          level: number
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          coordinates?: Json | null
          created_at?: string | null
          id: string
          is_active?: boolean | null
          level: number
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          coordinates?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "regions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
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
        Relationships: []
      }
      request_events: {
        Row: {
          by_user: string | null
          created_at: string | null
          event_type: string
          from_stage: string | null
          id: string
          meta: Json | null
          nonce: string | null
          notes: string | null
          request_id: string
          to_stage: string | null
        }
        Insert: {
          by_user?: string | null
          created_at?: string | null
          event_type: string
          from_stage?: string | null
          id?: string
          meta?: Json | null
          nonce?: string | null
          notes?: string | null
          request_id: string
          to_stage?: string | null
        }
        Update: {
          by_user?: string | null
          created_at?: string | null
          event_type?: string
          from_stage?: string | null
          id?: string
          meta?: Json | null
          nonce?: string | null
          notes?: string | null
          request_id?: string
          to_stage?: string | null
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_checklists: {
        Row: {
          category_id: string | null
          created_at: string | null
          evidence_type: string | null
          id: string
          item: string
          required: boolean | null
          sort_order: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          evidence_type?: string | null
          id?: string
          item: string
          required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          evidence_type?: string | null
          id?: string
          item?: string
          required?: boolean | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_checklists_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_price_tiers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          max_quantity: number | null
          min_quantity: number | null
          price: number
          service_id: string
          tier_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_quantity?: number | null
          min_quantity?: number | null
          price: number
          service_id: string
          tier_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_quantity?: number | null
          min_quantity?: number | null
          price?: number
          service_id?: string
          tier_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_price_tiers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_prices: {
        Row: {
          branch_id: string | null
          id: string
          price: number
          service_id: string
          vat_rate: number | null
          vendor_id: string | null
        }
        Insert: {
          branch_id?: string | null
          id?: string
          price: number
          service_id: string
          vat_rate?: number | null
          vendor_id?: string | null
        }
        Update: {
          branch_id?: string | null
          id?: string
          price?: number
          service_id?: string
          vat_rate?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_prices_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      service_subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          category_id: string | null
          code: string
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          max_qty: number | null
          min_qty: number | null
          name: string | null
          name_ar: string
          name_en: string | null
          pricing_type: string
          sort_order: number | null
          subcategory_id: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category_id?: string | null
          code: string
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          max_qty?: number | null
          min_qty?: number | null
          name?: string | null
          name_ar: string
          name_en?: string | null
          pricing_type?: string
          sort_order?: number | null
          subcategory_id: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category_id?: string | null
          code?: string
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          max_qty?: number | null
          min_qty?: number | null
          name?: string | null
          name_ar?: string
          name_en?: string | null
          pricing_type?: string
          sort_order?: number | null
          subcategory_id?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sla_policies: {
        Row: {
          accept_within_min: number
          arrive_within_min: number
          category_id: string | null
          complete_within_min: number
          created_at: string | null
          id: string
          priority: string
        }
        Insert: {
          accept_within_min: number
          arrive_within_min: number
          category_id?: string | null
          complete_within_min: number
          created_at?: string | null
          id?: string
          priority: string
        }
        Update: {
          accept_within_min?: number
          arrive_within_min?: number
          category_id?: string | null
          complete_within_min?: number
          created_at?: string | null
          id?: string
          priority?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_policies_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      status_defs: {
        Row: {
          label_ar: string | null
          label_en: string | null
          sort: number
          status: string
        }
        Insert: {
          label_ar?: string | null
          label_en?: string | null
          sort: number
          status: string
        }
        Update: {
          label_ar?: string | null
          label_en?: string | null
          sort?: number
          status?: string
        }
        Relationships: []
      }
      status_transitions: {
        Row: {
          from_status: string
          roles_allowed: string[]
          to_status: string
        }
        Insert: {
          from_status: string
          roles_allowed: string[]
          to_status: string
        }
        Update: {
          from_status?: string
          roles_allowed?: string[]
          to_status?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          area: number | null
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          email: string | null
          id: string
          is_deleted: boolean | null
          location: string | null
          map_url: string | null
          name: string
          opening_date: string | null
          phone: string | null
          region_id: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          area?: number | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_deleted?: boolean | null
          location?: string | null
          map_url?: string | null
          name: string
          opening_date?: string | null
          phone?: string | null
          region_id?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          area?: number | null
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_deleted?: boolean | null
          location?: string | null
          map_url?: string | null
          name?: string
          opening_date?: string | null
          phone?: string | null
          region_id?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
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
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          code: string
          name_ar: string
          name_en: string | null
        }
        Insert: {
          code: string
          name_ar: string
          name_en?: string | null
        }
        Update: {
          code?: string
          name_ar?: string
          name_en?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          monthly_budget: number | null
          notifications_enabled: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          monthly_budget?: number | null
          notifications_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          monthly_budget?: number | null
          notifications_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          id: string
          name: string
          phone: string | null
          profile_image: string | null
          rating: number | null
          specialization: string[] | null
          status: string | null
          total_jobs: number | null
          unit_rate: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          id?: string
          name: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
          total_jobs?: number | null
          unit_rate?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          id?: string
          name?: string
          phone?: string | null
          profile_image?: string | null
          rating?: number | null
          specialization?: string[] | null
          status?: string | null
          total_jobs?: number | null
          unit_rate?: number | null
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
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_sla_deadlines: {
        Args: {
          p_category_id?: string
          p_priority: string
          p_request_id: string
        }
        Returns: undefined
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
      can_transition_stage: {
        Args: { current_stage: string; next_stage: string; user_role: string }
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
      generate_invoice_number: { Args: never; Returns: string }
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
        Args: never
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
      get_current_user_company_id: { Args: never; Returns: string }
      get_customer_contact_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_customer_email: { Args: { appointment_id: string }; Returns: string }
      get_customer_name: { Args: { appointment_id: string }; Returns: string }
      get_customer_phone: { Args: { appointment_id: string }; Returns: string }
      get_full_customer_info: {
        Args: { appointment_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
        }[]
      }
      get_vendor_appointments: {
        Args: never
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
      is_admin: { Args: never; Returns: boolean }
      is_staff:
        | { Args: { uid: string }; Returns: boolean }
        | { Args: never; Returns: boolean }
      recalc_request_totals: {
        Args: { p_request_id: string }
        Returns: undefined
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
      maintenance_stage:
        | "DRAFT"
        | "SUBMITTED"
        | "TRIAGED"
        | "ASSIGNED"
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "INSPECTION"
        | "COMPLETED"
        | "BILLED"
        | "PAID"
        | "CLOSED"
        | "ON_HOLD"
        | "WAITING_PARTS"
        | "CANCELLED"
        | "REJECTED"
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
      maintenance_status_v2:
        | "submitted"
        | "triaged"
        | "needs_info"
        | "scheduled"
        | "in_progress"
        | "paused"
        | "escalated"
        | "completed"
        | "qa_review"
        | "closed"
        | "reopened"
        | "canceled"
        | "rejected"
      mr_status:
        | "Open"
        | "Assigned"
        | "InProgress"
        | "Waiting"
        | "Completed"
        | "Rejected"
        | "Cancelled"
      priority_level: "low" | "medium" | "high"
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
      wo_status:
        | "Pending"
        | "Scheduled"
        | "EnRoute"
        | "InProgress"
        | "Paused"
        | "Completed"
        | "Cancelled"
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
      maintenance_stage: [
        "DRAFT",
        "SUBMITTED",
        "TRIAGED",
        "ASSIGNED",
        "SCHEDULED",
        "IN_PROGRESS",
        "INSPECTION",
        "COMPLETED",
        "BILLED",
        "PAID",
        "CLOSED",
        "ON_HOLD",
        "WAITING_PARTS",
        "CANCELLED",
        "REJECTED",
      ],
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
      maintenance_status_v2: [
        "submitted",
        "triaged",
        "needs_info",
        "scheduled",
        "in_progress",
        "paused",
        "escalated",
        "completed",
        "qa_review",
        "closed",
        "reopened",
        "canceled",
        "rejected",
      ],
      mr_status: [
        "Open",
        "Assigned",
        "InProgress",
        "Waiting",
        "Completed",
        "Rejected",
        "Cancelled",
      ],
      priority_level: ["low", "medium", "high"],
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
      wo_status: [
        "Pending",
        "Scheduled",
        "EnRoute",
        "InProgress",
        "Paused",
        "Completed",
        "Cancelled",
      ],
    },
  },
} as const
