import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ActivityIndicator, DeviceInfo, NativeModules } from 'react-native';
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
import FavoriteDao from "../expand/dao/FavoriteDao";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import { FLAG_LANGUAGE } from "../expand/dao/LanguageDao";
import Ionicons from 'react-native-vector-icons/Ionicons'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = "#678"
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
console.log("DeviceInfo===============", DeviceInfo, NativeModules)
class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        const { onLoadLanguage } = this.props;
        onLoadLanguage(FLAG_LANGUAGE.flag_key)

    }
    _genTabs = () => {
        const tabs = {};
        const { keys, theme } = this.props;
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}></PopularTabPage>,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs;
    }
    renderRightButton() {
        const { theme } = this.props;
        return <TouchableOpacity
            onPress={() => {
                NavigationUtil.goPage({ theme }, 'SearchPage')
            }}
        >
            <View style={{ padding: 5, marginRight: 8 }}>
                <Ionicons
                    name={'ios-search'}
                    size={24}
                    style={{
                        marginRight: 8,
                        alignSelf: 'center',
                        color: 'white',
                    }} />
            </View>
        </TouchableOpacity>
    }
    render() {
        const { keys, theme } = this.props;
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: "light-content",
        }
        let navigationBar = <NavigationBar
            title={'最热'}
            statusBar={statusBar}
            style={theme.styles.navBar}
            rightButton={this.renderRightButton()}
        />
        const TabNavigator = keys.length > 0 ? createAppContainer(
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
        ) : null
        return (
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
            </View>
        );
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);
const pageSize = 10 //常量
class PopularTab extends React.PureComponent {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
        this.isFavoriteChanged = false;
    }
    componentDidMount() {
        this._loadData();
        EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true;
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this._loadData(null, true);
            }
        })
    }

    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }
    _loadData = (loadMore, refreshFavorite) => {
        const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props;
        const url = this._genFetchUrl(this.storeName)
        const store = this._store();
        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callBack => {
                this.refs.toast.show('没有更多了');
            });
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
            this.isFavoriteChanged = false;
        } else {
            onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
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
        const { theme } = this.props;
        return <PopularItem
            projectModel={item}
            theme={theme}
            onSelect={
                (callBack) => {
                    NavigationUtil.goPage({
                        theme,
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_popular,
                        callBack: callBack
                    }, "DetailPage")
                }
            }
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
                    keyExtractor={item => "" + item.item.id}
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
    popular: state.popular,
});
const mapDispatchToProps = dispatch => ({
    onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
    onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
    onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
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