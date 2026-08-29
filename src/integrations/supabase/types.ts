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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      apex_market_state: {
        Row: {
          id: string
          kind: string
          model_version: number
          payload: Json
          symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          kind: string
          model_version?: number
          payload: Json
          symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          kind?: string
          model_version?: number
          payload?: Json
          symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      apex_sim_trades: {
        Row: {
          contract: string
          created_at: string
          detail: Json | null
          duration_ticks: number | null
          entry_at: string | null
          entry_condition: string | null
          entry_digit: number | null
          id: string
          outcome: string | null
          payout: number | null
          pnl: number | null
          resolution_digit: number | null
          resolved_at: string | null
          stake: number | null
          symbol: string
          user_id: string
        }
        Insert: {
          contract: string
          created_at?: string
          detail?: Json | null
          duration_ticks?: number | null
          entry_at?: string | null
          entry_condition?: string | null
          entry_digit?: number | null
          id?: string
          outcome?: string | null
          payout?: number | null
          pnl?: number | null
          resolution_digit?: number | null
          resolved_at?: string | null
          stake?: number | null
          symbol: string
          user_id: string
        }
        Update: {
          contract?: string
          created_at?: string
          detail?: Json | null
          duration_ticks?: number | null
          entry_at?: string | null
          entry_condition?: string | null
          entry_digit?: number | null
          id?: string
          outcome?: string | null
          payout?: number | null
          pnl?: number | null
          resolution_digit?: number | null
          resolved_at?: string | null
          stake?: number | null
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      deriv_accounts: {
        Row: {
          balance: number | null
          created_at: string
          currency: string | null
          id: string
          is_active: boolean
          is_virtual: boolean
          loginid: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          is_active?: boolean
          is_virtual?: boolean
          loginid: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          is_active?: boolean
          is_virtual?: boolean
          loginid?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parity_signals: {
        Row: {
          action: string
          confidence: number | null
          created_at: string
          entry_formula: string | null
          expires_at: string | null
          id: string
          market: string
          outcome: string
          published_at: string | null
          resolved_at: string | null
        }
        Insert: {
          action: string
          confidence?: number | null
          created_at?: string
          entry_formula?: string | null
          expires_at?: string | null
          id: string
          market: string
          outcome?: string
          published_at?: string | null
          resolved_at?: string | null
        }
        Update: {
          action?: string
          confidence?: number | null
          created_at?: string
          entry_formula?: string | null
          expires_at?: string | null
          id?: string
          market?: string
          outcome?: string
          published_at?: string | null
          resolved_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          deriv_connected: boolean
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deriv_connected?: boolean
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deriv_connected?: boolean
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sentinel_calibration_snapshots: {
        Row: {
          created_at: string
          id: string
          payload: Json
          symbol: string
          taken_on: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          payload: Json
          symbol: string
          taken_on?: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          symbol?: string
          taken_on?: string
          version?: number
        }
        Relationships: []
      }
      sentinel_combo_stats: {
        Row: {
          contract: string
          current_streak: number | null
          decay_half_life_ms: number | null
          deterioration_pp: number | null
          entry_condition: string
          expectancy: number | null
          id: string
          last_outcome_at: string | null
          longest_losing_streak: number | null
          losses: number
          max_drawdown: number | null
          n: number
          net_pnl: number | null
          regime: string
          symbol: string
          updated_at: string
          version: number
          weighted_expectancy: number | null
          weighted_n: number | null
          weighted_wins: number | null
          wins: number
        }
        Insert: {
          contract: string
          current_streak?: number | null
          decay_half_life_ms?: number | null
          deterioration_pp?: number | null
          entry_condition: string
          expectancy?: number | null
          id?: string
          last_outcome_at?: string | null
          longest_losing_streak?: number | null
          losses?: number
          max_drawdown?: number | null
          n?: number
          net_pnl?: number | null
          regime: string
          symbol: string
          updated_at?: string
          version?: number
          weighted_expectancy?: number | null
          weighted_n?: number | null
          weighted_wins?: number | null
          wins?: number
        }
        Update: {
          contract?: string
          current_streak?: number | null
          decay_half_life_ms?: number | null
          deterioration_pp?: number | null
          entry_condition?: string
          expectancy?: number | null
          id?: string
          last_outcome_at?: string | null
          longest_losing_streak?: number | null
          losses?: number
          max_drawdown?: number | null
          n?: number
          net_pnl?: number | null
          regime?: string
          symbol?: string
          updated_at?: string
          version?: number
          weighted_expectancy?: number | null
          weighted_n?: number | null
          weighted_wins?: number | null
          wins?: number
        }
        Relationships: []
      }
      sentinel_journal: {
        Row: {
          client_id: string
          confidence: number | null
          contract: string
          contract_label: string | null
          created_at: string
          danger: number | null
          edge_pct: number | null
          entry_digit_index: number | null
          id: string
          mode: string
          name: string | null
          note: string | null
          opportunity: number | null
          outcome: string
          quality: number | null
          resolved_digit: number | null
          symbol: string
          ts: string
          user_id: string
        }
        Insert: {
          client_id: string
          confidence?: number | null
          contract: string
          contract_label?: string | null
          created_at?: string
          danger?: number | null
          edge_pct?: number | null
          entry_digit_index?: number | null
          id?: string
          mode: string
          name?: string | null
          note?: string | null
          opportunity?: number | null
          outcome?: string
          quality?: number | null
          resolved_digit?: number | null
          symbol: string
          ts?: string
          user_id: string
        }
        Update: {
          client_id?: string
          confidence?: number | null
          contract?: string
          contract_label?: string | null
          created_at?: string
          danger?: number | null
          edge_pct?: number | null
          entry_digit_index?: number | null
          id?: string
          mode?: string
          name?: string | null
          note?: string | null
          opportunity?: number | null
          outcome?: string
          quality?: number | null
          resolved_digit?: number | null
          symbol?: string
          ts?: string
          user_id?: string
        }
        Relationships: []
      }
      sentinel_learning_state: {
        Row: {
          id: string
          kind: string
          payload: Json
          symbol: string
          updated_at: string
          version: number
        }
        Insert: {
          id?: string
          kind: string
          payload: Json
          symbol: string
          updated_at?: string
          version?: number
        }
        Update: {
          id?: string
          kind?: string
          payload?: Json
          symbol?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      sentinel_operator_feedback: {
        Row: {
          id: string
          item_id: string
          kind: string
          payload: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          kind: string
          payload: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          kind?: string
          payload?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sentinel_sim_trades: {
        Row: {
          client_key: string
          contract: string
          created_at: string
          danger: number | null
          detail: Json | null
          direction_score: number | null
          duration_ticks: number | null
          entry_at: string | null
          entry_condition: string | null
          entry_digit: number | null
          id: string
          pnl: number | null
          regime: string | null
          resolution_digit: number | null
          resolved_at: string | null
          result: string | null
          setup_score: number | null
          stake: number | null
          symbol: string
          user_id: string
        }
        Insert: {
          client_key: string
          contract: string
          created_at?: string
          danger?: number | null
          detail?: Json | null
          direction_score?: number | null
          duration_ticks?: number | null
          entry_at?: string | null
          entry_condition?: string | null
          entry_digit?: number | null
          id?: string
          pnl?: number | null
          regime?: string | null
          resolution_digit?: number | null
          resolved_at?: string | null
          result?: string | null
          setup_score?: number | null
          stake?: number | null
          symbol: string
          user_id: string
        }
        Update: {
          client_key?: string
          contract?: string
          created_at?: string
          danger?: number | null
          detail?: Json | null
          direction_score?: number | null
          duration_ticks?: number | null
          entry_at?: string | null
          entry_condition?: string | null
          entry_digit?: number | null
          id?: string
          pnl?: number | null
          regime?: string | null
          resolution_digit?: number | null
          resolved_at?: string | null
          result?: string | null
          setup_score?: number | null
          stake?: number | null
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          barrier: string | null
          closed_at: string | null
          contract_id: string
          contract_type: string
          created_at: string
          deriv_account_id: string | null
          duration: number | null
          duration_unit: string | null
          entry_price: number | null
          exit_price: number | null
          id: string
          is_virtual: boolean
          loginid: string | null
          meta: Json | null
          payout: number | null
          profit: number | null
          purchased_at: string | null
          stake: number | null
          status: string
          symbol: string
          user_id: string
        }
        Insert: {
          barrier?: string | null
          closed_at?: string | null
          contract_id: string
          contract_type: string
          created_at?: string
          deriv_account_id?: string | null
          duration?: number | null
          duration_unit?: string | null
          entry_price?: number | null
          exit_price?: number | null
          id?: string
          is_virtual?: boolean
          loginid?: string | null
          meta?: Json | null
          payout?: number | null
          profit?: number | null
          purchased_at?: string | null
          stake?: number | null
          status?: string
          symbol: string
          user_id: string
        }
        Update: {
          barrier?: string | null
          closed_at?: string | null
          contract_id?: string
          contract_type?: string
          created_at?: string
          deriv_account_id?: string | null
          duration?: number | null
          duration_unit?: string | null
          entry_price?: number | null
          exit_price?: number | null
          id?: string
          is_virtual?: boolean
          loginid?: string | null
          meta?: Json | null
          payout?: number | null
          profit?: number | null
          purchased_at?: string | null
          stake?: number | null
          status?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          alert_sound: boolean
          max_daily_loss: number | null
          max_stake: number | null
          min_confidence: number
          risk_profile: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_sound?: boolean
          max_daily_loss?: number | null
          max_stake?: number | null
          min_confidence?: number
          risk_profile?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_sound?: boolean
          max_daily_loss?: number | null
          max_stake?: number | null
          min_confidence?: number
          risk_profile?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
