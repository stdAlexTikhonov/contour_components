interface Props {
  // history: any;
}

export interface LinkStateToProps {
  logged_in: boolean;
}

export interface LinkDispatchProps {
  handleLogin: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => void;
}

export type IProps = LinkDispatchProps & LinkStateToProps;
