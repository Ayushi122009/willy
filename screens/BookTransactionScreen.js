import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TextInput, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase'
import db from '../config'

export default class Transactionscreen extends React.Component {
  constructor(){
    super();
    this.state= {
      hasCameraPermissions: null,
      scanned: false,
      scannedBookId: '',
      scannedStudentId: '',
      buttonState: 'normal',
    }
  }

  getCameraPermissions= async (id) => {
    const {status}= await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status=== "granted",
      buttonState: 'id',
      scanned: false,
    })
  }

handleBarCodeScanned= async ({type,data}) => {
  const {buttonState}= this.state
  
  if (buttonState==="BookId"){

  
  this.setState({
    scanned: true,
    scannedBookId: data,
    buttonState: 'normal',
  })
}
else if (buttonState==="StudentId"){
  this.setState({
    scanned: true,
    scannedStudentId: data,
    buttonState: 'normal',
  })
}
}

handleTransaction= () => {
var transactionMessage 

db.collections("books").doc(this.state.scannedBookId).get()
.then ((doc)=> {
  var book = doc.data()
    if(book.availability){
this .initiateBookIssue()
transactionMessage= "Book Issued"
    }
  else {
    this.initiateBookReturn();
    transactionMessage= "Book Returned"
  }
})
}

initiateBookIssue=async()=> {
  db.collections("transactions").add({
    'studentId': this.state.scannedStudentId,
    'bookId': this.state.scannedBookId,
    'date': firebase.firestore.Timestamp.now().toDate(),
    'transactionType': "Issue",
  })
  db.collection("books").doc(this.state.scannedBookId).update({
    'bookAvailability': false
  })
  db.collection("students").doc(this.state.scannedStudentId).update({
    'numberOfBooksIssued': firebase.firestore.FieldValue.increment(1)
    
  })
  this.setState({
    scannedStudentId:'',
    scannedBookId: ''
  })

}

initiateBookReturn=async()=> {
  db.collections("transactions").add({
    'studentId': this.state.scannedStudentId,
    'bookId': this.state.scannedBookId,
    'date': firebase.firestore.Timestamp.now().toDate(),
    'transactionType': "Return",
  })
  db.collection("books").doc(this.state.scannedBookId).update({
    'bookAvailability': true
  })
  db.collection("students").doc(this.state.scannedStudentId).update({
    'numberOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
    
  })
  this.setState({
    scannedStudentId:'',
    scannedBookId: ''
  })

}


    render(){
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;
      const hasCameraPermissions= this.state.hasCameraPermissions;

      if(buttonState!=="normal"&& hasCameraPermissions){
        return(
          <BarCodeScanner 
          onBarCodeScanned= {scanned? undefined: this.handleBarCodeScanned}
          style= {StyleSheet.absoluteFillObject}/>
        )
      }
      else if(buttonState==="normal"){

      
        return (
            <View style={styles.container}>
            <View>
            <Image 
            source= {require("../assets/icon.png")}
            style = {{width: 200, height: 200}}/>
            <Text style = {{textAlign: 'center', fontSize: 30}}>Wily</Text>
            </View>
            <View 
            style = {styles.inputView}>
            <TextInput 
            style = {styles.inputBox}
            placeholder= "Book Id"
            value = {this.state.scannedBookId}/>
            <TouchableOpacity
            style= {styles.scanButton}
            onPress ={()=> {
              this.getCameraPermissions("BookId")
            }}>
              <Text style= {styles.buttonText}>Scan</Text>
              </TouchableOpacity>
              </View>
              <TouchableOpacity 
              style= {styles.submitButton}
              onPress= {async()=> {this.handleTransaction()}}>
              <Text style= {styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
             <View style= {styles.inputView}>
             <TextInput 
             style = {styles.inputBox}
             placeholder= "Student Id"
             value= {this.state.scannedStudentId}/>

              <TouchableOpacity 
              style= {styles.scanButton}
              onPress= {()=>{
              this.getCameraPermissions("StudentId")
            }}>
             
            <Text style = {styles.buttonText}>Scan </Text>

              </TouchableOpacity>
              
            </View>
            </View>
           
          );
          
              }
    }
   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  displayText:{
    fontSize: 15,
    textDecorationLine: 'underline',

  },
  scanButton:{
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
  },
  buttonText:{
    fontSize: 20,
  },
  inputView:{
   flexDirection: 'row',
   margin: 20,

  },
  inputBox: {
    width: 200,
    height:40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,

  },
  scanButton:{
    backgroundColor: 'blue',
    width: 50,
    borderWidth: 0,
    borderLeftWidth: 0,
  },
  submitButton:{
    backgroundColor: 'cyan',
    width: 100,
    height: 50,

  },
  submitButtonText:{
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',

  },

})


  