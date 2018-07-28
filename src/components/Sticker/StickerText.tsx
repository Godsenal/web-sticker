import React from 'react';
import styled from '../../theme';
import { STICKER_HEADER_HEIGHT } from '../../constants';

const TextArea = styled.textarea`
  resize: none;
  border: none;
  outline: none;
  margin: auto;

  width: 98%;
  height: calc(100% - ${STICKER_HEADER_HEIGHT * 2}px);
  font-size: ${(props: any) => props.fontSize}px;
  color: ${props => props.theme.primaryTextColor};
  background: transparent;
`;
export interface StickerTextProps {
  value: string;
  isFocused: boolean;
  fontSize: number;
  [propName: string]: any;
}
export default class StickerText extends React.Component<StickerTextProps> {
  private _textarea: React.RefObject<HTMLTextAreaElement>;
  constructor(props: StickerTextProps) {
    super(props);
    this._textarea = React.createRef();
  }
  componentDidUpdate(prevProps: StickerTextProps) {
    if (this.props.isFocused && prevProps.isFocused !== this.props.isFocused) {
      if (this._textarea.current) {
        this._textarea.current.focus();
      }
    }
  }
  render() {
    return (
      <TextArea
        innerRef={this._textarea}
        {...this.props}
      />
    )
  }
}