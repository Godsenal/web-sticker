import React from 'react';
import StickerHeader from './StickerHeader';
import StickerText from './StickerText';
import { DragProvider } from '..';
import styled from '../../theme';
import { ISticker } from '../../interfaces';

const DEFAULT_HEADER = 20;

interface StyledProps {
  posX?: number;
  posY?: number;
  isFocused?: boolean;
};
const Container = styled.div`
  position: absolute;
  top: ${(props: StyledProps) => props.posY}%;
  left: ${(props: StyledProps) => props.posX}%;
  width: 200px;
  height: 200px;
  min-width: 80px;
  min-height: 80px;

  background-color: ${props => props.theme.primaryColor};
  border: 1px solid ${props => props.theme.borderColor};
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
export interface StickerProps extends ISticker {
  updateSticker: (id: number, update: {}) => void;
  removeSticker: (id: number) => void;
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
  handleUpdate = (update: {}) => {
    const { id, updateSticker } = this.props;
    updateSticker(id, update);
  }
  handleRemove = () => {
    const { id, removeSticker } = this.props;
    removeSticker(id);
  }
  setFocus = (isFocused: boolean = true) => () => {
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
    if (this._sticker.current && e.currentTarget.contains(this._sticker.current)) {
      e.stopPropagation();
      let sticker;
      if (sticker = this._sticker.current) {
        this._oldWidth = sticker.offsetWidth;
        this._oldHeight = sticker.offsetHeight;
      }
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
    const { id, top, left, fontSize } = this.props;
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
        <StickerHeader
          {...this.props}
          height={DEFAULT_HEADER}
          handleRemove={this.handleRemove}
          handleUpdate={this.handleUpdate}
          onMouseDown={() => this.setDraggable(true)}
          onMouseUp={() => this.setDraggable(false)}
        />
        <StickerText
          {...this.props}
          value={contents}
          isFocused={isFocused}
          onChange={this.handleText}
          onFocus={this.setFocus(true)}
          onBlur={this.setFocus(false)}
        />
      </Container>
    );
  }
}