import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DynamicTabNavigator from "../navigator/DynamicTabNavigator"
import NavigationUtil from "../navigator/NavigationUtil"
export default class HomePage extends React.Component {
    componentWillMount = () => {
        NavigationUtil.navigation = this.props.navigation;
    }
    render() {
        return <DynamicTabNavigator />
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
