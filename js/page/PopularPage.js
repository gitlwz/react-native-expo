import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation";

export default class PopularPage extends React.Component {

    render() {
        const TabNavigator = createAppContainer(
            createMaterialTopTabNavigator({
                PopularTab1: {
                    screen: PopularTab,
                    navigationOptions: {
                        title: "Tab1"
                    }
                },
                PopularTab2: {
                    screen: PopularTab,
                    navigationOptions: {
                        title: "Tab2"
                    }
                },
                PopularTab3: {
                    screen: PopularTab,
                    navigationOptions: {
                        title: "Tab3"
                    }
                }
            })
        )
        return (
            <View style={{ flex: 1, marginTop: 20 }}>
                <TabNavigator />
            </View>
        );
    }
}

class PopularTab extends React.Component {
    render() {
        const { tabLabel } = this.props;
        return (
            <View style={styles.container}>
                <Text>{tabLabel}</Text>
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
