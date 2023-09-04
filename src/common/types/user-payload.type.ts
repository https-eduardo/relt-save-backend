export interface JwtUserPayload {
  id: number;
  name: string;
  email: string;
  profileUrl: string;
}

export interface GoogleUserPayload {
  email: string;
  name: string;
  profile_url: string;
  accessToken: string;
  refreshToken: string;
}
