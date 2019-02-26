import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;
interface ResetState {
  password: string;
  confirmPassword: string;
}

interface ResetProps {
  resetToken: string;
}

export default class Reset extends React.Component<ResetProps, ResetState> {
  state: ResetState = {
    password: "",
    confirmPassword: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value } as any);
  };

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          ...this.state
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading, called }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await reset();
                this.setState({
                  password: "",
                  confirmPassword: ""
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Your Password</h2>
                <Error error={error} />
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confimPassword">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>

                <button type="submit">Reset your Password!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}
