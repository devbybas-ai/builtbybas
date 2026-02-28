export type UserRole = "owner" | "team" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionPayload {
  sessionId: string;
  userId: string;
  role: UserRole;
  expiresAt: number;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
