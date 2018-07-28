import React from 'react';
import styled from '../../theme';
import { DropProvider, Input, Sticker } from '..';
import { ISticker } from '../../interfaces';
import { STICKER_WIDTH, STICKER_HEIGHT } from '../../constants';

export interface BoardProps {
  stickers: ISticker[];
  addSticker: (sticker: {}) => void;
  updateSticker: (id: number, update: {}) => void;
  removeSticker: (id: number) => void;
}
interface State {
  readonly isInput: boolean;
  readonly posX: number;
  readonly posY: number;
}
const Container = styled.div`
  position: relative;

  height: 100%;
`;

export default class Board extends React.Component<BoardProps, State> {
  state = {
    isInput: false,
    posX: 0,
    posY: 0,
  }
  handleMouseDown = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const top = clientY - (STICKER_HEIGHT / 2);
    const left = clientX - (STICKER_WIDTH / 2);
    const sticker = {
      top,
      left,
      contents: '',
    }
    this.props.addSticker(sticker);
  }
  handleDrop = (e: React.DragEvent, targetId: number) => {
    // e.preventDefault();
    // const { clientX, clientY } = e;
    // this.props.updateSticker(targetId, { left: clientX, top: clientY });
  }
  render() {
    const { stickers, updateSticker, removeSticker } = this.props;
    const { isInput, posX, posY } = this.state;
    return (
      <DropProvider handleDrop={this.handleDrop}>
        <Container onMouseDown={this.handleMouseDown}>
          {stickers.map(sticker => (
            <Sticker
              key={sticker.id}
              {...sticker}
              updateSticker={updateSticker}
              removeSticker={removeSticker}
            />
          ))}
        </Container>
      </DropProvider>
    );
  }
}