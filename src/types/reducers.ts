export interface authedUserType {
  logged_in: boolean;
  session: string | null;
}

export type AppReducers = authedUserType;
