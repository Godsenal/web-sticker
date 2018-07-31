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
  
  font-size: 1.5rem;
  color: ${props => props.theme.primaryTextColor};
`;
const Board: React.SFC<BoardProps> = (props) => {
  let _board: React.RefObject<HTMLDivElement> = React.createRef();
  const addStickerAtCenter = (clientX: number, clientY: number) => {
    const top = clientY - (STICKER_HEIGHT / 2);
    const left = clientX - (STICKER_WIDTH / 2);
    const sticker = {
      top,
      left,
      contents: '',
    }
    props.addSticker(sticker);
  }
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.currentTarget === _board.current) {
      const { clientX, clientY } = e.touches[0];
      addStickerAtCenter(clientX, clientY);
    }
  }
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.currentTarget === _board.current) {
      const { clientX, clientY } = e;
      addStickerAtCenter(clientX, clientY);
    }
  }
  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    // const { clientX, clientY } = e;
    // this.props.updateSticker(targetId, { left: clientX, top: clientY });
  }
  const { stickers, updateSticker, removeSticker } = props;
  return (
    <DropProvider handleDrop={handleDrop}>
      <Container innerRef={_board} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
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
              <span>Click anywhere to add sticker! 👉</span>
            </EmptyBox>
          )
        }
      </Container>
    </DropProvider>
  );
}

export default Board;
