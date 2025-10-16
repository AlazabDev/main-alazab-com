import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  gender: string | null;
  birth_date: string | null;
  timezone: string | null;
  locale: string | null;
}

export interface UserPreferences {
  user_id: string;
  monthly_budget: number | null;
  timezone: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
}

export interface PlatformPermissions {
  user_id: string;
  can_choose_appointment_date: boolean;
  can_submit_without_manager_approval: boolean;
  can_view_financial_details: boolean;
  can_cancel_requests: boolean;
  can_reject_prices: boolean;
  can_create_properties: boolean;
}

export const useUserSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      // إنشاء ملف تعريف إذا لم يكن موجوداً
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            first_name: user.user_metadata?.first_name || "",
            timezone: "Africa/Cairo",
            locale: "ar"
          })
          .select()
          .single();
        
        if (createError) throw createError;
        return newProfile as UserProfile;
      }
      
      return data as UserProfile;
    },
  });

  // Fetch user preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserPreferences | null;
    },
  });

  // Fetch platform permissions
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ["platform-permissions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("platform_permissions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as PlatformPermissions | null;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث البيانات الشخصية بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existing } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("user_preferences")
          .update(updates)
          .eq("user_id", user.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("user_preferences")
          .insert({ user_id: user.id, ...updates })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث الإعدادات بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "تم التحديث",
        description: "تم تغيير كلمة المرور بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    preferences,
    permissions,
    isLoading: profileLoading || preferencesLoading || permissionsLoading,
    updateProfile: updateProfileMutation.mutate,
    updatePreferences: updatePreferencesMutation.mutate,
    updatePassword: updatePasswordMutation.mutate,
  };
};
