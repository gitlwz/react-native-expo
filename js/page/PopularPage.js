import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation";
import NavigationUtil from "../navigator/NavigationUtil";

export default class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ["Java", "Android", "IOS", "React", "React Native", "PHP"];
    }
    _genTabs = () => {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTab {...props} tabLabel={item}></PopularTab>,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs;
    }
    render() {
        const TabNavigator = createAppContainer(
            createMaterialTopTabNavigator(
                this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,
                        scrollEnabled: true,
                        style: {
                            backgroundColor: "#678"
                        },
                        indicatorStyle: styles.indicatorStyle,
                        labelStyle: styles.labelStyle
                    }
                }
            )
        )
        return (
            <View style={{ flex: 1, marginTop: 20 }}>
                <TabNavigator />
            </View>
        );
    }
}

class PopularTab extends React.Component {
    _onPress = () => {
        NavigationUtil.goPage({}, "DetailPage")
    }
    render() {
        const { tabLabel } = this.props;
        return (
            <View style={styles.container}>
                <Text>{tabLabel}</Text>
                <Text onPress={this._onPress}>跳转到详情页</Text>
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
    tabStyle: {
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: "#fff"
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    }
});
