export type RegisterUserResponse = {
  status?: number;
  statusCode?: number;
  success?: boolean;
  error?: string;
  message?: string;
  id?: number;
}

export type LogUserResponse = {
  status?: number;
  statusCode?: number;
  has_username?: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  token?: string;
  user?: object;
}

export type GetUserInfoResponse = {
  status?: number;
  statusCode?: number;
  has_username?: boolean;
  success?: boolean;
  error?: string;
  message?: string;
  token?: string;
  user?: object;
}