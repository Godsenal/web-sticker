import { injectGlobal } from '../theme';

injectGlobal`
    html,
    body {
        position: relative;
        height: 100%;
        width: 100%;
        background: #fff;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #app {
        height: 100%;
    }
`;
