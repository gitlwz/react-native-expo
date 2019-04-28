import React from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation";
import PopularItem from "../common/PopularItem"
import { connect } from 'react-redux';
import actions from '../action/index';


const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = "red"

export default class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        this.tabNames = ["Java", "Android", "IOS", "React", "React Native", "PHP"];
    }
    _genTabs = () => {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}></PopularTabPage>,
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
    constructor(props) {
        super(props)
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
    }
    componentWillMount = () => {
        this._loadData();
    }
    _loadData = () => {
        const { onLoadPopularData } = this.props;
        const url = this._genFetchUrl(this.storeName)
        onLoadPopularData(this.storeName, url)
    }
    _genFetchUrl = (key) => {
        return URL + key + QUERY_STR;
    }
    _renderItem = (data) => {
        const item = data.item
        return <PopularItem
            item={item}
            onSelect={
                () => { }
            }
        />
    }
    render() {
        const { popular } = this.props;
        let store = popular[this.storeName] || {
            items: [],
            isLoading: false
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.items}
                    renderItem={this._renderItem}
                    keyExtractor={item => "" + item.id}
                    refreshControl={
                        <RefreshControl
                            title={"Loading"}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={this._loadData}
                            tintColor={THEME_COLOR}
                        />
                    }
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    popular: state.popular
});
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
    },
    indicatorStyle: {
        height: 0.5,
        backgroundColor: "#fff"
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    }
});
