export interface authedUserType {
  logged_in: boolean;
  session: string | null;
}

export interface languageType {
  current: string;
  [index: string]: string;
}

export type breadcrumb = {
  caption: string;
  link: string;
};

export type AppReducers = authedUserType | languageType;
