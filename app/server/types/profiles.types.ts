export type BaseResponse = {
  status?: number;
  statusCode?: number;
  success?: boolean;
  error?: string;
  message?: string;
}

export type RegisterUserResponse = BaseResponse & {
  id?: number;
}

export type LogUserResponse = BaseResponse & {
  has_username?: boolean;
  token?: string;
  user?: object;
}

export type GetUserInfoResponse = BaseResponse & {
  has_username?: boolean;
  token?: string;
  user?: object;
}