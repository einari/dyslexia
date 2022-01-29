import { Noise } from './Noise';


const container = document.createElement('div');
container.style['pointer-events'] = 'none';
container.style.position = 'fixed';
container.style.top = '0px';
container.style.zIndex = '1000';
container.style.width = '100%';
container.style.height = '100%';
container.style.opacity = '0.5';
document.body.appendChild(container);


const canvas = document.createElement('canvas');
canvas.style['pointer-events'] = 'none';
canvas.style.position = 'fixed';
canvas.style.top = '0px';
canvas.style.zIndex = '1000';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.opacity = '0.5';
container.appendChild(canvas);


const noise = new Noise(canvas);

function handleOpacity(opacity: number | undefined = 0.3) {
    canvas.style.opacity = opacity?.toString();
}

handleOpacity()

chrome.storage.sync.get(['milliseconds', 'opacity'], result => {
    if (result.milliseconds) {
        noise.milliseconds = result.milliseconds;
    }

    if (result.opacity) {
        handleOpacity(result.opacity);
    }
});

chrome.storage.onChanged.addListener(changes => {
    console.log(changes);
    if (changes.milliseconds) {
        noise.milliseconds = changes.milliseconds.newValue;
    }
    if (changes.opacity) {
        handleOpacity(changes.opacity.newValue);
    }
});
