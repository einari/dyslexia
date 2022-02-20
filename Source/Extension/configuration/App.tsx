import { Checkbox, Stack, Slider } from '@fluentui/react';
import { useState, useEffect } from 'react';
import { default as styles } from './App.module.scss';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const defaultMilliseconds = 60;
const defaultOpacity = 0.3;

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


export const App = () => {
    const [enabled, setEnabled] = useState(true);
    const [milliseconds, setMilliseconds] = useState(100);
    const [opacity, setOpacity] = useState(0.5);

    useEffect(() => {
        chrome.storage.sync.get(['milliseconds', 'opacity', 'enabled', 'userId'], items => {
            if (items.enabled !== undefined) {
                setEnabled(items.enabled);
            }

            if (!items.milliseconds) {
                chrome.storage.sync.set({ milliseconds: defaultMilliseconds }, () => { });
                setMilliseconds(defaultMilliseconds);
            } else {
                setMilliseconds(items.milliseconds);
            }

            if (!items.opacity) {
                chrome.storage.sync.set({ opacity: defaultOpacity }, () => { });
                setOpacity(defaultOpacity);
            } else {
                setOpacity(items.opacity);
            }

            userId = items.userId;
            if (!userId || userId == '') {
                userId = createUserToken();
                chrome.storage.sync.set({ userId }, function () {
                });
            }

            appInsights.trackEvent({ name: 'settings' }, { userId, milliseconds, opacity });
        });

        return () => { };
    }, [])

    return (
        <>
            <Stack className={styles.configuration}>
                <Checkbox
                    label="Enabled"
                    checked={enabled}
                    onChange={(_, value) => {
                        chrome.storage.sync.set({ enabled: value }, () => { })
                        setEnabled(value);
                    }}
                />

                <Slider
                    label="Interval (MS)"
                    min={20}
                    max={200}
                    step={10}
                    value={milliseconds}
                    showValue
                    snapToStep
                    onChange={(value) => {
                        chrome.storage.sync.set({ milliseconds: value }, () => { });
                        setMilliseconds(value);
                        appInsights.trackEvent({ name: 'settings' }, { userId, milliseconds });
                    }} />

                <Slider
                    label="Opacity"
                    min={0}
                    max={1}
                    step={0.1}
                    value={opacity}
                    showValue
                    onChange={(value) => {
                        chrome.storage.sync.set({ opacity: value }, () => { });
                        setOpacity(value);
                        appInsights.trackEvent({ name: 'settings' }, { userId, opacity });
                    }} />
            </Stack>
        </>
    );
};
