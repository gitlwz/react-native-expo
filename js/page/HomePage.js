import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    createBottomTabNavigator,
    createAppContainer
} from "react-navigation";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import PopularPage from "./PopularPage";
import TrendingPage from "./TrendingPage";
import FavoritePage from "./FavoritePage";
import MyPage from "./MyPage";

export default class HomePage extends React.Component {
    _tabNavigator = () => {
        return createAppContainer(
            createBottomTabNavigator({
                PopularPage: {
                    screen: PopularPage,
                    navigationOptions: {
                        tabBarLabel: "最热",
                        tabBarIcon: ({ tintColor, focused }) => (
                            <MaterialIcons
                                name={'whatshot'}
                                size={26}
                                style={{ color: tintColor }}
                            />
                        ),
                    }
                },
                TrendingPage: {
                    screen: TrendingPage,
                    navigationOptions: {
                        tabBarLabel: "趋势",
                        tabBarIcon: ({ tintColor, focused }) => (
                            <Ionicons
                                name={'md-trending-up'}
                                size={26}
                                style={{ color: tintColor }}
                            />
                        ),
                    }
                },
                FavoritePage: {
                    screen: FavoritePage,
                    navigationOptions: {
                        tabBarLabel: "收藏",
                        tabBarIcon: ({ tintColor, focused }) => (
                            <MaterialIcons
                                name={'favorite'}
                                size={26}
                                style={{ color: tintColor }}
                            />
                        ),
                    }
                },
                MyPage: {
                    screen: MyPage,
                    navigationOptions: {
                        tabBarLabel: "我的",
                        tabBarIcon: ({ tintColor, focused }) => (
                            <Entypo
                                name={'user'}
                                size={26}
                                style={{ color: tintColor }}
                            />
                        ),
                    }
                }
            })
        )
    }
    render() {
        const Tab = this._tabNavigator();
        return <Tab />
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
