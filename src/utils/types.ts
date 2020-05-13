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

export interface Register extends Login {
  firstName: string;
  surName: string;
  email: string;
}

//Working with data
export interface DataForQuery extends Common {
  solution?: string;
  project?: string;
  folder?: string;
  report?: string;
  type?: string;
  slice?: string;
  view?: string;
  code?: string; //filter code
}

export type ApiTypes = DataForQuery | Login | Register | Common;
