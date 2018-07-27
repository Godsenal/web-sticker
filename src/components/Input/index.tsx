import React from 'react';
import styled from '../../theme';

export interface InputProps {
  posX: number;
  posY: number;
  addSticker: (sticker: {}) => void;
}
interface State {
  readonly value: string;
}

interface InputElProps {
  x: number;
  y: number;
};
const InputEl = styled.input`
  position: absolute;
  top: ${(props: InputElProps) => props.y}px;
  left: ${(props: InputElProps) => props.x}px;

  height: 50px;
`;

export default class Input extends React.PureComponent<InputProps, State> {
  private _input: React.RefObject<HTMLInputElement>;
  state = {
    value: '',
  };
  constructor(props: InputProps) {
    super(props);
    this._input = React.createRef();
  }
  componentDidMount() {
    if (this._input.current) {
      this._input.current.focus();
    }
  }
  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value,
    });
  }
  render() {
    const { posX, posY } = this.props;
    const { value } = this.state;
    return (
      <InputEl
        innerRef={this._input}
        x={posX}
        y={posY}
        value={value}
        onChange={this.handleInput}
      />
    )
  }
}