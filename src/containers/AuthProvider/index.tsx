import React from 'react';
import { Modal, LoginForm } from '..';
import { AuthContext } from '../../contexts';
import { IUser } from '../../interfaces';
import { jwt } from '../../utils';
import * as authApi from '../../api/auth';

export interface AuthProviderProps {
  children: React.ReactChild;
}
interface State {
  isLoggedIn: boolean;
  show: boolean;
  userData?: IUser | {};
}
export default class AuthProvider extends React.Component<AuthProviderProps, State> {
  state = {
    isLoggedIn: false,
    show: false,
    userData: {},
  }
  showLoginModal = () => {
    this.setState({
      show: true,
    });
  }
  closeLoginModal = () => {
    this.setState({
      show: false,
    })
  }
  login = (username: string, password: string) => {
    authApi.login(username, password)
      .then(res => {
        const { token, username, stickers, theme } = res.data;
        jwt.setToken(token);
        const user = {
          username,
          stickers,
          theme,
        };
        this.setState({
          isLoggedIn: true,
          userData: user,
        });
      });
  }
  logout = () => {
    jwt.removeToken();
    this.setState({
      isLoggedIn: false,
      userData: {},
    });
  }
  render() {
    const provideValue = {
      ...this.state,
      showLoginModal: this.showLoginModal,
      logout: this.logout,
    }
    const { show } = this.state;
    return (
      <AuthContext.Provider value={provideValue}>
        {this.props.children}
        <Modal show={show} handleClose={this.closeLoginModal}>
          <LoginForm handleLogin={this.login} />
        </Modal>
      </AuthContext.Provider>
    )
  }
}