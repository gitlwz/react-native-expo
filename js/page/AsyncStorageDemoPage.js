import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage } from 'react-native';
const KEY = "save_key";
export default class AsyncStorageDemoPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showText: ""
        }
    }
    _doSave = () => {
        AsyncStorage.setItem(KEY, this.value, error => {
            error && console.log(error.toString());
        });
        // //用法二
        // AsyncStorage.setItem(KEY, this.value)
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });

        // //用法三
        // try {
        //     await AsyncStorage.setItem(KEY, this.value);
        // } catch (error) {
        //     error && console.log(error.toString());
        // }
    }
    _doRemove = () => {
        //用法一
        AsyncStorage.removeItem(KEY, error => {
            error && console.log(error.toString());
        });

        // //用法二
        // AsyncStorage.removeItem(KEY)
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        //
        // //用法三
        // try {
        //     await  AsyncStorage.removeItem(KEY);
        // } catch (error) {
        //     error && console.log(error.toString());
        // }
    }
    _doGetData = () => {
        //用法一
        AsyncStorage.getItem(KEY, (error, value) => {
            this.setState({
                showText: value
            });
            console.log(value);
            error && console.log(error.toString());
        });
        // //用法二
        // AsyncStorage.getItem(KEY)
        //     .then(value => {
        //         this.setState({
        //             showText: value
        //         });
        //         console.log(value);
        //
        //     })
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        // //用法三
        // try {
        //     const value = await  AsyncStorage.getItem(KEY);
        //     this.setState({
        //         showText: value
        //     });
        //     console.log(value);
        // } catch (error) {
        //     error && console.log(error.toString());
        // }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            this.value = text;
                        }}
                    />
                </View>
                <View style={styles.input_container}>
                    <Button title='存储' onPress={this._doSave}></Button>
                    <Button title='删除' onPress={this._doRemove}></Button>
                    <Button title='获取' onPress={this._doGetData}></Button>
                </View>
                <Text>{this.state.showText}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input: {
        height: 30,
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10
    },
    input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

