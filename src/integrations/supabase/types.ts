export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string;
          created_at: string;
          description: string;
          icon: string;
          id: string;
          title: string;
          user_id: string;
          xp_awarded: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          title: string;
          user_id: string;
          xp_awarded?: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          title?: string;
          user_id?: string;
          xp_awarded?: number;
        };
        Relationships: [];
      };
      build_blueprints: {
        Row: {
          blueprint: Json;
          created_at: string;
          description: string | null;
          id: string;
          technologies: Json;
          title: string;
          user_id: string;
        };
        Insert: {
          blueprint: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          technologies?: Json;
          title: string;
          user_id: string;
        };
        Update: {
          blueprint?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          technologies?: Json;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          created_at: string;
          id: string;
          parts: Json;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          parts: Json;
          role: string;
          thread_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          parts?: Json;
          role?: string;
          thread_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "chat_threads";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_threads: {
        Row: {
          created_at: string;
          id: string;
          pinned: boolean;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          pinned?: boolean;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          pinned?: boolean;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_progress: {
        Row: {
          created_at: string;
          day: string;
          id: string;
          minutes: number;
          notes: string | null;
          user_id: string;
          xp_earned: number;
        };
        Insert: {
          created_at?: string;
          day: string;
          id?: string;
          minutes?: number;
          notes?: string | null;
          user_id: string;
          xp_earned?: number;
        };
        Update: {
          created_at?: string;
          day?: string;
          id?: string;
          minutes?: number;
          notes?: string | null;
          user_id?: string;
          xp_earned?: number;
        };
        Relationships: [];
      };
      mentor_plans: {
        Row: {
          created_at: string;
          goal: string | null;
          id: string;
          level: string;
          plan: Json;
          topic: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          goal?: string | null;
          id?: string;
          level?: string;
          plan: Json;
          topic: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          goal?: string | null;
          id?: string;
          level?: string;
          plan?: Json;
          topic?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      mentor_sessions: {
        Row: {
          completed_steps: Json;
          created_at: string;
          id: string;
          project_id: string | null;
          steps: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_steps?: Json;
          created_at?: string;
          id?: string;
          project_id?: string | null;
          steps?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_steps?: Json;
          created_at?: string;
          id?: string;
          project_id?: string | null;
          steps?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      node_progress: {
        Row: {
          bookmarked: boolean;
          completed_at: string | null;
          created_at: string;
          domain: string;
          hours: number;
          hours_spent: number;
          id: string;
          node_id: string;
          quiz_score: number | null;
          status: string;
          tier: string;
          updated_at: string;
          user_id: string;
          xp_earned: number;
          last_accessed: string;
        };
        Insert: {
          bookmarked?: boolean;
          completed_at?: string | null;
          created_at?: string;
          domain: string;
          hours?: number;
          hours_spent?: number;
          id?: string;
          node_id: string;
          quiz_score?: number | null;
          status?: string;
          tier: string;
          updated_at?: string;
          user_id: string;
          xp_earned?: number;
          last_accessed?: string;
        };
        Update: {
          bookmarked?: boolean;
          completed_at?: string | null;
          created_at?: string;
          domain?: string;
          hours?: number;
          hours_spent?: number;
          id?: string;
          node_id?: string;
          quiz_score?: number | null;
          status?: string;
          tier?: string;
          updated_at?: string;
          user_id?: string;
          xp_earned?: number;
          last_accessed?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          email: string | null;
          id: string;
          streak_days: number;
          updated_at: string;
          xp: number;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id: string;
          streak_days?: number;
          updated_at?: string;
          xp?: number;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id?: string;
          streak_days?: number;
          updated_at?: string;
          xp?: number;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          architecture: Json;
          bookmarked: boolean;
          created_at: string;
          difficulty: string;
          domains: Json;
          future_scope: Json;
          id: string;
          innovation_score: number;
          market_potential: string;
          problem_statement: string;
          requirements: Json;
          resume_value_score: number;
          solution_overview: string;
          tech_depth_score: number;
          technologies: Json;
          timeline: Json;
          title: string;
          user_id: string;
        };
        Insert: {
          architecture?: Json;
          bookmarked?: boolean;
          created_at?: string;
          difficulty?: string;
          domains?: Json;
          future_scope?: Json;
          id?: string;
          innovation_score?: number;
          market_potential?: string;
          problem_statement: string;
          requirements?: Json;
          resume_value_score?: number;
          solution_overview: string;
          tech_depth_score?: number;
          technologies?: Json;
          timeline?: Json;
          title: string;
          user_id: string;
        };
        Update: {
          architecture?: Json;
          bookmarked?: boolean;
          created_at?: string;
          difficulty?: string;
          domains?: Json;
          future_scope?: Json;
          id?: string;
          innovation_score?: number;
          market_potential?: string;
          problem_statement?: string;
          requirements?: Json;
          resume_value_score?: number;
          solution_overview?: string;
          tech_depth_score?: number;
          technologies?: Json;
          timeline?: Json;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      resumes: {
        Row: {
          ats_report: Json;
          ats_score: number;
          content: Json;
          created_at: string;
          id: string;
          target_role: string;
          template: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ats_report?: Json;
          ats_score?: number;
          content?: Json;
          created_at?: string;
          id?: string;
          target_role?: string;
          template?: string;
          title?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ats_report?: Json;
          ats_score?: number;
          content?: Json;
          created_at?: string;
          id?: string;
          target_role?: string;
          template?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      roadmap_cache: {
        Row: {
          content: Json;
          created_at: string;
          domain: string;
          expires_at: string | null;
          generated_by: string | null;
          id: string;
          model: string | null;
          tier: string;
          updated_at: string;
          version: string | null;
        };
        Insert: {
          content: Json;
          created_at?: string;
          domain: string;
          expires_at?: string | null;
          generated_by?: string | null;
          id?: string;
          model?: string | null;
          tier: string;
          updated_at?: string;
          version?: string | null;
        };
        Update: {
          content?: Json;
          created_at?: string;
          domain?: string;
          expires_at?: string | null;
          generated_by?: string | null;
          id?: string;
          model?: string | null;
          tier?: string;
          updated_at?: string;
          version?: string | null;
        };
        Relationships: [];
      };
      roadmaps: {
        Row: {
          content: Json;
          created_at: string;
          experience_level: string;
          id: string;
          target_role: string;
          timeframe: string;
          user_id: string;
        };
        Insert: {
          content: Json;
          created_at?: string;
          experience_level: string;
          id?: string;
          target_role: string;
          timeframe: string;
          user_id: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          experience_level?: string;
          id?: string;
          target_role?: string;
          timeframe?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      study_guides: {
        Row: {
          content: Json;
          created_at: string;
          daily_minutes: number;
          domain: string;
          goal: string;
          id: string;
          skill_level: string;
          user_id: string;
        };
        Insert: {
          content: Json;
          created_at?: string;
          daily_minutes: number;
          domain: string;
          goal: string;
          id?: string;
          skill_level: string;
          user_id: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          daily_minutes?: number;
          domain?: string;
          goal?: string;
          id?: string;
          skill_level?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      award_xp_and_streak: {
        Args: { amount: number; reason?: string };
        Returns: {
          new_level: number;
          new_streak: number;
          new_xp: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
