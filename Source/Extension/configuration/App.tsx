import { Stack, Slider } from '@fluentui/react';
import { useState, useEffect } from 'react';
import { default as styles } from './App.module.scss';

export const App = () => {
    const [milliseconds, setMilliseconds] = useState(100);
    const [opacity, setOpacity] = useState(0.5);

    useEffect(() => {
        chrome.storage.sync.get(['milliseconds', 'opacity'], result => {
            setMilliseconds(result.milliseconds);
            setOpacity(result.opacity);
        });

        return () => { };
    }, [])

    return (
        <>
            <Stack className={styles.configuration}>
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
                    }} />
            </Stack>
        </>
    );
};
