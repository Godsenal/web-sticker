import React from 'react';
import styled from '../../theme';
import { Sticker, DropProvider } from '..';
import { ISticker } from '../../interfaces';
import { STICKER_WIDTH, STICKER_HEIGHT } from '../../constants';

export interface BoardProps {
  stickers: ISticker[];
  addSticker: (sticker: {}) => void;
  updateSticker: (id: number, update: {}) => void;
  removeSticker: (id: number) => void;
}
const Container = styled.div`
  position: relative;

  height: 100%;
`;
const EmptyBox = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Board: React.SFC<BoardProps> = (props) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const top = clientY - (STICKER_HEIGHT / 2);
    const left = clientX - (STICKER_WIDTH / 2);
    const sticker = {
      top,
      left,
      contents: '',
    }
    props.addSticker(sticker);
  }
  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    // const { clientX, clientY } = e;
    // this.props.updateSticker(targetId, { left: clientX, top: clientY });
  }
  const { stickers, updateSticker, removeSticker } = props;
  return (
    <DropProvider handleDrop={handleDrop}>
      <Container onMouseDown={handleMouseDown}>
        {stickers.map(sticker => (
          <Sticker
            key={sticker.id}
            {...sticker}
            updateSticker={updateSticker}
            removeSticker={removeSticker}
          />
        ))}
        {
          stickers.length === 0 && (
            <EmptyBox>
              Click anywhere to add sticker!
            </EmptyBox>
          )
        }
      </Container>
    </DropProvider>
  );
}

export default Board;
