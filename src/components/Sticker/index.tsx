import React from 'react';
import { Motion, spring, Style } from 'react-motion';
import StickerHeader from './StickerHeader';
import StickerText from './StickerText';
import styled from '../../theme';
import { ISticker } from '../../interfaces';

const DEFAULT_HEADER = 20;

interface StyledProps {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  scale?: number;
  isFocused?: boolean;
};
/* Use attrs api when use styled-components with react-motion */
const Container = styled.div.attrs({
  style: ((props: StyledProps) => ({
    top: props.top + '%',
    left: props.left + '%',
    transform: 'scale(' + props.scale + ')',
  })),
})`
  position: absolute;
  width: ${(props: StyledProps) => props.width}px;
  height: ${(props: StyledProps) => props.height}px;
  min-width: 80px;
  min-height: 80px;

  background-color: ${props => props.backgroundColor ? props.backgroundColor : props.theme.primaryColor};
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
  draggable: boolean;
  isDragging: boolean;
  isFocused: boolean;
  isTouchable: boolean;
  moveX?: number;
  moveY?: number;
}
export default class Sticker extends React.Component<StickerProps, State> {
  private _sticker: React.RefObject<HTMLDivElement>;
  private _shiftX: number;
  private _shiftY: number;
  private _oldWidth: number;
  private _oldHeight: number;
  private _pageX: number = 0;
  private _pageY: number = 0;
  state = {
    draggable: false,
    isDragging: false,
    moveX: this.props.left,
    moveY: this.props.top,
    isFocused: false,
    isTouchable: false,
  }
  constructor(props: StickerProps) {
    super(props);
    this._sticker = React.createRef();
  }
  componentDidMount() {
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
      this.setState({
        isTouchable: true,
      });
    }
    else {
      document.addEventListener('dragover', this.watchDrag);
    }
  }
  componentWillUnmount() {
    document.removeEventListener('dragover', this.watchDrag);
  }
  // In firefox, dragend event doesn't give us pageX, pageY.
  // So watch drag position whenever drag.
  watchDrag = (e: MouseEvent) => {
    this._pageX = e.pageX;
    this._pageY = e.pageY;
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
  // Get offset between mouse position and sticker's position
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
  // Make sticker draggable when clicked handler
  setDraggable = (condition: boolean) => {
    this.setState({
      draggable: condition,
    });
  }
  saveOldMeasurement = () => {
    let sticker;
    if (sticker = this._sticker.current) {
      this._oldWidth = sticker.offsetWidth;
      this._oldHeight = sticker.offsetHeight;
    }
  }
  updateMeasurement = () => {
    let sticker;
    if (sticker = this._sticker.current) {
      if (this._oldWidth !== sticker.clientWidth || this._oldHeight !== sticker.clientHeight) {
        const { id, updateSticker } = this.props;
        const update = {
          width: sticker.clientWidth,
          height: sticker.clientHeight,
        };
        updateSticker(id, update);
      }
    }
  }
  // Save current width & height before resize
  onMouseDown = (e: React.MouseEvent) => {
    // Prevent add Sticker in Board Component.
    if (this._sticker.current && e.currentTarget.contains(this._sticker.current)) {
      e.stopPropagation();
      this.saveOldMeasurement();
    }
  }
  onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const { clientX, clientY } = e.touches[0];
    const { shiftX, shiftY } = this.getShift(clientX, clientY);
    this._shiftX = shiftX;
    this._shiftY = shiftY;
    this.setState({
      isDragging: true,
    });
  }
  onTouchMove = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    const { _shiftX, _shiftY } = this;
    const moveX = (clientX - _shiftX) / window.innerWidth * 100;
    const moveY = (clientY - _shiftY) / window.innerHeight * 100;
    this.setState({
      moveX,
      moveY,
    });
  }
  onTouchEnd = (e: React.TouchEvent) => {
    const { id, updateSticker } = this.props;
    const { moveX, moveY } = this.state;
    const update = {
      top: moveY * window.innerHeight / 100,
      left: moveX * window.innerWidth / 100,
    };
    updateSticker(id, update);
    this.setDraggable(false);
  }
  // Update current width & height after resize
  onMouseUp = () => {
    this.updateMeasurement();
  }
  // Save current shift before drag start
  onDragStart = (e: React.DragEvent) => {
    const { clientX, clientY } = e;
    const { shiftX, shiftY } = this.getShift(clientX, clientY);
    this._shiftX = shiftX;
    this._shiftY = shiftY;
    this.setState({
      isDragging: true,
    });

    // for Firefox
    e.dataTransfer.setData('text/plain', this.props.id.toString());
  }
  // Update sticker's position
  onDragEnd = (e: React.DragEvent) => {
    const { id, updateSticker } = this.props;
    const { _pageX, _pageY } = this;
    const moveX = _pageX - this._shiftX;
    const moveY = _pageY - this._shiftY;
    const update = {
      top: moveY,
      left: moveX,
    };
    updateSticker(id, update);
    this.setDraggable(false);
  }
  render() {
    const { draggable, isFocused, isTouchable, moveX, moveY } = this.state;
    const { id, contents, top, left, width, height, fontSize, backgroundColor } = this.props;
    // TabIndex make div focusable
    return (
      <Motion
        defaultStyle={{ scale: 0 }}
        style={{ scale: spring(1, {stiffness: 210, damping: 20}) }}
      >
        {
          interpolatedStyle => (
            <Container
              innerRef={this._sticker}
              tabIndex={id}
              left={isTouchable ? moveX : left}
              top={isTouchable ? moveY : top}
              width={width}
              height={height}
              backgroundColor={backgroundColor}
              scale={interpolatedStyle.scale}
              isFocused={isFocused}
              draggable={draggable}
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}
              onTouchStart={this.onTouchStart}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
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
                contents={contents}
                fontSize={fontSize}
                handleUpdate={this.handleUpdate}
                isFocused={isFocused}
                onFocus={this.setFocus(true)}
                onBlur={this.setFocus(false)}
              />
            </Container>
          )
        }
      </Motion>
    );
  }
}