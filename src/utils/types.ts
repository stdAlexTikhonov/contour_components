export interface Common {
  session: string;
  method: string;
}

//Use Common to get Languages

//Working with user
export interface Login extends Common {
  user: string;
  password: string;
}

export interface Register extends Login {
  firstName: string;
  surName: string;
  email: string;
}

//Working with data
export interface Data_for_query extends Common {
  language?: string;
  solution?: string;
  project?: string;
  report?: string;
  type?: string;
  slice?: string;
  view?: string;
  code?: string; //filter code
}

//Working with session
export interface SaveSession {
  session: string;
}
