import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class MyPage extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>MyPage</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
