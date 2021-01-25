import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './Screens/welcome.js'
import {AppDrawerNavigator} from './Components/AppDrawerNavigator.js'
import {createSwitchNavigator, createAppContainer} from 'react-navigation'

export default class App extends React.Component {
render (){
  return (
   <AppContainer/>
  );
  }
}

const switchNavigator = createSwitchNavigator({
    Welcome:{screen:Welcome},
    Qwerty:{screen:AppDrawerNavigator}
})

const AppContainer = createAppContainer(switchNavigator)