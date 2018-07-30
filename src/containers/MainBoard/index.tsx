import React from 'react';
import debounce from 'lodash/debounce';
import { Board, GlobalSetting } from '../../components';
import { ISticker, IUser } from '../../interfaces';
import { AuthContext } from '../../contexts';
import * as dataApi from '../../api/data';
import styled, { ThemeProvider, theme, darkTheme } from '../../theme';
import { DEFAULT_STICKER } from '../../constants';

const Container = styled.div`
  height: 100%;
  background-color: ${(props: any) => props.isDark ? 'black' : '#fff'};
`;
const FixedButton = styled.div`
  position: absolute;
  border-radius: 50%;
  color: ${props => props.theme.primaryTextColor};
  top: 5px;
  right: 30px;
  font-size: 24px;
  z-index: 1000;
`;
export interface MainBoardProps {
  isLoggedIn: boolean;
  userData: IUser | {};
}
interface State {
  stickers: ISticker[];
  isDark: boolean;
}
interface UpdateSticker {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  contents?: string;
}
class MainBoard extends React.Component<MainBoardProps, State> {
  private _id: number = 0;
  private _updateByMode: (update: { stickers?: ISticker[], isDark?: boolean }) => void;
  state = {
    stickers: [],
    isDark: false,
  }
  componentDidMount() {
    this._updateByMode = this.updateLocalStorage;
    this.setLocalData();
  }
  componentDidUpdate(prevProps: MainBoardProps, prevState: State) {
    // login
    if (this.props.isLoggedIn && prevProps.isLoggedIn !== this.props.isLoggedIn) {
      this.setServerData();
    }
    // logout
    if (!this.props.isLoggedIn && prevProps.isLoggedIn !== this.props.isLoggedIn) {
      this._updateByMode = this.updateLocalStorage;
      this.setLocalData();
    }
    if (prevState.isDark !== this.state.isDark) {
      this._updateByMode({ isDark: this.state.isDark });
    }
    if (prevState.stickers !== this.state.stickers) {
      this._updateByMode({ stickers: this.state.stickers });
    }
  }
  setServerData = () => {
    const { stickers, theme } = this.props.userData as IUser;
    this._updateByMode = this.updateServer;
    if (stickers.length > 0) {
      this._id = stickers[stickers.length - 1].id + 1;
    }
    this.setState({
      stickers,
      isDark: theme === 'dark',
    });
  }
  setLocalData = () => {
    const savedStickers = localStorage.getItem('stickers');
    const savedTheme = localStorage.getItem('theme');
    let savedState = {};
    if (savedStickers) {
      const stickers = JSON.parse(savedStickers);
      if (stickers.length > 0) {
        this._id = stickers[stickers.length - 1].id + 1;
        savedState = {
          ...savedState,
          stickers,
        };
      }
    }
    if(savedTheme) {
      savedState = {
        ...savedState,
        isDark: savedTheme === 'dark',
      }
    }
    this.setState({
      ...this.state,
      ...savedState,
    });
  }
  toggleTheme = () => {
    this.setState(state => ({
      ...state,
      isDark: !state.isDark,
    }));
  }
  calculatePos = (top: number, left: number) => {
    const { innerWidth, innerHeight } = window;
    let newTop = (Math.max(0, top) / innerHeight) * 100;
    let newLeft = (Math.max(0, left) / innerWidth) * 100;
    return {
      newTop,
      newLeft,
    };
  }
  addSticker = (data: { top: number, left: number }) => {
    const { top, left } = data;
    const { newTop, newLeft } = this.calculatePos(top, left);
    const sticker = {
      ...DEFAULT_STICKER,
      id: this._id++,
      top: newTop,
      left: newLeft,
    };
    this.setState(state => ({
      ...state,
      stickers: [...state.stickers, sticker as ISticker],
    }));
  }
  updateSticker = (id: number, update: UpdateSticker) => {
    let newUpdate = update;
    if (update.top && update.left) {
      const { newTop, newLeft } = this.calculatePos(update.top, update.left);
      newUpdate = {
        ...newUpdate,
        top: newTop,
        left: newLeft,
      }
    }
    this.setState(state => ({
      ...state,
      stickers: state.stickers.map(sticker => {
        if (sticker.id !== id) {
          return sticker;
        }
        sticker = { ...sticker, ...newUpdate };
        return sticker;
      }),
    }));
  }
  removeSticker = (id: number) => {
    this.setState(state => ({
      ...state,
      stickers: state.stickers.filter(sticker => sticker.id !== id),
    }));
  }
  updateLocalStorage = (update: { stickers?: ISticker[], isDark?: boolean }) => {
    const { stickers, isDark } = update;
    if (stickers) {
      localStorage.setItem('stickers', JSON.stringify(stickers));
    }
    if (typeof isDark !== 'undefined') {
      localStorage.setItem('theme', isDark ? 'dark' : 'default');
    }
  }
  updateServer = debounce((update: { stickers?: ISticker[], isDark?: boolean }) => {
    const { stickers, isDark } = update;
    if (stickers) {
      dataApi.update('stickers', stickers);
    }
    if (typeof isDark !== 'undefined') {
      dataApi.update('theme', isDark ? 'dark' : 'default');
    }
  }, 1000);
  render() {
    const { stickers, isDark } = this.state;
    return (
      <ThemeProvider theme={isDark ? darkTheme : theme}>
        <Container isDark={isDark}>
          <FixedButton>
            <GlobalSetting
              isDark={isDark}
              toggleTheme={this.toggleTheme}
            />
          </FixedButton>
          <Board
            stickers={stickers}
            addSticker={this.addSticker}
            removeSticker={this.removeSticker}
            updateSticker={this.updateSticker}
          />
        </Container>
      </ThemeProvider>
    )
  }
}

export default (props: {}) => (
  <AuthContext.Consumer>
    {
      ({ isLoggedIn, userData }) => (
        <MainBoard
          isLoggedIn={isLoggedIn}
          userData={userData}
          {...props}
        />
      )
    }
  </AuthContext.Consumer>
)