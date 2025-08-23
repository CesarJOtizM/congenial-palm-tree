export interface IUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
}

export interface IUserCreate {
  email: string;
  password: string;
  fullName: string;
}

export interface IUserUpdate {
  email?: string;
  fullName?: string;
  isActive?: boolean;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithTokens extends IUserResponse {
  accessToken: string;
  refreshToken: string;
}
