import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index'
class FavoritePage extends React.Component {
    _changeTheme = () => {
        const { onThemeChange } = this.props;
        onThemeChange("#206")
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>FavoritePage</Text>
                <Button
                    title="改变主题颜色"
                    onPress={this._changeTheme}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);