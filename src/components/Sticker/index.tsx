import React from 'react';
import { DragProvider } from '../';
import styled from '../../theme';
import { ISticker } from '../../interfaces';

const DEFAULT_HEADER = 20;

interface StyledProps {
  posX: number;
  posY: number;
  isFocused: boolean;
};
const Container = styled.div`
  position: absolute;
  top: ${(props: StyledProps) => props.posY}%;
  left: ${(props: StyledProps) => props.posX}%;
  width: 200px;
  height: 200px;

  background-color: ${props => props.theme.primaryColor};
  border-radius: 5px;

  resize: both;
  overflow: auto;
  ${(props: StyledProps) => props.isFocused && `
    z-index: 999;
  `}
  &:focus {
    z-index: 999;
    outline: none;
  }
`;
const Header = styled.div`
  width: 100%;
  height: ${DEFAULT_HEADER}px;

  background-color: ${props => props.theme.secondaryColor};

`;
const TextArea = styled.textarea`
  resize: none;
  border: none;
  outline: none;
  margin: auto;

  width: 98%;
  height: calc(100% - ${DEFAULT_HEADER * 2}px);
  background: transparent;
`;
export interface StickerProps extends ISticker {
  updateSticker: (id: number, update: {}) => void;
}
interface State {
  contents: string;
  draggable: boolean;
  isDragging: boolean;
  moveX: number;
  moveY: number;
  isFocused: boolean;
}
export default class Sticker extends React.Component<StickerProps, State> {
  private _sticker: React.RefObject<HTMLDivElement>;
  private _shiftX: number;
  private _shiftY: number;
  private _oldWidth: number;
  private _oldHeight: number;
  state = {
    contents: '',
    draggable: false,
    isDragging: false,
    moveX: this.props.left,
    moveY: this.props.top,
    isFocused: false,
  }
  constructor(props: StickerProps) {
    super(props);
    this._sticker = React.createRef();
  }
  handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      contents: e.target.value,
    });
  }
  setFocus = (isFocused: boolean) => {
    this.setState({
      isFocused,
    });
  }
  getShift = (clientX: number, clientY: number) => {
    if (this._sticker.current) {
      const { left, top } = this._sticker.current.getBoundingClientRect();
      return {
        shiftX: clientX - left,
        shiftY: clientY - top,
      };
    }
    return {
      shiftX: 0,
      shiftY: 0,
    }
  }
  setDraggable = (condition: boolean) => {
    this.setState({
      draggable: condition,
    });
  }
  onMouseUp = (e: React.MouseEvent) => {
    let sticker;
    if (sticker = this._sticker.current) {
      if (this._oldWidth !== sticker.offsetWidth || this._oldHeight !== sticker.offsetHeight) {
        const { id, updateSticker } = this.props;
        const update = {
          width: sticker.offsetWidth,
          height: sticker.offsetHeight,
        };
        updateSticker(id, update);
      }
    }
  }
  onMouseDown = (e: React.MouseEvent) => {
    // Prevent add Sticker in Board Component.
    e.stopPropagation();
    let sticker;
    if (sticker = this._sticker.current) {
      this._oldWidth = sticker.offsetWidth;
      this._oldHeight = sticker.offsetHeight;
    }
  }
  onDragStart = (e: React.DragEvent) => {
    const { clientX, clientY } = e;
    const { shiftX, shiftY } = this.getShift(clientX, clientY);
    this._shiftX = shiftX;
    this._shiftY = shiftY;
    this.setState({
      isDragging: true,
    });
  }
  onDragEnd = (e: React.DragEvent) => {
    const { id, updateSticker } = this.props;
    const { pageX, pageY } = e;
    const moveX = pageX - this._shiftX;
    const moveY = pageY - this._shiftY;
    const update = {
      top: moveY,
      left: moveX,
    };
    updateSticker(id, update);
    this.setDraggable(false);
  }
  render() {
    const { draggable, contents, isFocused } = this.state;
    const { id, top, left } = this.props;
    // TabIndex make div focusable
    return (
      <Container
        innerRef={this._sticker}
        tabIndex={id}
        posX={left}
        posY={top}
        isFocused={isFocused}
        draggable={draggable}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
      >
        <Header
          onMouseDown={() => this.setDraggable(true)}
          onMouseUp={() => this.setDraggable(false)}
        />
        <TextArea
          value={contents}
          onChange={this.handleText}
          onFocus={() => this.setFocus(true)}
          onBlur={() => this.setFocus(false)}
        />
      </Container>
    );
  }
}