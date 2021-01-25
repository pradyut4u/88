import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase'
import db from '../config.js'
import MyHeader from '../Components/myHeader';
import BookSearch from 'react-native-google-books';

export default class ItemRequest extends React.Component{
	constructor(){
		super()
		this.state={
			userId:firebase.auth().currentUser.email,
			bookName: '',
			reason: '',
			requestId:'',
			docId:'',
			itemStatus:'',
			itemrequestactive:'',
			userDoc:'',
			dataSource:'',
			showFlatList:false
		}
	}

	uniqueId(){
		return(
			Math.random().toString(36).substring(7)
		)
	}

	addRequest = (itemName,reason) =>{
		var userId=this.state.userId
		var requestId=this.uniqueId()
		db.collection('requestedItems').add({
		userId:userId,itemName:itemName,reason:reason,requestId:requestId,itemStatus:"requested"})
		this.setState({
			itemName:'',
			reason:''
		})
		this.getItemRequest()
		db.collection("users").where("emailid","==",this.state.userId).get()
		.then(snapShot=>{
			snapShot.forEach(doc=>{
				db.collection("users").doc(doc.id).update({
					bookrequestactive:true
				})
			})
		})
		return(
			alert("Item requested Succesfully")
		)
	}

	getItemRequest = ()=>{
		db.collection('requestedItems').where("userId","==",this.state.userId).get()
		.then(snapShot=>{
			snapShot.forEach(doc=>{
				if(doc.data().itemStatus!=="recived"){
					this.setState({
						requestId:doc.data().requestId,
						itemStatus:doc.data().itemstatus,
						itemName:doc.data().itemName,
						docId:doc.id
					})
				}

			})
		})
	}

	itemrequestactive = ()=>{
		db.collection("users").where("emailid","==",this.state.userId).onSnapshot(snapShot=>{
			snapShot.forEach(doc=>{
				this.setState({
					itemrequestactive:doc.data().itemrequestactive,
					userDoc:doc.id
				})
			})
		})
	}
	
	updateItemRequestStaus = ()=>{
		db.collection("users").where("emailid","==",this.state.userId).onSnapshot(snapShot=>{
			snapShot.forEach(doc=>{
				db.collection("users").doc(doc.id).update({
					bookrequestactive:false
				})
			})
		})
		db.collection("requestedItems").doc(this.state.docId).update({
			itemStatus:"recived"
		})
	}

	sendNotification = ()=>{
		db.collection("users").where("emailid","==",this.state.userId).onSnapshot(snapShot=>{
			snapShot.forEach(doc=>{
				var name = doc.data().firstName+doc.data().lastName
				db.collection("allNotifications").where("reqestId","==",this.state.requestId).onSnapshot(snapShot=>{
					snapShot.forEach(doc=>{
						var donarId = doc.data().donarId
						var itemName = doc.data().itemName
					})
				})
			})
		})
	}

	componentDidMount(){
		this.itemrequestactive()
		this.getItemRequest()
	}

	render(){
		if(this.state.itemrequestactive === true){
			return(
				<View style={{flex:1, justifyContent:'center'}}>
					<View style={{borderColor:'cyan', borderWidth:10, justifyContent:'center', alignItems:'center', margin:10, padding:10}}>
						<Text>Item Name</Text>
						<Text>{this.state.bookName}</Text>
					</View>
					<View style={{borderColor:'cyan', borderWidth:10, justifyContent:'center', alignItems:'center', margin:10, padding:10}}>
						<Text>Item Status</Text>
						<Text>{this.state.itemStatus}</Text>
					</View>
					<TouchableOpacity style={{
						borderColor:'cyan', borderWidth:10, justifyContent:'center', alignItems:'center', margin:10, padding:10
						}}
						onPress={()=>{
							this.updateItemRequestStaus();
							this.sendNotification()
						}}>
						I recived the item
					</TouchableOpacity>
				</View>
			)
		}
		else{
		return(
			<View>
			<KeyboardAvoidingView>
			<MyHeader title='Request items' navigation={this.props.navigation}/>
			<TextInput placeholder="Item name" onChangeText={text=>{this.setState({itemName:text})}} value={this.state.itemName}/>
			<TextInput placeholder="Reason" multiline numberOfLines={5} onChangeText={text=>{this.setState({reason:text})}} value={this.state.reason}/>
			<TouchableOpacity onPress={()=>{this.addRequest(this.state.itemName,this.state.reason)}}>
			<Text>Request</Text>
			</TouchableOpacity>
			</KeyboardAvoidingView>
			</View>
		)
		}
	}
}