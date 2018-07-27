import React, { ReactNode } from 'react';
import styled from '../../theme';

const Container = styled.div`
  height: 100%;
`;
export interface DropProviderProps {
  handleDrop: (e: React.DragEvent, targetId: number) => void;
  children: ReactNode
}
export default class DropProvider extends React.Component<DropProviderProps> {
  onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }
  onDrop = (e: React.DragEvent) => {
    e.persist();
    const targetId = e.dataTransfer.getData('text');
    this.props.handleDrop(e, parseInt(targetId, 10));
  }
  render() {
    return (
      <Container onDragOver={this.onDragOver} onDrop={this.onDrop} >
        {this.props.children}
      </Container>
    );
  }
}