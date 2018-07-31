import React from 'react';
import { Modal, LoginForm, SignupForm } from '..';
import { AuthContext } from '../../contexts';
import { IUser } from '../../interfaces';
import { jwt } from '../../utils';
import * as authApi from '../../api/auth';

export interface AuthProviderProps {
  children: React.ReactChild;
}
interface State {
  isLoggedIn: boolean;
  show: string;
  userData: IUser | {};
}
export default class AuthProvider extends React.Component<AuthProviderProps, State> {
  state = {
    isLoggedIn: false,
    userData: {},
    show: '',
  }
  componentDidMount() {
    const currentToken = jwt.getToken();
    if (!currentToken) {
      return;
    }
    jwt.setToken(currentToken);
    authApi.verify()
      .then(res => {
        const userData = res.data;
        this.updateUserData(userData);
      })
  }
  handleLoginSuccess = (userData: IUser) => {
    this.updateUserData(userData);
    this.closeModal();
  }
  handleSignupSuccess = (username: string) => {
    this.showModal('login');
  }
  updateUserData = (userData: IUser) => {
    this.setState({
      isLoggedIn: true,
      userData: userData,
    });
  }
  showModal = (type: string) => {
    this.setState(state => ({
      show: type,
    }));
  }
  closeModal = () => {
    this.setState(state => ({
      show: '',
    }));
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
      showLoginModal: () => this.showModal('login'),
      showSignupModal: () => this.showModal('signup'),
      logout: this.logout,
    }
    const { show } = this.state;
    return (
      <AuthContext.Provider value={provideValue}>
        {this.props.children}
        <Modal show={show.length !== 0} handleClose={this.closeModal}>
          {
            show === 'login' ? (
              <LoginForm
                handleLoginSuccess={this.handleLoginSuccess}
                goToSignup={() => this.showModal('signup')}
              />
            ) : (
              <SignupForm handleSignupSuccess={this.handleSignupSuccess} />
            )
          }
        </Modal>
      </AuthContext.Provider>
    )
  }
}