import React from 'react';
import styled from '../../theme';

const IconButton = styled.a`
  color: ${props => props.theme.secondaryTextColor};
  text-decoration: none;

  display: flex;
  align-items: center;

  cursor: pointer;
`;

export default IconButton;
