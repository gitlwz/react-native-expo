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
import FavoriteDao from "../expand/dao/FavoriteDao";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const URL = 'https://github.com/trending/';
const THEME_COLOR = "#678"
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
class TrendingPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            timeSpan: TimeSpans[0]
        }
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_language);
        this.preKeys = [];
    }
    _genTabs = () => {
        const tabs = {};
        const { keys, theme } = this.props;
        this.preKeys = keys;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme}></TrendingTabPage>,
                    navigationOptions: {
                        title: item.name
                    }
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
        const { theme } = this.props
        if (theme !== this.theme || !this.tabNav || ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
            this.theme = theme;
            this.tabNav = createAppContainer(
                createMaterialTopTabNavigator(
                    this._genTabs(), {
                        tabBarOptions: {
                            tabStyle: styles.tabStyle,
                            upperCaseLabel: false,
                            scrollEnabled: true,
                            style: {
                                backgroundColor: theme.themeColor,
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
        const { keys, theme } = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: "light-content",
        }
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={theme.styles.navBar}
        />
        const TabNavigator = keys.length > 0 ? this._tabNav() : null;
        return (
            <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
                {this.renderTrendingDialog()}
            </View>
        );
    }
}

const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

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
        EventBus.getInstance().addListener(EventTypes.favoriteChanged_trending, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true;
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 1 && this.isFavoriteChanged) {
                this._loadData(null, true);
            }
        })
    }
    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }
    _loadData = (loadMore, refreshFavorite) => {
        const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props;
        const url = this._genFetchUrl(this.storeName)
        const store = this._store();
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
                this.refs.toast.show('没有更多了');
            });
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
            this.isFavoriteChanged = false;
        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
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
        const { theme } = this.props
        const item = data.item
        return <TrendingItem
            theme={theme}
            projectModel={item}
            onSelect={
                (callBack) => {
                    NavigationUtil.goPage({
                        theme,
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_trending,
                        callBack: callBack
                    }, "DetailPage")
                }
            }
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
        const { theme } = this.props;
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={this._renderItem}
                    keyExtractor={item => "" + item.fullName}
                    refreshControl={
                        <RefreshControl
                            title={"Loading"}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={this._loadData}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={this._genIndicator()}
                    onEndReached={() => {
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
    onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
    onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
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
