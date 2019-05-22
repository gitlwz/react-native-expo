import React from 'react';
import { StyleSheet, Linking, View, Clipboard, ScrollView } from 'react-native';
import NavigationUtil from "../../navigator/NavigationUtil";
import GlobalStyles from "../../res/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon, { FLAG_ABOUT } from "./AboutCommon";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'
import config from '../../res/data/config'

const THEME_COLOR = '#678';

export default class AboutMePage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about_me,
        }, data => this.setState({ ...data })
        );
        this.state = {
            data: config,

            showTutorial: true,
            showBlog: false,
            showQQ: false,
            showContact: false
        }
    }
    onClick = (tab) => {
        if (!tab) return;
        if (tab.url) {
            const { theme } =this.params
            NavigationUtil.goPage({
                title: tab.title,
                theme,
                url: tab.url
            }, 'WebViewPage');
            return;
        }

        if (tab.account && tab.account.indexOf('@') > -1) {
            let url = 'mailto://' + tab.account;
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
            return;
        }

        if (tab.account) {
            Clipboard.setString(tab.account);
            this.toast.show(tab.title + tab.account + '已复制到剪切板。');
        }
    }
    getItem = (menu) => {
        const {theme} = this.params
        return ViewUtil.getMenuItem(
            () => this.onClick(menu),
            menu,
            theme.themeColor
        )
    }
    _item = (data, isShow, key) => {
        const {theme} = this.params
        return ViewUtil.getSettingItem(() => {
            this.setState({
                [key]: !this.state[key]
            });
        }, data.name, theme.themeColor, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
    }
    /**
     * 显示列表数据
     * @param dic
     * @param isShowAccount
     */
    renderItems = (dic, isShowAccount) => {
        const {theme} = this.params
        if (!dic) return null;
        let views = [];
        for (let i in dic) {
            let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, theme.themeColor)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views;
    }
    render() {
        const content = <View>
            {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
            <View style={GlobalStyles.line}/>
            {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

            {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

            {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items, true) : null}

            {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items, true) : null}
        </View>;
        return (
            <View style={{flex: 1}}>
                {this.aboutCommon.render(content, this.state.data.author)}
                <Toast ref={toast => this.toast = toast}
                    position={'center'}
                />
            </View>
        );
    }
}