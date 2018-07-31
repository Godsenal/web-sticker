import React from 'react';
import debounce from 'lodash/debounce';
import styled from '../../theme';
import { IUser } from '../../interfaces';
import { Button, Form, FormField } from '../../components';
import * as authApi from '../../api/auth';
import { str } from '../../utils';

const ActionButton = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;
const Message = styled.div`
  margin-top: 5px;
  min-height: 10px;
  color: #F23C57;
  font-size: 1rem;
  font-weight: 600;

  text-align: center;
`;
export interface SignupFormProps {
  handleSignupSuccess: (username: string) => void;
}
interface Validation {
  username: RegExp,
  password: RegExp,
}
const VALIDATION_REG: Validation = {
  username: /^[A-Za-z]{1}[A-Za-z0-9]{2,19}$/,
  password: /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
}
const MESSAGE = {
  username: 'Username can only include letters and numbers.',
  password: 'Password must be at least 8 characters and include both numbers and letters.',
}
interface SignupField {
  readonly username: string;
  readonly password: string;
}
interface State extends SignupField{
  readonly error: string;
  readonly isLoading: boolean;
  readonly valid: {
    [key: string]: {
      isValid?: boolean,
      message?: string,
    }
  }
}
export default class SignupForm extends React.Component<SignupFormProps, State> {
  state = {
    username: '',
    password: '',
    error: '',
    isLoading: false,
    valid: {
      username: {
        message: '',
        isValid: false,
      },
      password: {
        message: '',
        isValid: false,
      },
    }
  }
  handleChange = (type: keyof SignupField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [type]: e.target.value,
      error: '',
    } as Pick<State, 'username' | 'password' | 'error'>);
    this.checkValid(type, e.target.value);
  }
  checkValid = debounce((type: keyof SignupField, value: string) => {
    const regex = VALIDATION_REG[type];
    if (str.isEmpty(value)) {
      this.setState({
        valid: {
          ...this.state.valid,
          [type]: {
            isValid: false,
            message: '',
          },
        },
      });
      return;
    }
    if (!regex.test(value)) {
      this.setState({
        valid: {
          ...this.state.valid,
          [type]: {
            isValid: false,
            message: MESSAGE[type],
          },
        },
      });
      return;
    }
    this.setState({
      valid: {
        ...this.state.valid,
        [type]: {
          isValid: true,
          message: '',
        },
      },
    })
  }, 300);
  handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.handleSignup();
    }
  }
  handleSignup = () => {
    const { username, password } = this.state;
    if (str.isEmpty(username) || str.isEmpty(password)) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    authApi.signup(username, password)
      .then(res => {
        const { username } = res.data;
        this.props.handleSignupSuccess(username);
      })
      .catch(err => {
        const { type, error } = err.response.data;
        if (type === 'username') { // username which is already in use.
          this.setState({
            isLoading: false,
            valid: {
              ...this.state.valid,
              username: {
                isValid: false,
                message: error,
              }
            }
          });
          return;
        }
        else {
          this.setState({
            isLoading: false,
            error,
          });
        }
      });
  }
  render() {
    const { username, password, error, isLoading, valid } = this.state;
    const validToSignup = valid.username.isValid && valid.password.isValid;
    return (
      <div>
        <Form header="SIGNUP" onKeyPress={this.handleEnter}>
          <>
            <FormField
              name="username"
              label="username"
              onChange={this.handleChange('username')}
              isValid={valid.username.isValid}
              message={valid.username.message}
              value={username}
            />
            <FormField
              type="password"
              name="password"
              label="password"
              onChange={this.handleChange('password')}
              isValid={valid.password.isValid}
              message={valid.password.message}
              value={password}
            />
            <Message>{error}</Message>
          </>
        </Form>
        <ActionButton>
          <Button onClick={this.handleSignup} disabled={isLoading || !validToSignup}>
            Signup
          </Button>
        </ActionButton>
      </div>
    )
  }
}
