import { Noise } from './Noise';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';


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


function createUserToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}
let userId: string = '';

const appInsights = new ApplicationInsights({
    config: {
        connectionString: 'InstrumentationKey=811364f1-6066-4154-adc1-97b0ebd65535;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/'
    }
});
appInsights.loadAppInsights();

const noise = new Noise(canvas);
window.onbeforeunload = function (e) {
    appInsights.trackEvent({ name: 'stopReading' }, { userId })
};

function handleOpacity(opacity: number | undefined = 0.3) {
    canvas.style.opacity = opacity?.toString();
}

handleOpacity()

function handleEnabled(enabled: boolean) {
    canvas.style.display = enabled ? '' : 'none';
}

chrome.storage.sync.get(['milliseconds', 'opacity', 'enabled', 'userId'], items => {
    if (items.enabled !== undefined) {
        handleEnabled(items.enabled);
    }
    if (items.milliseconds) {
        noise.milliseconds = items.milliseconds;
    }

    if (items.opacity) {
        handleOpacity(items.opacity);
    }

    userId = items.userId;
    if (!userId || userId == '') {
        userId = createUserToken();
        chrome.storage.sync.set({ userId }, function () {
        });
    }

    appInsights.trackEvent({ name: 'startReading' }, { userId, milliseconds: items.milliseconds, opacity: items.opacity });
});

chrome.storage.onChanged.addListener(changes => {
    if (changes.enabled) {
        handleEnabled(changes.enabled.newValue);
    }
    if (changes.milliseconds) {
        noise.milliseconds = changes.milliseconds.newValue;
    }
    if (changes.opacity) {
        handleOpacity(changes.opacity.newValue);
    }
});
