import { Stack, Slider } from '@fluentui/react';
import { useState } from 'react';
import { default as styles } from './App.module.scss';

export const App = () => {
    const [millseconds, setMilliseconds] = useState(100);
    const [opacity, setOpacity] = useState(0.5);

    return (
        <>
            <Stack className={styles.configuration}>
                <Slider
                    label="Interval (MS)"
                    min={20}
                    max={200}
                    step={10}
                    defaultValue={100}
                    showValue
                    snapToStep
                    onChange={(value) => setMilliseconds(value)} />

                <Slider
                    label="Opacity"
                    min={0}
                    max={1}
                    step={0.1}
                    defaultValue={0.5}
                    showValue
                    onChange={(value) => setOpacity(value)} />

            </Stack>
        </>
    );
};
