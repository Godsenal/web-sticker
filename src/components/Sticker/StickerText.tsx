import React from 'react';
import debounce from 'lodash/debounce';
import styled from '../../theme';
import { STICKER_HEADER_HEIGHT } from '../../constants';

const TextArea = styled.textarea`
  resize: none;
  border: none;
  outline: none;
  margin: auto;

  width: 98%;
  height: calc(95% - ${STICKER_HEADER_HEIGHT}px);

  font-size: ${(props: any) => props.fontSize}px;
  color: ${props => props.theme.primaryTextColor};
  background: transparent;
`;
export interface StickerTextProps {
  contents: string;
  isFocused: boolean;
  handleUpdate: (update: {}) => void;
  onFocus: () => void;
  onBlur: () => void;
  fontSize: number;
}
interface State {
  value: string;
}
export default class StickerText extends React.PureComponent<StickerTextProps, State> {
  private _textarea: React.RefObject<HTMLTextAreaElement>;
  state = {
    value : this.props.contents,
  }
  constructor(props: StickerTextProps) {
    super(props);
    this._textarea = React.createRef();
    this.handleUpdate = debounce(this.handleUpdate, 500);
  }
  componentDidUpdate(prevProps: StickerTextProps) {
    if (this.props.isFocused && prevProps.isFocused !== this.props.isFocused) {
      if (this._textarea.current) {
        this._textarea.current.focus();
      }
    }
  }
  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    this.setState({
      value,
    });
    this.handleUpdate(value);
  }
  handleUpdate = (contents: string) => {
    this.props.handleUpdate({ contents });
  }
  render() {
    const { value } = this.state;
    const { fontSize, ...props } = this.props;
    return (
      <TextArea
        value={value}
        onChange={this.handleChange}
        fontSize={fontSize}
        innerRef={this._textarea}
        {...props}
      />
    )
  }
}