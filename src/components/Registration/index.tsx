import { connect } from "react-redux";
import { userRegister } from "../../utils/api";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";
import { IProps, LinkDispatchProps } from "./types";
import { RegistrationFormComponent } from "./RegistrationFormComponent";

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  props: IProps
): LinkDispatchProps => ({
  handleRegister: async (
    login: HTMLInputElement | undefined,
    password: HTMLInputElement | undefined,
    firstname: HTMLInputElement | undefined,
    surname: HTMLInputElement | undefined,
    email: HTMLInputElement | undefined
  ) => {
    const data = await userRegister({
      user: login?.value!,
      password: password?.value!,
      firstName: firstname?.value!,
      surName: surname?.value!,
      email: surname?.value!,
    });

    if (data.success) props.history.push("/login");
  },
});

export const RegistrationForm = connect(
  null,
  mapDispatchToProps
)(RegistrationFormComponent);
