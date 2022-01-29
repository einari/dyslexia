import ReactDOM from 'react-dom';
import { Noise } from './Noise';

const container = document.createElement('div');
container.style['pointer-events'] = 'none';
container.style.position = 'fixed';
container.style.top = '0px';
container.style.zIndex = '1000';
container.style.width = '100%';
container.style.height = '100%';
document.body.appendChild(container);

ReactDOM.render(
    <Noise />,
    container
);
