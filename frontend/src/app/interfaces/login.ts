import { UserResponse } from "./user";

export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; user:UserResponse}
export interface SignUpRequest { name: string; email: string; password: string; }
