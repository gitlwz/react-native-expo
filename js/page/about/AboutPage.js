import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
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