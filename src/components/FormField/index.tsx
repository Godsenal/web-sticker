import React from 'react';
import styled from '../../theme';

interface StyledProps {
  isFocused?: boolean;
  isValid?: boolean;
}
const Container = styled.div`
  margin-bottom: 20px;
  ${(props: StyledProps) => props.isFocused && (`
    label {
      color: rgba(0, 0, 0, 0.84);
      transition: color 0.2s;
    }
  `)}
`;
const Input = styled.input`
  width: 100%;
  padding: 5px 0px;
  color: rgba(0, 0, 0, 0.84);
  font-size: 1.25rem;
  line-height: 1.3;
  
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  outline: none;
  
  transition: border-bottom 0.2s;
  &:focus {
    border-bottom: 1px solid black;
  }
  ${(props: StyledProps) => !props.isValid && (`
    border-bottom: 1px solid #F23C57;
  `)}
`;
const Label = styled.label`
  color: rgba(0, 0, 0, 0.3);
  font-size: 0.8rem;
  font-weight: 600;
`;
const Message = styled.div`
  margin-top: 5px;
  min-height: 10px;
  color: #F23C57;
  font-size: 1rem;
  font-weight: 600;
`;

export interface FormFieldProps {
  name: string;
  label: string;
  message?: string;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface State {
  isFocused: boolean;
}
export default class Field extends React.PureComponent<FormFieldProps, State> {
  state = {
    isFocused: false,
  }
  onFocus = () => {
    this.setState({
      isFocused: true,
    });
  }
  onBlur = () => {
    this.setState({
      isFocused: false,
    });
  }
  render() {
    const { isFocused } = this.state;
    const { name, label, message, value, ...props } = this.props;
    return (
      <Container isFocused={isFocused}>
        <Label>
          {label}
          <Input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            name={name}
            value={value}
            {...props}
          />
        </Label>
        <Message>{message}</Message>
      </Container>
    );
  }
}