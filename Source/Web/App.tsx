import { useState } from 'react';

import {
    IconButton,
    Slider,
    Stack,
    TextField
} from '@fluentui/react';

import { default as styles } from './App.module.scss';
import { Noise } from './Noise';

export const App = () => {
    const [address, setAddress] = useState('');
    const [currentBrowserAddress, setCurrentBrowserAddress] = useState('https://db.no');
    const [millseconds, setMilliseconds] = useState(100);
    const [opacity, setOpacity] = useState(0.5);

    const goToAddress = () => {
        let addressToNavigateTo = address;
        if (addressToNavigateTo.indexOf('http') < 0) {
            addressToNavigateTo = `http://${addressToNavigateTo}`;
            setAddress(addressToNavigateTo);
        }
        setCurrentBrowserAddress(addressToNavigateTo);
    };

    const browserLoaded = (ev) => {
    };

    return (
        <>
            <Stack style={{ height: '100%' }}>
                <Stack.Item>
                    <Stack>
                        <Stack horizontal>
                            <Stack.Item grow={1}>
                                <TextField
                                    label="Address"
                                    value={address}
                                    underlined
                                    onKeyDown={(ev) => { if (ev.which == 13) goToAddress(); }}
                                    onChange={(ev, value) => setAddress(value)}
                                />
                            </Stack.Item>

                            <Stack.Item>
                                <IconButton iconProps={{ iconName: 'Forward' }} onClick={goToAddress} />
                            </Stack.Item>
                        </Stack>
                        <Stack horizontal>
                            <Stack.Item grow={1}>
                                <Slider
                                    label="Interval (MS)"
                                    min={20}
                                    max={200}
                                    step={10}
                                    defaultValue={100}
                                    showValue
                                    snapToStep
                                    onChange={(value) => setMilliseconds(value)} />
                            </Stack.Item>
                            <Stack.Item grow={1}>
                                <Slider
                                    label="Opacity"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    defaultValue={0.5}
                                    showValue
                                    onChange={(value) => setOpacity(value)} />
                            </Stack.Item>
                        </Stack>
                    </Stack>
                </Stack.Item>

                <Stack.Item grow={1}>
                    <iframe
                        className={styles.browser}
                        onLoad={browserLoaded}
                        src={currentBrowserAddress} sandbox="" />
                    <Noise milliseconds={millseconds} opacity={opacity} />
                </Stack.Item>
            </Stack>
        </>
    );
};
