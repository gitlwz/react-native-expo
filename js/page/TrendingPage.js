import React from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl, ActivityIndicator, DeviceInfo, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation";
import TrendingItem from "../common/TrendingItem"
import { connect } from 'react-redux';
import actions from '../action/index';
import Toast from 'react-native-easy-toast'
import NavigationBar from "../common/NavigationBar";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import NavigationUtil from '../navigator/NavigationUtil';

const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const URL = 'https://github.com/trending/';
const THEME_COLOR = "#678"

export default class TrendingPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            timeSpan: TimeSpans[0]
        }
        this.tabNames = ["All", "C", "C#", "PHP", "JavaScript"];
    }
    _genTabs = () => {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}></TrendingTabPage>,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs;
    }
    renderTitleView = () => {
        return <View>
            <TouchableOpacity
                underlayColor='transparent'
                onPress={() => this.dialog.show()}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name={'arrow-drop-down'}
                        size={22}
                        style={{ color: 'white' }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }
    onSelectTimeSpan = (tab) => {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        });
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }
    renderTrendingDialog = () => {
        return <TrendingDialog
            ref={dialog => this.dialog = dialog}
            onSelect={tab => this.onSelectTimeSpan(tab)}
        />
    }
    _tabNav = () => {
        if (!this.tabNav) {
            this.tabNav = createAppContainer(
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
        }
        return this.tabNav
    }
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: "light-content",
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{ backgroundColor: THEME_COLOR }}
        />
        const TabNavigator = this._tabNav();
        return (
            <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
                {navigationBar}
                <TabNavigator />
                {this.renderTrendingDialog()}
            </View>
        );
    }
}
const pageSize = 10 //常量
class TrendingTab extends React.PureComponent {
    constructor(props) {
        super(props)
        const { tabLabel, timeSpan } = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
    }
    componentDidMount = () => {
        this._loadData();
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan;
            this._loadData();
        });
    }
    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
    }
    _loadData = (loadMore) => {
        const { onRefreshTrending, onLoadMoreTrending } = this.props;
        const url = this._genFetchUrl(this.storeName)
        const store = this._store();
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callBack => {
                this.refs.toast.show('没有更多了');
            });
        } else {
            onRefreshTrending(this.storeName, url, pageSize);
        }
    }
    /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
    _store() {
        const { trending } = this.props;
        let store = trending[this.storeName];
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
        return URL + key + '?' + this.timeSpan.searchText;
    }
    _renderItem = (data) => {
        const item = data.item
        return <TrendingItem
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
        const { trending } = this.props;
        let store = this._store();
        console.log("&&&&&&&&&", store)
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={this._renderItem}
                    keyExtractor={item => "" + item.fullName}
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
    trending: state.trending
});
const mapDispatchToProps = dispatch => ({
    onRefreshTrending: (storeName, url, pageSize) => dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack)),
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

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
