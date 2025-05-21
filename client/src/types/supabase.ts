export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accessories: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fabrics: {
        Row: {
          id: string
          name: string
          description: string | null
          price_per_meter: number
          image_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_per_meter: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_per_meter?: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      measurements: {
        Row: {
          id: string
          user_id: string
          height: number
          chest: number
          waist: number
          hips: number
          inseam: number
          shoulders: number
          sleeves: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          height: number
          chest: number
          waist: number
          hips: number
          inseam: number
          shoulders: number
          sleeves: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          height?: number
          chest?: number
          waist?: number
          hips?: number
          inseam?: number
          shoulders?: number
          sleeves?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          fabric_id: string
          measurement_id: string
          quantity: number
          unit_price: number
          accessories: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          fabric_id: string
          measurement_id: string
          quantity?: number
          unit_price: number
          accessories?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          fabric_id?: string
          measurement_id?: string
          quantity?: number
          unit_price?: number
          accessories?: Json
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total_price: number
          shipping_address: string
          contact_phone: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total_price: number
          shipping_address: string
          contact_phone: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total_price?: number
          shipping_address?: string
          contact_phone?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patterns: {
        Row: {
          id: string
          product_id: string
          name: string
          description: string | null
          price: number
          file_url: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          description?: string | null
          price: number
          file_url: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          description?: string | null
          price?: number
          file_url?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          base_price: number
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          base_price: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          base_price?: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          comment: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          comment?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}