import type { User } from "./User";

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  dob?: string | null;
  gender?: "m" | "f" | "o";
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthTokens & {
    user: User;
  };
}


export interface UserResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
    };
    
}
// export interface User {
//   id: number;
//   email: string;
//   role: "super_admin" | "artist_manager" | "artist";
// }