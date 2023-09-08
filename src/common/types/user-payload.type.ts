export interface JwtUserPayload {
  id: number;
  name: string;
  email: string;
  profile_url: string;
  created_at: Date;
}

export interface GoogleUserPayload {
  email: string;
  name: string;
  profile_url: string;
  accessToken: string;
  refreshToken: string;
}
