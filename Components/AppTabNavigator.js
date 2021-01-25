import React from 'react'
import {Image} from 'react-native'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import ItemDonate from '../Screens/itemDonate.js'
import ItemRequest from '../Screens/itemRequest.js'
import Setting from '../Screens/Setting.js'

export const AppTabNavigator = createBottomTabNavigator({
	donateItems:{screen:ItemDonate,
	navigationOptions : {
		tabBarLabel:"Donate Items"
	}},
	requestItems:{screen:ItemRequest,
	navigationOptions : {
		tabBarLabel:"Request Items"
	}}
})