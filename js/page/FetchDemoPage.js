import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
export default class FetchDemoPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showText: ""
        }
    }
    _loadData = () => {
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error("Network response was not ok.")
            })
            .then(responseText => {
                this.setState({
                    showText: responseText
                })
            })
            .catch(e => {
                this.setState({
                    showText: e.toString()
                })
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            this.searchKey = text;
                        }}
                    />
                    <Button
                        title="获取"
                        onPress={() => {
                            this._loadData();
                        }}
                    />
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
        alignItems: 'center'
    }
});

