interface Props {
  // history: any;
}

export type IProps = Props & LinkDispatchProps;

export interface LinkDispatchProps {
  handleRegister: (
    login: string,
    password: string,
    firstname: string,
    surname: string,
    email: string
  ) => void;
}
