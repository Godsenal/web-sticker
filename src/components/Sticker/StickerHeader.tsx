import React from 'react';
import { Popover, IconButton } from '..';
import styled from '../../theme';
import SettingIcon from 'react-icons/lib/ti/cog-outline';
import CloseIcon from 'react-icons/lib/ti/delete-outline';
import CheckIcon from 'react-icons/lib/ti/tick-outline';

import { STICKER_HEADER_HEIGHT, BACKGROUND_COLORS } from '../../constants';

interface HeaderStyleProps {
  height?: number,
}
const Header = styled.div`
  width: 100%;
  height: ${STICKER_HEADER_HEIGHT}px;

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
  padding: 0 5px;
  margin: 0;
`;
const SettingListItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
`;
const Label = styled.span`
  margin-right: 5px;
  color: ${props => props.theme.secondaryTextColor};
`
const NumberInput = styled.input`
  outline: none;
  border: none;
  border-radius: 5px;

  width: 50px;
  margin-left: 5px;
`;

const ColorPicker = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: 5px;

  border-radius: 50%;
  width: 16px;
  height: 16px;
  color: ${props => props.theme.primaryTextColor};
  background-color: ${(props: any) => props.backgroundColor ? props.backgroundColor : props.theme.primaryColor};

  cursor: pointer;
`;

export interface StickerHeaderProps {
  fontSize: number;
  backgroundColor: string;
  height?: number;
  handleUpdate: (update: {}) => void;
  handleRemove: () => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}
interface State {
  readonly showSetting: boolean;
  readonly fontSize: number;
  readonly backgroundColor: string | undefined;
}
class StickerHeader extends React.Component<StickerHeaderProps> {
  private _setting: React.RefObject<HTMLDivElement> = React.createRef();
  state = {
    showSetting: false,
    fontSize: this.props.fontSize,
    backgroundColor: this.props.backgroundColor,
  }
  showSetting = (show: boolean = true) => {
    this.setState({
      showSetting: show,
    });
  }
  handleUpdate = () => {
    const { fontSize, backgroundColor } = this.state;
    const update = {
      fontSize,
      backgroundColor,
    };
    this.props.handleUpdate(update);
    this.showSetting(false);
  }
  handleFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fontSize: e.target.value,
    });
  }
  handleBackground = (color: string | undefined) => {
    this.setState({
      backgroundColor: color,
    });
  }
  render() {
    const { showSetting, fontSize, backgroundColor } = this.state;
    const { handleRemove, height, ...props} = this.props;
    const colorPicker = [undefined, ...BACKGROUND_COLORS];
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
                <SettingListItem>
                  {
                    colorPicker.map((color, i) => (
                      <ColorPicker
                        key={i}
                        backgroundColor={color}
                        onClick={() => this.handleBackground(color)}
                      >
                        { color === backgroundColor && <CheckIcon />}
                      </ColorPicker>
                    ))
                  }
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
