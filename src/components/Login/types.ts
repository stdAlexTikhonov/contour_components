interface Props {
  selected: boolean | null;
}

export interface LinkStateToProps {
  logged_in: boolean;
}

export interface LinkDispatchProps {
  handleLogin: (login: string, password: string) => void;
}

export type IProps = Props & LinkDispatchProps & LinkStateToProps;
