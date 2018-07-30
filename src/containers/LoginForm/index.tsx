import React from 'react';
import styled from '../../theme';
import { Button, FormField } from '../../components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  min-height: 300px;
  margin: 10px;
`;
const Header = styled.div`
  text-align: center;
`;
const ActionButton = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;
export interface LoginFormProps {
  handleLogin: (username: string, password: string) => void;
}
interface State {
  readonly username: string;
  readonly password: string;
}
export default class LoginForm extends React.Component<LoginFormProps, State> {
  state = {
    username: '',
    password: '',
  }
  handleChange = (type: keyof State) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [type]: e.target.value,
    } as Pick<State, keyof State>);
  }
  handleLogin = () => {
    const { username, password } = this.state;
    this.props.handleLogin(username, password);
  }
  render() {
    const { username, password } = this.state;
    return (
      <div>
        <Header>LOGIN</Header>
        <Container>
          <FormField name="username" label="username" onChange={this.handleChange('username')} value={username} />
          <FormField type="password" name="password" label="PASSWORD" onChange={this.handleChange('password')} value={password} />
        </Container>
        <ActionButton>
          <Button onClick={this.handleLogin}>
            Login
          </Button>
        </ActionButton>
      </div>
    )
  }
}
