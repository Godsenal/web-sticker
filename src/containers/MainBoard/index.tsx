import React from 'react';
import { Board, GlobalSetting } from '../../components';
import { ISticker } from '../../interfaces';
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
export default class MainBoard extends React.Component<{}, State> {
  private _id: number = 0;
  state = {
    stickers: [],
    isDark: false,
  }
  componentDidMount() {
    // saved stickers to localstorage with JSON.stringify
    // get stickers from localstorage with JSON.parse
    /*
    const savedStickers = localStorage.getItem('stickers');
    if (savedStickers) {
      const stickers = JSON.parse(savedStickers);
      this._id = stickers[stickers.length - 1].id + 1;
      this.setState({
        stickers,
      });
    }
    */
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