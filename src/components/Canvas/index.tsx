import React from 'react';
import styled from '../../theme';
import { Input } from '../';

interface State {
  readonly isInput: boolean;
  readonly posX: number;
  readonly posY: number;
}
const Container = styled.div`
  position: relative;

  height: 100%;
`;
const Canvas2D = styled.canvas`
  width: 100%;
  height: 100%;
`;

export default class Canvas extends React.Component<{}, State> {
  state = {
    isInput: false,
    posX: 0,
    posY: 0,
  }
  private _canvas: React.RefObject<HTMLCanvasElement>;
  private _ctx: CanvasRenderingContext2D | null;
  constructor(props: any) {
    super(props);
    this._canvas = React.createRef();
  }
  componentDidMount() {
    this._ctx = this._canvas.current && this._canvas.current.getContext('2d');
  }
  handleClick = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    this.setState({
      isInput: true,
      posX: clientX,
      posY: clientY,
    });
  }
  render() {
    const { isInput, posX, posY } = this.state;
    return (
      <Container>
        <Canvas2D innerRef={this._canvas} onClick={this.handleClick} />
        { /* Seperate input component later */ }
        { isInput && <Input posX={posX} posY={posY} /> }
      </Container>
    );
  }
}