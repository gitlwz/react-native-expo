import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    createBottomTabNavigator,
    createAppContainer
} from "react-navigation";
import { connect } from 'react-redux';

import { BottomTabBar } from "react-navigation-tabs";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import PopularPage from "../page/PopularPage";
import TrendingPage from "../page/TrendingPage";
import FavoritePage from "../page/FavoritePage";
import MyPage from "../page/MyPage";

//在这里是配置路由页面
const TABS = {
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
}

class DynamicTabNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Tab: null
        }
    }
    componentWillMount = () => {
        const Tab = this._tabNavigator()
        this.setState({
            Tab
        })
    }

    _tabNavigator = () => {
        const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
        //根据需要定制显示的tabs；
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage }
        return createAppContainer(
            createBottomTabNavigator(tabs, {
                tabBarComponent: (props) => <TabBarComponent {...props} theme={this.props.theme} />
            })
        )
    }
    render() {
        const Tab = this.state.Tab;
        return <Tab />
    }
}
class TabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime()
        }
    }
    render() {
        return (
            <BottomTabBar
                {...this.props}
                activeTintColor={this.props.theme}
            />
        )
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

const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);
