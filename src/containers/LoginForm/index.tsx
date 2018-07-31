import React from 'react';
import styled from '../../theme';
import { IUser } from '../../interfaces';
import { Button, Form, FormField } from '../../components';
import * as authApi from '../../api/auth';
import { jwt, str } from '../../utils';

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
const LinkWrapper = styled.div`
  text-align: right;
`
const Link = styled.a`
  font-size: 0.9rem;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.64);
  &:hover {
    color: rgba(0, 0, 0, 0.94);
    transition: color 0.2s;
  }
`;
export interface LoginFormProps {
  goToSignup: () => void;
  handleLoginSuccess: (userData: IUser) => void;
}
interface State {
  readonly username: string;
  readonly password: string;
  readonly error: string;
  readonly isLoading: boolean;
}
export default class LoginForm extends React.Component<LoginFormProps, State> {
  state = {
    username: '',
    password: '',
    error: '',
    isLoading: false,
  }
  handleChange = (type: keyof State) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [type]: e.target.value,
      error: '',
    } as Pick<State, 'username' | 'password' | 'error'>);
  }
  handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.handleLogin();
    }
  }
  handleLogin = () => {
    const { username, password } = this.state;
    if (str.isEmpty(username) || str.isEmpty(password)) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    authApi.login(username, password)
      .then(res => {
        const { token, ...userData } = res.data;
        jwt.setToken(token);
        this.props.handleLoginSuccess(userData);
      })
      .catch(err => {
        const { error } = err.response.data;
        this.setState({
          isLoading: false,
          error,
        });
      });
  }
  render() {
    const { username, password, error, isLoading } = this.state;
    return (
      <div>
        <Form header="LOGIN" onKeyPress={this.handleEnter}>
          <>
            <FormField
              name="username"
              label="username"
              onChange={this.handleChange('username')}
              autoComplete="username"
              value={username}
            />
            <FormField
              type="password"
              name="password"
              label="password"
              autoComplete="current-password"
              onChange={this.handleChange('password')}
              value={password}
            />
            <Message>{error}</Message>
            <LinkWrapper>
              <Link onClick={this.props.goToSignup}>Sign up</Link>
            </LinkWrapper>
          </>
        </Form>
        <ActionButton>
          <Button onClick={this.handleLogin} disabled={isLoading}>
            Login
          </Button>
        </ActionButton>
      </div>
    )
  }
}
