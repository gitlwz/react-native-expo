import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, WebView } from 'react-native';
import NavigationBar from "../common/NavigationBar";
import ViewUtil from "../util/ViewUtil";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";
const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

export default class DetailPage extends React.PureComponent {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params;
        const { projectModel = {}, flag } = this.params;
        this.favoriteDao = new FavoriteDao(flag);
        // this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
        this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
        this.title = projectModel.item.full_name || projectModel.item.fullName;
        this.canGoBack = false;
        this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
        this.state = {
            isFavorite: projectModel.isFavorite
        }
    }

    componentDidMount() {
        this.backPress.componentDidMount();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        this.onBack();
        return true;
    }

    onBack = () => {
        if (this.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    onNavigationStateChange = (e) => {
        this.canGoBack = e.canGoBack;
        this.url = e.url
    }
    renderRightButton = () => {
        return (<View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => this.onFavoriteButtonClick()}>
                <FontAwesome
                    name={'star-o'}
                    size={20}
                    style={{ color: 'white', marginRight: 10 }}
                />
            </TouchableOpacity>
            {ViewUtil.getShareButton(() => {

            })}
        </View>
        )
    }
    render() {
        const titleLayoutStyle = this.title.length > 20 ? { paddingRight: 30 } : null;
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(this.onBack)}
            titleLayoutStyle={titleLayoutStyle}
            title={this.title}
            style={{ backgroundColor: THEME_COLOR }}
            rightButton={this.renderRightButton()}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={this.onNavigationStateChange}
                    source={{ uri: this.url }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
