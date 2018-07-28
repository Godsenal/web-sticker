import * as styledComponents from "styled-components";

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

export interface IThemeInterface {
  primaryColor: string;
  secondaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  borderColor: string;
}

export const theme = {
  primaryColor: '#e9e9eb',
  secondaryColor: '#e83852',
  primaryTextColor: 'rgba(0, 0, 0, 0.84)',
  secondaryTextColor: 'white',
  borderColor: '#e83852',
};

export const darkTheme = {
  primaryColor: 'rgba(0, 0, 0, 0.84)',
  secondaryColor: '#e9e9eb',
  primaryTextColor: 'white',
  secondaryTextColor: 'rgba(0, 0, 0, 0.84)',
  borderColor: '#e9e9eb',
}

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider };
