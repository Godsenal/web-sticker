import React from 'react';
import styled from '../../theme';
import { IconButton, Popover } from '../';
import SettingIcon from 'react-icons/lib/ti/cog-outline';
import NightIcon from 'react-icons/lib/io/ios-moon-outline';
import FillNightIcon from 'react-icons/lib/io/ios-moon';

export interface SettingProps {
  isDark: boolean;
  toggleTheme: () => void;
}
interface State {
  readonly showMenu: boolean;
}
const SettingList = styled.div`
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  background-color: ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryTextColor};
  padding: 10px;
`;
const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 16px;

  cursor: pointer;
`;
const ColorWrapper = styled.span`
  color: ${props => props.theme.primaryTextColor};
`;
const Icon = styled.span`
  display: flex;
  font-size: 24px;
`;
export default class GlobalSetting extends React.Component<SettingProps, State> {
  private _setting: React.RefObject<HTMLSpanElement>;
  constructor(props: SettingProps) {
    super(props);
    this._setting = React.createRef();
  }
  state = {
    showMenu: false,
  }
  toggleMenu = (e: React.MouseEvent) => {
    this.setState(state => ({
      ...state,
      showMenu: !state.showMenu,
    }));
  }
  closeMenu = () => {
    this.setState({
      showMenu: false,
    });
  }
  render() {
    const { showMenu } = this.state;
    const { toggleTheme, isDark } = this.props;
    return (
      <>
        <IconButton innerRef={this._setting} onClick={this.toggleMenu}>
          <ColorWrapper>
            <SettingIcon />
          </ColorWrapper>
        </IconButton>
        <Popover
          anchorEl={this._setting}
          open={showMenu}
          handleClose={this.closeMenu}
        >
          <SettingList>
            <ListItem onClick={toggleTheme}>
              <span>Night Mode</span>
              <Icon>{isDark ? <FillNightIcon /> : <NightIcon />}</Icon>
            </ListItem>
          </SettingList>
        </Popover>
      </>
    )
  }
}