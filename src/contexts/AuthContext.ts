import { createContext } from 'react';
import { IUser } from '../interfaces';

export interface AuthContextType  {
  isLoggedIn: boolean;
  userData?: IUser;
  showLoginModal: () => void;
  logout: () => void;
}
const defaultValue = {
  isLoggedIn: false,
  showLoginModal: () => {},
  logout: () => {},
}
const AuthContext = createContext(defaultValue);
export default AuthContext;
