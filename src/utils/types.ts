export interface Common {
  method: string;
  session: string;
}

//Working with user
export interface Login {
  user: string;
  password: string;
}

export interface Register extends Login {
  firstName: string;
  surName: string;
  email: string;
}

//Working with data
export interface DataForQuery extends Common {
  language?: string;
  solution?: string;
  project?: string;
  report?: string;
  type?: string;
  slice?: string;
  view?: string;
  code?: string; //filter code
}

export type ApiTypes = DataForQuery | Login | Register | Common;
