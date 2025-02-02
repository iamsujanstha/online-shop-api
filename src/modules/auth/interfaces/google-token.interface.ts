export interface GoogleToken {
  access_token: string;
  id_token: string;
  expires_in: number;
  refreshToken: string;
  scope: string;
  token_type: string;
}
