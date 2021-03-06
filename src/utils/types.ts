export interface Common {
  method: string;
  session?: string;
  language?: string;
}

//Working with user
export interface Login {
  user: string;
  password: string;
}

export interface Register {
  login: string;
  password: string;
  firstName: string;
  surName: string;
  email: string;
}

//Working with data
export interface DataForQuery extends Common {
  layout?: string;
  caption?: string;
  solution?: string;
  project?: string;
  folder?: string;
  p_folder?: string; //project folder
  report?: string;
  type?: string | null;
  slice?: string;
  view?: string;
  code?: string; //filter code
  filter?: string;
  visibleFacts?: Array<string>;
  facts?: Array<string>;
  rows?: Array<string>;
  columns?: Array<string>;
  filters?: Array<string>;
  attributes?: Array<string>;
  cubeSession?: string;
  full?: boolean;
  format?: string;
  pageSetup?: string;
  isUser?: boolean;
  extent?: Array<number>;
  width?: number;
  height?: number;
}

export type ApiTypes = DataForQuery | Login | Register | Common;
