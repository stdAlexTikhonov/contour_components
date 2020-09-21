interface Props {
  // history: any;
}

export interface LinkStateToProps {
  logged_in: boolean;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface LinkDispatchProps {
  handleLogin: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => void;
}

export type IProps = LinkDispatchProps & LinkStateToProps;
