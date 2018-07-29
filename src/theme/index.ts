import * as styledComponents from "styled-components";

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider,
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
  primaryColor: 'white',
  secondaryColor: '#209de2',
  primaryTextColor: 'rgba(0, 0, 0, 0.84)',
  secondaryTextColor: 'white',
  borderColor: '#209de2',
};

export const darkTheme = {
  primaryColor: 'black',
  secondaryColor: '#e9e9eb',
  primaryTextColor: 'white',
  secondaryTextColor: 'currentColor',
  borderColor: '#e9e9eb',
}

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider };
