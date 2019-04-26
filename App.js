import React from 'react';
import AppPage from "./js/navigator/AppNavigator"

//关闭全部黄色警告
console.disableYellowBox = true
export default class App extends React.Component {
    render() {
        return (
            <AppPage />
        );
    }
}