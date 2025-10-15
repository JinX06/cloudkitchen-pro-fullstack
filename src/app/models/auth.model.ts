export interface AuthUser {
  userId: string;
  fullname: string;
  email: string;
  phone: string;
  role: 'admin' | 'chef' | 'manager';
}

export interface AuthResponse {
  user: AuthUser;
}
