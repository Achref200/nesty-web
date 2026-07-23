/** Minimal generated-style types for the Nesty schema. */

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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "seeker" | "host" | "partner";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "seeker" | "host" | "partner";
          avatar_url?: string | null;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          role?: "seeker" | "host" | "partner";
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          city: string;
          address: string | null;
          price_per_month: number;
          currency: string;
          type: "entire_place" | "private_room" | "shared_room";
          rental_term: "short_term" | "long_term";
          audience: string[];
          bedrooms: number;
          bathrooms: number;
          area_sqm: number;
          cover_image: string | null;
          gallery: string[];
          rooms: Json;
          amenities: string[];
          rating: number;
          review_count: number;
          host_name: string | null;
          description: string | null;
          tour_3d_url: string | null;
          is_superhost: boolean;
          available_from: string | null;
          bills_included: boolean;
          flatmates: number;
          latitude: number | null;
          longitude: number | null;
          status: string;
          tags: string[];
          property_type: string | null;
          max_guests: number;
          district: string | null;
          contact_phone: string | null;
          house_rules: Json;
          pricing: Json;
          booking_conditions: Json;
          wizard_step: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          host_id: string;
          title: string;
          city: string;
          address?: string | null;
          price_per_month?: number;
          currency?: string;
          type?: "entire_place" | "private_room" | "shared_room";
          rental_term?: "short_term" | "long_term";
          audience?: string[];
          bedrooms?: number;
          bathrooms?: number;
          area_sqm?: number;
          cover_image?: string | null;
          gallery?: string[];
          rooms?: Json;
          amenities?: string[];
          host_name?: string | null;
          description?: string | null;
          available_from?: string | null;
          bills_included?: boolean;
          flatmates?: number;
          latitude?: number | null;
          longitude?: number | null;
          status?: string;
          tags?: string[];
          property_type?: string | null;
          max_guests?: number;
          district?: string | null;
          contact_phone?: string | null;
          house_rules?: Json;
          pricing?: Json;
          booking_conditions?: Json;
          wizard_step?: number;
        };
        Update: {
          title?: string;
          city?: string;
          address?: string | null;
          price_per_month?: number;
          type?: "entire_place" | "private_room" | "shared_room";
          rental_term?: "short_term" | "long_term";
          audience?: string[];
          bedrooms?: number;
          bathrooms?: number;
          area_sqm?: number;
          cover_image?: string | null;
          gallery?: string[];
          amenities?: string[];
          description?: string | null;
          available_from?: string | null;
          status?: string;
          tags?: string[];
          property_type?: string | null;
          max_guests?: number;
          district?: string | null;
          contact_phone?: string | null;
          house_rules?: Json;
          pricing?: Json;
          booking_conditions?: Json;
          wizard_step?: number;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          listing_id: string;
          host_id: string | null;
          guest_id: string;
          guest_name: string | null;
          type: "visit" | "stay";
          start_at: string;
          end_at: string | null;
          guests: number;
          status:
            | "pending"
            | "confirmed"
            | "rejected"
            | "cancelled"
            | "expired"
            | "completed";
          note: string | null;
          estimated_total: number | null;
          reference: string | null;
          expires_at: string | null;
          confirmed_at: string | null;
          cancellation_reason: string | null;
          cancelled_by: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          listing_id: string;
          guest_id: string;
          guest_name?: string | null;
          type: "visit" | "stay";
          start_at: string;
          end_at?: string | null;
          guests?: number;
          note?: string | null;
          estimated_total?: number | null;
        };
        Update: {
          status?:
            | "pending"
            | "confirmed"
            | "rejected"
            | "cancelled"
            | "expired"
            | "completed";
          start_at?: string;
          end_at?: string | null;
          guests?: number;
          cancellation_reason?: string | null;
          cancelled_by?: string | null;
        };
        Relationships: [];
      };
      availability_blocks: {
        Row: {
          id: string;
          listing_id: string;
          host_id: string;
          start_date: string;
          end_date: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          listing_id: string;
          host_id: string;
          start_date: string;
          end_date: string;
          reason?: string | null;
        };
        Update: {
          start_date?: string;
          end_date?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      reservation_events: {
        Row: {
          id: string;
          reservation_id: string;
          actor_id: string | null;
          actor_role: string | null;
          event_type: string;
          from_status: string | null;
          to_status: string | null;
          reason: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          reservation_id: string;
          actor_id?: string | null;
          actor_role?: string | null;
          event_type: string;
          from_status?: string | null;
          to_status?: string | null;
          reason?: string | null;
          metadata?: Json;
        };
        Update: { reason?: string | null };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          reservation_id: string | null;
          payload: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          reservation_id?: string | null;
          payload?: Json;
        };
        Update: { read_at?: string | null };
        Relationships: [];
      };
      reservation_incidents: {
        Row: {
          id: string;
          reservation_id: string;
          reporter_id: string;
          type:
            | "conflict"
            | "double_booking"
            | "unavailable"
            | "access"
            | "payment"
            | "damage"
            | "cleaning"
            | "other";
          description: string;
          occurred_on: string;
          status: "created" | "under_review" | "resolved" | "closed";
          estimated_cost: number | null;
          attachments: string[];
          resolution: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          reservation_id: string;
          reporter_id: string;
          type?:
            | "conflict"
            | "double_booking"
            | "unavailable"
            | "access"
            | "payment"
            | "damage"
            | "cleaning"
            | "other";
          description: string;
          occurred_on?: string;
          estimated_cost?: number | null;
          attachments?: string[];
        };
        Update: {
          status?: "created" | "under_review" | "resolved" | "closed";
          resolution?: string | null;
        };
        Relationships: [];
      };
      saved_listings: {
        Row: { user_id: string; listing_id: string; created_at: string };
        Insert: { user_id: string; listing_id: string };
        Update: { user_id?: string; listing_id?: string };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          created_at: string;
        };
        Insert: { email: string; source?: string | null };
        Update: { email?: string; source?: string | null };
        Relationships: [];
      };
      listing_events: {
        Row: {
          id: string;
          listing_id: string;
          host_id: string | null;
          user_id: string | null;
          type: "view" | "save" | "unsave" | "tour" | "reservation";
          created_at: string;
        };
        Insert: {
          listing_id: string;
          type: "view" | "save" | "unsave" | "tour" | "reservation";
          user_id?: string | null;
        };
        Update: { type?: "view" | "save" | "unsave" | "tour" | "reservation" };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          reporter_id: string;
          reporter_role: string | null;
          type: "bug" | "error" | "failure" | "feature_request" | "question" | "other";
          severity: "low" | "medium" | "high" | "critical";
          subject: string;
          description: string | null;
          area: string | null;
          status: "open" | "in_progress" | "resolved" | "closed";
          assignee_id: string | null;
          attachments: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          reporter_id: string;
          reporter_role?: string | null;
          type?: "bug" | "error" | "failure" | "feature_request" | "question" | "other";
          severity?: "low" | "medium" | "high" | "critical";
          subject: string;
          description?: string | null;
          area?: string | null;
          status?: "open" | "in_progress" | "resolved" | "closed";
          attachments?: string[];
        };
        Update: {
          subject?: string;
          description?: string | null;
          status?: "open" | "in_progress" | "resolved" | "closed";
          assignee_id?: string | null;
        };
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          author_id: string;
          author_role: string;
          body: string;
          attachments: string[];
          created_at: string;
        };
        Insert: {
          ticket_id: string;
          author_id: string;
          author_role?: string;
          body: string;
          attachments?: string[];
        };
        Update: { body?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
