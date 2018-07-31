import React from 'react';
import styled from '../../theme';

const Container = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;

  min-height: 300px;
  margin: 10px 30px;
`;
const Header = styled.div`
  text-align: center;
`;

export interface FormProps {
  children: React.ReactChild;
  header?: string;
}
// Receive FormProps and FormElement's attributes
const Form: React.SFC<FormProps & React.HTMLAttributes<HTMLFormElement>> = ({ children, header, ...props }) => (
  <Container {...props}>
    <Header>{header}</Header>
    {children}
  </Container>
);

export default Form;

