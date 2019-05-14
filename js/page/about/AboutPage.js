import React from 'react';
import { StyleSheet, Linking, View, TouchableOpacity, ScrollView } from 'react-native';
import NavigationUtil from "../../navigator/NavigationUtil";
import { MORE_MENU } from "../../common/MORE_MENU";
import GlobalStyles from "../../res/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon, { FLAG_ABOUT } from "./AboutCommon";
import config from '../../res/data/config'

const THEME_COLOR = '#678';

export default class MyPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about,
        }, data => this.setState({ ...data })
        );
        this.state = {
            data: config,
        }
    }
    onClick = (menu) => {
        let RouteName, params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage';
                params.title = '教程';
                params.url = 'https://gitlwz.github.io/';
                break;
            case MORE_MENU.About_Author:
                RouteName = 'AboutMePage';
                break;
            case MORE_MENU.Feedback:
                const url = 'mailto://crazycodeboy@gmail.com';
                Linking.canOpenURL(url)
                    .then(support => {
                        if (!support) {
                            console.log('Can\'t handle url: ' + url);
                        } else {
                            Linking.openURL(url);
                        }
                    }).catch(e => {
                        console.error('An error occurred', e);
                    });
                break;
            default:
                break;
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName);
        }
    }
    getItem = (menu) => {
        return ViewUtil.getMenuItem(
            () => this.onClick(menu),
            menu,
            THEME_COLOR
        )
    }
    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line} />
            {this.getItem(MORE_MENU.Feedback)}
        </View>;
        return (
            this.aboutCommon.render(content, this.state.data.app)
        );
    }
}