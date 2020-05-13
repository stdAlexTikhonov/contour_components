interface Props {
  history: any;
}

export type IProps = Props & LinkDispatchProps & LinkStateToProps;

export interface LinkStateToProps {
  logged_in: boolean;
}

export interface LinkDispatchProps {
  handleLogin: (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined
  ) => void;
}
