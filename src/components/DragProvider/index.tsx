import React from 'react';

export interface DragProviderProps {
  handle?: React.ReactElement<any>;
  targetId: number,
  render: (state: State) => React.ReactNode;
  onDragStart?: (e: React.MouseEvent) => void;
  onDragEnd?: (e: React.MouseEvent) => void;
}
interface State {
  posX: 0
  posY: 0
  isDraggable: boolean
  isDragging: boolean
}

export default class DragProvider extends React.Component<DragProviderProps, State> {
  readonly state: State = {
    posX: 0,
    posY: 0,
    isDraggable: !this.props.handle,
    isDragging: false,
  }
  onMouseDown = (e: React.MouseEvent) => {
    e.persist();
    this.props.onDragStart && this.props.onDragStart(e);
    this.setState({
      isDragging: true,
    });
  }
  onMouseMove = (e: React.MouseEvent) => {
    console.log(e.target);
  }
  onMouseUp = (e: React.MouseEvent) => {
    e.persist();
    this.props.onDragEnd && this.props.onDragEnd(e);
    this.setState({
      isDraggable: false,
      isDragging: false,
    });
  }
  render() {
    const { isDraggable } = this.state;
    const { render, handle } = this.props;
    return (
      <div
        draggable={isDraggable || !handle}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
      >
        {
          handle && (
            React.cloneElement(handle, { onMouseDown: this.onMouseDown })
          )
        }
        {render(this.state)}
      </div>
    );
  }
}
