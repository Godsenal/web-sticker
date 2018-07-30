import React from 'react';
import styled from '../../theme';
import CloseIcon from 'react-icons/lib/ti/delete-outline';
import { IconButton } from '../../components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;

  background-color: rgba(0, 0, 0, 0.4);
`;
const InnerContainer = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;

  width: 60%;
  margin-left: -30%;

  color: rgba(0, 0, 0, 0.84);
  background-color: white;

  font-size: 20px;
  border-radius: 5px;
`;
const Header = styled.div`
  display: flex;
  justify-content: flex-end;

  padding: 10px;
`
export interface ModalFactoryProps {
  children: React.ReactChild;
  handleClose: () => void;
}
export default class ModalFactory extends React.Component<ModalFactoryProps> {
  render() {
    const { children, handleClose } = this.props;
    return (
      <Container>
        <InnerContainer>
          <Header>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Header>
          {children}
        </InnerContainer>
      </Container>
    )
  }
}