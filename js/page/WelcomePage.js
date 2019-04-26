import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavigationUtil from "../navigator/NavigationUtil"
export default class WelcomePage extends React.Component {
    componentDidMount = () => {
        this.timer = setTimeout(() => {
            NavigationUtil.resetToHomPage({
                navigation: this.props.navigation
            })
        }, 2000)
    }
    componentWillUnmount = () => {
        this.timer && clearTimeout(this.timer)
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>WelcomePage !</Text>
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
