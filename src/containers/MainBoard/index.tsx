import React from 'react';
import { Board } from '../../components';
import { ISticker } from '../../interfaces';
import { ThemeProvider, theme } from '../../theme';

interface State {
  stickers: ISticker[];
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
  render() {
    const { stickers } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <Board
          stickers={stickers}
          addSticker={this.addSticker}
          updateSticker={this.updateSticker}
        />
      </ThemeProvider>
    )
  }
}