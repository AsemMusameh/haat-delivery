export type Role = "employee" | "supervisor" | "manager" | "admin";
export type Priority = "normal" | "important" | "urgent";
export type AnnouncementStatus = "draft" | "scheduled" | "published" | "archived";

export interface Department { id: string; name: string; color?: string; }
export interface Profile {
  id: string; employee_id: string; full_name: string; email: string; avatar_url?: string;
  department_id: string; department?: Department; role: Role; is_active: boolean;
  birth_date?: string; hire_date?: string; last_sign_in_at?: string; unread_count?: number;
}
export interface Attachment { id: string; announcement_id: string; file_name: string; file_url: string; file_type: string; file_size: number; }
export interface Announcement {
  id: string; title: string; body: string; priority: Priority; status: AnnouncementStatus;
  author_id: string; author?: Pick<Profile, "full_name" | "avatar_url">; published_at: string;
  scheduled_at?: string; expires_at?: string; is_pinned: boolean; requires_acknowledgement: boolean;
  target_label?: string; read_count: number; recipient_count: number; is_read?: boolean;
  read_at?: string; is_bookmarked?: boolean; attachments?: Attachment[];
}
export interface NotificationItem { id: string; title: string; body: string; is_read: boolean; created_at: string; announcement_id?: string; link?: string; kind?: "announcement"|"community_post"|"mention"|"request"; }
