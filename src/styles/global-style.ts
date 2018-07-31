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
        overflow: hidden;
        text-rendering: optimizeLegibility;
        font-family: 'Ubuntu', 'Nanum Gothic', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    #app {
        height: 100%;
    }
    [draggable=true] {
        -khtml-user-drag: element;
    }
    h1 {
        margin: 0;
        padding: 0;
        font-size: 1.8em;
        color: rgba(0, 0, 0, 0.84);
    }
`;
