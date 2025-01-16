export type decodedToken = {
  id: string;
  email: string;
  role: string;
};

export interface UserToken {
  token: string;
  user: {
    id: string;
    email: string;
    rol: string;
  };
}

export interface Session {
  id: string;
  data: UserToken;
}
