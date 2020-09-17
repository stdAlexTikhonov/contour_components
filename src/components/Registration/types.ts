interface Props {
  // history: any;
}

export type IProps = Props & LinkDispatchProps;

export interface LinkDispatchProps {
  handleRegister: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined,
    firstname: HTMLInputElement | undefined,
    surname: HTMLInputElement | undefined,
    email: HTMLInputElement | undefined
  ) => void;
}
