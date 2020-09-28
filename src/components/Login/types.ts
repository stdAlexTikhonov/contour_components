interface Props {
  // history: any;
}

export interface LinkStateToProps {
  logged_in: boolean;
}

export interface LinkDispatchProps {
  handleLogin: (login: string, password: string) => void;
}

export type IProps = LinkDispatchProps & LinkStateToProps;
