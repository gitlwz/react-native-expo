import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index';
import NavigationUtil from "../navigator/NavigationUtil";

class MyPage extends React.Component {
    _changeTheme = () => {
        const { onThemeChange } = this.props;
        onThemeChange("red")
    }
    _onPress = () => {
        NavigationUtil.goPage({}, "DetailPage")
    }
    _goFetch = () => {
        NavigationUtil.goPage({}, "FetchDemoPage")
    }
    _goFetch2 = () => {
        NavigationUtil.goPage({}, "AsyncStorageDemoPage")
    }
    _goDataStoreDemoPage = () => {
        NavigationUtil.goPage({}, "DataStoreDemoPage")
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>MyPage</Text>
                <Button
                    title="改变主题颜色"
                    onPress={this._changeTheme}
                />
                <Text onPress={this._onPress}>跳转到详情页</Text>
                <Text onPress={this._goFetch}>Fetch 使用</Text>
                <Text onPress={this._goFetch2}>AsyncStorageDemoPage 使用</Text>
                <Text onPress={this._goDataStoreDemoPage}>DataStoreDemoPage 使用</Text>
            </View>
        );
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

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);