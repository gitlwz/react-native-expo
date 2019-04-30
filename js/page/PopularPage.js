import React from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator, DeviceInfo, NativeModules } from 'react-native';
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation";
import PopularItem from "../common/PopularItem"
import { connect } from 'react-redux';
import actions from '../action/index';
import Toast from 'react-native-easy-toast'
import NavigationBar from "../common/NavigationBar";
import NavigationUtil from '../navigator/NavigationUtil';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = "#678"
console.log("DeviceInfo===============", DeviceInfo, NativeModules)
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
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: "light-content",
        }
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={{ backgroundColor: THEME_COLOR }}
        />
        const TabNavigator = createAppContainer(
            createMaterialTopTabNavigator(
                this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,
                        scrollEnabled: true,
                        style: {
                            backgroundColor: "#678",
                            height: 30//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
                        },
                        indicatorStyle: styles.indicatorStyle,
                        labelStyle: styles.labelStyle
                    },
                    lazy: true
                }
            )
        )
        return (
            <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
                {navigationBar}
                <TabNavigator />
            </View>
        );
    }
}
const pageSize = 10 //常量
class PopularTab extends React.PureComponent {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
    }
    componentDidMount = () => {
        this._loadData();
    }
    _loadData = (loadMore) => {
        const { onRefreshPopular, onLoadMorePopular } = this.props;
        const url = this._genFetchUrl(this.storeName)
        const store = this._store();
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callBack => {
                this.refs.toast.show('没有更多了');
            });
        } else {
            onRefreshPopular(this.storeName, url, pageSize);
        }
    }
    /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
    _store() {
        const { popular } = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],//要显示的数据
                hideLoadingMore: true,//默认隐藏加载更多
                pageIndex: 1,
            }
        }
        return store;
    }
    _genFetchUrl = (key) => {
        return URL + key + QUERY_STR;
    }
    _renderItem = (data) => {
        const item = data.item
        return <PopularItem
            item={item}
            onSelect={
                () => {
                    NavigationUtil.goPage({
                        projectModel: item
                    }, "DetailPage")
                }
            }
        />
    }
    _genIndicator = () => {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }
    render() {
        const { popular } = this.props;
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
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
                    ListFooterComponent={this._genIndicator()}
                    onEndReached={() => {
                        console.log('---onEndReached----');
                        setTimeout(() => {
                            if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                                this._loadData(true);
                                this.canLoadMore = false;
                            }
                        }, 100)
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
                        console.log('---onMomentumScrollBegin-----')
                    }}
                />
                <Toast
                    ref={"toast"}
                    position={"center"}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    popular: state.popular
});
const mapDispatchToProps = dispatch => ({
    onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack)),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        margin: 0,
    },
    indicatorContainer: {
        alignItems: "center"
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});