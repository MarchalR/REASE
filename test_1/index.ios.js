/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    NavigatorIOS,
} from 'react-native';
import SearchPage from './SearchPage';
import AdvancedSearchPage from './AdvancedSearchPage';

class app extends Component {
    render() {
        return (
            <NavigatorIOS
                style={styles.container}
                initialRoute={{
                    title: 'Bercail',
                    component: AdvancedSearchPage,
                }}/>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

});

AppRegistry.registerComponent('app', () => app);
