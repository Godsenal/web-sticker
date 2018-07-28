import { injectGlobal } from '../theme';

injectGlobal`
    html,
    body {
        position: relative;
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        background-color: #fff;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #app {
        height: 100%;
    }
`;
