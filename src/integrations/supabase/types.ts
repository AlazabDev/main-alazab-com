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
      maintenance_requests: {
        Row: {
          actual_completion: string | null
          actual_cost: number | null
          address: string | null
          assigned_vendor_id: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          completion_photos: string[] | null
          created_at: string
          customer_notes: string | null
          description: string | null
          estimated_completion: string | null
          estimated_cost: number | null
          id: string
          location: string
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          priority: string | null
          rating: number | null
          requested_by: string | null
          service_type: string
          status: string | null
          title: string
          updated_at: string
          vendor_notes: string | null
        }
        Insert: {
          actual_completion?: string | null
          actual_cost?: number | null
          address?: string | null
          assigned_vendor_id?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          completion_photos?: string[] | null
          created_at?: string
          customer_notes?: string | null
          description?: string | null
          estimated_completion?: string | null
          estimated_cost?: number | null
          id?: string
          location: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string | null
          rating?: number | null
          requested_by?: string | null
          service_type: string
          status?: string | null
          title: string
          updated_at?: string
          vendor_notes?: string | null
        }
        Update: {
          actual_completion?: string | null
          actual_cost?: number | null
          address?: string | null
          assigned_vendor_id?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          completion_photos?: string[] | null
          created_at?: string
          customer_notes?: string | null
          description?: string | null
          estimated_completion?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          priority?: string | null
          rating?: number | null
          requested_by?: string | null
          service_type?: string
          status?: string | null
          title?: string
          updated_at?: string
          vendor_notes?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
