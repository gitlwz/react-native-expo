import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class TrendingPage extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>TrendingPage</Text>
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
