// Supabase generated-like types for our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          category: string;
          city: string | null;
          owner: string; // uuid
          created_at: string; // timestamptz as ISO string
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          city?: string | null;
          owner: string; // must be auth.uid()
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          city?: string | null;
          owner?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "businesses_owner_fkey";
            columns: ["owner"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};


