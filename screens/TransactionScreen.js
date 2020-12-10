 
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image,TextInput,Alert, KeyboardAvoidingView, PickerIOSComponent } from 'react-native';
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import firebase from "firebase"
import db from "../config"

export default class TransactionScreen extends React.Component {
  constructor (){
super ()
this.state={
hasCameraPermissions:null,
scanned:false,
scannnedBookId:"",
scannedStudentId:"",
buttonState : 'normal',
transactionMessage:""
}
  }
  getCameraPermission=async(ID)=>{
const{status}=await Permissions.askAsync(Permissions.CAMERA)
this.setState({
hasCameraPermissions:status==='granted',
buttonState:ID,
scanned:false

})
  }
  handleTransaction=async()=>{
    var transactionMessage=null
    db.collection("books").doc(this.state.scannnedBookId).get().then((doc)=>{
      var book=doc.data()
      if(book.bookAvailability){
this.initiateBookIssue()
transactionMessage="bookIssued"
Alert.alert(transactionMessage)
      }
      else {
        this.initiateBookReturn()
        transactionMessage="bookReturn"
        Alert.alert(transactionMessage)
        }
      
    })
    this.setState({transactionMessage:transactionMessage})
  }
  initiateBookIssue=async()=>{
db.collection("transactions").add({
  studentId:this.state.scannedStudentId,
  bookId: this.state.scannnedBookId,
  date:firebase.firestore.Timestamp.now().toDate(),
  transactionType:'issue'
})
db.collection("books").doc(this.state.scannnedBookId).update({
  bookAvailability:false
})
db.collection("students").doc(this.state.scannedStudentId).update({
  numberOfBooksIssued:firebase.firestore.FieldValue.increment(1)
})
this.setState({
  scannedStudentId:"",
  scannnedBookId:"",
  
})
  }
  initiateBookReturn=async()=>{
    db.collection("transactions").add({
      studentId:this.state.scannedStudentId,
      bookId: this.state.scannnedBookId,
      date:firebase.firestore.Timestamp.now().toDate(),
      transactionType:'return'
    })
    db.collection("books").doc(this.state.scannnedBookId).update({
      bookAvailability:true
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
      numberOfBooksIssued:firebase.firestore.FieldValue.increment(-1)
    })
    this.setState({
      scannedStudentId:"",
      scannnedBookId:"",
      
    })
      }
handleBarCodeScanned= async({type,data})=>{
  const buttonState=this.state.buttonState
if (buttonState === "bookId"){
this.setState({
  scanned:true,
  scannnedBookId:data,
  buttonState:'normal'
})
}
else if (buttonState==="studentId"){
  this.setState({
    scanned:true,
    scannnedStudentId:data,
    buttonState:'normal'
  
  }
  )
}
}
  render (){
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState
    if (buttonState!=='normal'&& hasCameraPermissions){
      return(
<BarCodeScanner style = {StyleSheet.absoluteFillObject}
onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
>


</BarCodeScanner>


      )

    }
    else if (buttonState==='normal'){
    return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
       <View>    
         
          <Image source={require("../assets/booklogo.jpg")}style={{width:200,height:200}}></Image>
          <Text style={{textAlign:"center", fontSize:30}}>E-library</Text>
          </View>
          <View style= {styles.inputVeiw}>
<TextInput style={styles.inputBox}placeholder="bookId" onChangeText={(text)=>{
this.setState({scannnedBookId:text})

}}value = {this.state.scannnedBookId}></TextInput>
<TouchableOpacity style = {styles.scanButton} 
      onPress = {()=>{
        this.getCameraPermission("bookId")
      }}
      >
              <Text style ={styles.buttonText}>Scan</Text>
   </TouchableOpacity>
          </View>
          <View style= {styles.inputVeiw}>
<TextInput style={styles.inputBox}placeholder="studentId" onChangeText={(text)=>{
this.setState({scannedStudentId:text})

}}value = {this.state.scannedStudentId}></TextInput>
<TouchableOpacity style = {styles.scanButton} 
      onPress = {()=>{
        this.getCameraPermission("studentId")
      }}
      >
              <Text style ={styles.buttonText}>Scan</Text>
   </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.submitButton}onPress={async()=>{
            var transactionMessage=await this.handleTransaction()
            
          }}><Text style={styles.submitButtonText}>submit</Text></TouchableOpacity>
    </ KeyboardAvoidingView>
  );
}
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton:{
    backgroundColor:'#2196F3',
     
width:50,
borderWidth:1.5,
borderLeftWidth:0,
  },
  buttontext:{
fontsize:20,
textAlign:"center",
marginTop:10,
  },
  inputVeiw:{
    flexDirection:"row",
    margin:20
  },
  inputBox:{width:200,height:40,borderWidth:1.5,borderRightWidth:0,fontSize:20},
  submitButton:{backgroundColor:"pink",width:100,height:50},
  submitButtonText:{padding:10,textAlign:"center",fontSize:20,fontWeight:"bold",color:"white"}
});
