import React from 'react';
import styled from '../../theme';

const Button = styled.button`
  outline: none;
  border: none;
  border-radius: 100px;

  min-width: 120px;
  min-height: 40px;
  font-size: 0.9375rem;
  padding: 10px 5px;
  color: white;
  background-color: #209de2;

  cursor: pointer;

  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  &:hover {
    background-color: #307cd0;
    transition: background-color 0.2s;
  }
`;

export default Button;
