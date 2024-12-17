export type UserProfile = {
    email: string;
    username: string;
    password: string;
  }
  
export type RegisterUserResponse = {
  status?: number;
  statusCode?: number;
  success?: boolean;
  error?: string;
  message?: string;
}