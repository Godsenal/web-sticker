import React from 'react';
import { Popover, IconButton } from '../';
import styled from '../../theme';
import SettingIcon from 'react-icons/lib/ti/cog-outline';
import CloseIcon from 'react-icons/lib/ti/delete-outline';
import CheckIcon from 'react-icons/lib/ti/tick-outline';

import { STICKER_HEADER_HEIGHT } from '../../constants';

interface HeaderStyleProps {
  height?: number,
}
const Header = styled.div`
  width: 100%;
  height: ${(props: HeaderStyleProps) => props.height ? `${props.height}px` : `${STICKER_HEADER_HEIGHT}px`};

  background-color: ${props => props.theme.secondaryColor};

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Setting = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  background-color: ${props => props.theme.secondaryColor};
`;
const SettingList = styled.ul`
  list-style-type: none;
  padding: 5px;
  margin: 0;
`;
const SettingListItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  
  margin-top: 5px;
  margin-right: 5px;
`;
const Label = styled.span`
  flex: 1 1;
  color: ${props => props.theme.secondaryTextColor};
`
const NumberInput = styled.input`
  outline: none;
  border: none;
  border-radius: 5px;

  width: 50px;
  margin-left: 5px;
`;
export interface StickerHeaderProps {
  fontSize: number;
  height?: number;
  handleUpdate: (update: {}) => void;
  handleRemove: () => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}
interface State {
  readonly showSetting: boolean;
  readonly fontSize: number;
}
class StickerHeader extends React.Component<StickerHeaderProps> {
  private _setting: React.RefObject<HTMLDivElement> = React.createRef();
  state = {
    showSetting: false,
    fontSize: this.props.fontSize,
  }
  showSetting = (show: boolean = true) => {
    this.setState({
      showSetting: show,
    });
  }
  handleUpdate = () => {
    const { fontSize } = this.state;
    const update = {
      fontSize,
    };
    this.props.handleUpdate(update);
    this.showSetting(false);
  }
  handleFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fontSize: e.target.value,
    });
  } 
  render() {
    const { showSetting, fontSize } = this.state;
    const { handleRemove, ...props} = this.props;
    return (
      <Header {...props}>
        <IconButton innerRef={this._setting} onClick={() => this.showSetting(true)}>
          <SettingIcon />
        </IconButton>
        {
          showSetting && (
            <Setting>
              <SettingList>
                <SettingListItem>
                  <IconButton onClick={this.handleUpdate}>
                    <CheckIcon />
                  </IconButton>
                </SettingListItem>
                <SettingListItem>
                  <Label>font-size</Label>
                  <NumberInput
                    type="number"
                    min={5}
                    max={36}
                    value={fontSize}
                    onChange={this.handleFontSize}
                  />
                </SettingListItem>
              </SettingList>
            </Setting>
          )
        }
        <IconButton onClick={handleRemove}>
          <CloseIcon />
        </IconButton>
      </Header>
    )
  }
}

export default StickerHeader;
