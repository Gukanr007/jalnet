export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          area: string
          city: string
          condition: Database["public"]["Enums"]["asset_condition"] | null
          created_at: string | null
          created_by: string | null
          id: string
          installation_date: string | null
          last_maintenance_date: string | null
          latitude: number
          longitude: number
          maintenance_cycle_months: number | null
          name: string
          next_maintenance_date: string | null
          specifications: Json | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string | null
        }
        Insert: {
          area: string
          city: string
          condition?: Database["public"]["Enums"]["asset_condition"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance_date?: string | null
          latitude: number
          longitude: number
          maintenance_cycle_months?: number | null
          name: string
          next_maintenance_date?: string | null
          specifications?: Json | null
          type: Database["public"]["Enums"]["asset_type"]
          updated_at?: string | null
        }
        Update: {
          area?: string
          city?: string
          condition?: Database["public"]["Enums"]["asset_condition"] | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance_date?: string | null
          latitude?: number
          longitude?: number
          maintenance_cycle_months?: number | null
          name?: string
          next_maintenance_date?: string | null
          specifications?: Json | null
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          cost_per_unit: number | null
          created_at: string | null
          id: string
          minimum_stock: number | null
          name: string
          supplier: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category: string
          cost_per_unit?: number | null
          created_at?: string | null
          id?: string
          minimum_stock?: number | null
          name: string
          supplier?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          cost_per_unit?: number | null
          created_at?: string | null
          id?: string
          minimum_stock?: number | null
          name?: string
          supplier?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_stock: {
        Row: {
          area: string
          city: string
          created_at: string | null
          current_stock: number | null
          id: string
          item_id: string | null
          last_restocked_by: string | null
          last_restocked_date: string | null
          updated_at: string | null
        }
        Insert: {
          area: string
          city: string
          created_at?: string | null
          current_stock?: number | null
          id?: string
          item_id?: string | null
          last_restocked_by?: string | null
          last_restocked_date?: string | null
          updated_at?: string | null
        }
        Update: {
          area?: string
          city?: string
          created_at?: string | null
          current_stock?: number | null
          id?: string
          item_id?: string | null
          last_restocked_by?: string | null
          last_restocked_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_stock_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_reports: {
        Row: {
          area: string
          assigned_to: string | null
          city: string
          created_at: string | null
          description: string
          id: string
          issue_type: Database["public"]["Enums"]["issue_type"]
          latitude: number
          longitude: number
          priority: Database["public"]["Enums"]["task_priority"] | null
          reporter_name: string
          reporter_phone: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["issue_status"] | null
          updated_at: string | null
        }
        Insert: {
          area: string
          assigned_to?: string | null
          city: string
          created_at?: string | null
          description: string
          id?: string
          issue_type: Database["public"]["Enums"]["issue_type"]
          latitude: number
          longitude: number
          priority?: Database["public"]["Enums"]["task_priority"] | null
          reporter_name: string
          reporter_phone?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          updated_at?: string | null
        }
        Update: {
          area?: string
          assigned_to?: string | null
          city?: string
          created_at?: string | null
          description?: string
          id?: string
          issue_type?: Database["public"]["Enums"]["issue_type"]
          latitude?: number
          longitude?: number
          priority?: Database["public"]["Enums"]["task_priority"] | null
          reporter_name?: string
          reporter_phone?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          area: string
          city: string
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          zoom_level: number | null
        }
        Insert: {
          area: string
          city: string
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          zoom_level?: number | null
        }
        Update: {
          area?: string
          city?: string
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          zoom_level?: number | null
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          actual_hours: number | null
          asset_id: string | null
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          scheduled_date: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          asset_id?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          scheduled_date?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          asset_id?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          scheduled_date?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bill_id: string | null
          created_at: string | null
          id: string
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: string | null
          transaction_id: string
          water_id: string
        }
        Insert: {
          amount: number
          bill_id?: string | null
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: string | null
          transaction_id: string
          water_id: string
        }
        Update: {
          amount?: number
          bill_id?: string | null
          created_at?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: string | null
          transaction_id?: string
          water_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "water_bills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_area: string | null
          assigned_city: string | null
          created_at: string | null
          email: string
          employee_id: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          assigned_area?: string | null
          assigned_city?: string | null
          created_at?: string | null
          email: string
          employee_id?: string | null
          full_name: string
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          assigned_area?: string | null
          assigned_city?: string | null
          created_at?: string | null
          email?: string
          employee_id?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      restock_tasks: {
        Row: {
          area: string
          assigned_by: string | null
          assigned_to: string | null
          city: string
          completed_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          item_id: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          requested_quantity: number
          status: Database["public"]["Enums"]["task_status"] | null
          updated_at: string | null
        }
        Insert: {
          area: string
          assigned_by?: string | null
          assigned_to?: string | null
          city: string
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requested_quantity: number
          status?: Database["public"]["Enums"]["task_status"] | null
          updated_at?: string | null
        }
        Update: {
          area?: string
          assigned_by?: string | null
          assigned_to?: string | null
          city?: string
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          item_id?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requested_quantity?: number
          status?: Database["public"]["Enums"]["task_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restock_tasks_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      water_bills: {
        Row: {
          amount: number
          bill_month: number
          bill_year: number
          created_at: string | null
          due_date: string
          id: string
          late_fee: number | null
          status: Database["public"]["Enums"]["bill_status"] | null
          total_amount: number | null
          updated_at: string | null
          water_connection_id: string | null
          water_id: string
        }
        Insert: {
          amount: number
          bill_month: number
          bill_year: number
          created_at?: string | null
          due_date: string
          id?: string
          late_fee?: number | null
          status?: Database["public"]["Enums"]["bill_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          water_connection_id?: string | null
          water_id: string
        }
        Update: {
          amount?: number
          bill_month?: number
          bill_year?: number
          created_at?: string | null
          due_date?: string
          id?: string
          late_fee?: number | null
          status?: Database["public"]["Enums"]["bill_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          water_connection_id?: string | null
          water_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_bills_water_connection_id_fkey"
            columns: ["water_connection_id"]
            isOneToOne: false
            referencedRelation: "water_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      water_connections: {
        Row: {
          address: string
          area: string
          city: string
          connection_date: string | null
          created_at: string | null
          household_name: string
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          monthly_rate: number | null
          tap_asset_id: string | null
          updated_at: string | null
          water_id: string
        }
        Insert: {
          address: string
          area: string
          city: string
          connection_date?: string | null
          created_at?: string | null
          household_name: string
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          monthly_rate?: number | null
          tap_asset_id?: string | null
          updated_at?: string | null
          water_id: string
        }
        Update: {
          address?: string
          area?: string
          city?: string
          connection_date?: string | null
          created_at?: string | null
          household_name?: string
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          monthly_rate?: number | null
          tap_asset_id?: string | null
          updated_at?: string | null
          water_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_connections_tap_asset_id_fkey"
            columns: ["tap_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_condition: "good" | "average" | "poor" | "critical"
      asset_type: "pipe" | "pump" | "tap" | "valve" | "meter" | "tank"
      bill_status: "paid" | "pending" | "overdue"
      issue_status:
        | "reported"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "closed"
      issue_type:
        | "leakage"
        | "broken_pipe"
        | "no_water"
        | "low_pressure"
        | "contamination"
        | "other"
      payment_method: "upi" | "card" | "net_banking" | "cash"
      task_priority: "low" | "medium" | "high" | "critical"
      task_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      user_role: "admin" | "worker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_condition: ["good", "average", "poor", "critical"],
      asset_type: ["pipe", "pump", "tap", "valve", "meter", "tank"],
      bill_status: ["paid", "pending", "overdue"],
      issue_status: [
        "reported",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
      ],
      issue_type: [
        "leakage",
        "broken_pipe",
        "no_water",
        "low_pressure",
        "contamination",
        "other",
      ],
      payment_method: ["upi", "card", "net_banking", "cash"],
      task_priority: ["low", "medium", "high", "critical"],
      task_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      user_role: ["admin", "worker"],
    },
  },
} as const
