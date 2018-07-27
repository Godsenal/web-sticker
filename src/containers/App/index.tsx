import React from 'react';
import styled from '../../theme';
import { MainBoard } from '..';

const Container = styled.div`
  height: 100%;
`;

export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <Container>
        <MainBoard />
      </Container>
    );
  }
}