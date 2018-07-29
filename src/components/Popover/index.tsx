import React from 'react';
import styled from 'styled-components';

const DEFAULT_WIDTH = 200;
interface StyleProps {
  top: number;
  left: number;
}
const Container = styled.div`
  position: fixed;
  word-break: break-all;
  ${(props: StyleProps) => props.top && `top: ${props.top}px;`}
  ${(props: StyleProps) => props.left && `left: ${props.left}px;`}
  width: ${DEFAULT_WIDTH}px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);

  z-index: 1000;
`;

export interface PopoverProps {
  anchorEl: React.RefObject<any>;
  children: React.ReactChild;
  handleClose: () => void;
  open: boolean;
}
export default class Popover extends React.Component<PopoverProps> {
  private _popover: React.RefObject<HTMLDivElement>;
  constructor(props: PopoverProps) {
    super(props);
    this._popover = React.createRef();
  }
  componentDidMount() {
    window.addEventListener('mousedown', this.checkClickOutside);
  }
  componentWillUnmount() {
    window.removeEventListener('mousedown', this.checkClickOutside);
  }
  checkClickOutside = (e: any) => {
    if (!e.target) {
      return;
    }
    if (!this._popover.current) {
      return;
    }
    if (!this._popover.current.contains(e.target) && !this.props.anchorEl.current.contains(e.target)) {
      this.props.handleClose();
    }
  }
  getCalculatedLeftAndTop = (anchorEl: HTMLElement) => {
    const { width = 0, left, height = 0, top } = anchorEl.getBoundingClientRect();
    let calcTop = (top + height) + 5;
    let calcLeft = (left - 100) + (width / 2);
    if (calcLeft + DEFAULT_WIDTH > window.innerWidth) {
      calcLeft = window.innerWidth - 200;
    }
    return {
      calcTop,
      calcLeft,
    };
  }
  render() {
    const { anchorEl, children, open } = this.props;
    if (!anchorEl || !open) {
      return null;
    }
    const { calcTop, calcLeft } = this.getCalculatedLeftAndTop(anchorEl.current);
    return (
      <Container
        innerRef={this._popover}
        top={calcTop}
        left={calcLeft}
      >
        {children}
      </Container>
    );
  }
}