import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    defaultText: {
        fontFamily: 'MadimiOne-Regular'
    },
});

const override = () => {
    const oldTextRender = Text.render;
    Text.render = function(...args) {
        const origin = oldTextRender.call(this, ...args);
        return React.cloneElement(origin, {
        style: [styles.defaultText, origin.props.style],
        allowFontScaling: false,
        });
    };

    const oldTextInputRender = TextInput.render;
    TextInput.render = function(...args) {
        const origin = oldTextInputRender.call(this, ...args);
        return React.cloneElement(origin, {
        style: [styles.defaultText, origin.props.style],
        allowFontScaling: false,
        });
    };
};

export default override;
