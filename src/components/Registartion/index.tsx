import { connect } from "react-redux";
import { userRegister } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { IProps, LinkDispatchProps } from "./types";
import { RegistrationComponent } from "./RegistrationComponent";

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
): LinkDispatchProps => ({
  handleRegister: async (
    login: string,
    password: string,
    firstname: string,
    surname: string,
    email: string
  ) => {
    const data = await userRegister({
      login: login,
      password: password,
      firstName: firstname,
      surName: surname,
      email: email,
    });

    // if (data.success) props.history.push("/login");
  },
});

export const Registration = connect(
  null,
  mapDispatchToProps
)(RegistrationComponent);
