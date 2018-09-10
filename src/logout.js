import React, { Component } from 'react';

import { StyleSheet, TextInput, View, Alert, Text,  Image, ImageBackground, Dimensions,TouchableOpacity} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';


import { AsyncStorage } from "react-native";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

const ACCESS_TOKEN= 'access_token';


// Creating Logout Activity.
class Logout extends Component {

    // Setting up Logout Activity title.
    static navigationOptions =
        {
            title: 'Log Out',
            
        };
       
    _signOutAsync = async () => {
        await AsyncStorage.removeItem(ACCESS_TOKEN);
        this.props.navigation.navigate('Auth');
        };


    render() {
        return (

            <View style={{flex:1}}>
                <ImageBackground source={require('../assets/Images/login.jpg')} style={styles.backgroundImage}>
                    <View style={styles.logoImage}>
                        <Image source={require('../assets/Images/logout.png')} style={styles.logoImagedesign}>
                        </Image>
                    </View>
                    
                    <Text style={styles.WorkOrderTextStyle}>Maintenance App</Text>
                    <Text style={styles.WorkOrderTextStyle}>V0.1</Text>
                    <Text style={styles.WorkOrderTextStyle}>Paras</Text>
                            
                
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this._signOutAsync }>
                                <Text style={styles.TextStyle}> Logout </Text>
                    </TouchableOpacity>
                    </ImageBackground>
               </View>

        );
    }
}


const styles = StyleSheet.create({

    MainContainer :{

        justifyContent: 'center',
        flex:1,
        margin: 10,
    },

    TextInputStyleClass: {

        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
// Set border Hex Color Code Here.
        borderColor: '#2196F3',

        // Set border Radius.
        borderRadius: 5 ,

    },

    TextComponentStyle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        marginBottom: 15
    },

    backgroundImage: {
        flex: 1,
        width: width,
        height: height
    },
    logoImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImagedesign: {
        marginTop: 80,
        width: 300,
        resizeMode: 'contain'
    },
    inputStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 15
    },
    WorkOrderTextStyle: {
        fontSize: 20,
        color: "white",
        textAlign: 'center',
        marginTop: 14
    },
    error: {
        color: 'red',
        paddingTop: 10
    },
    SubmitButtonStyle: {
 
        marginTop:40,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#00BCD4',
        borderRadius:10,
      },
     
      TextStyle:{
          color:'#fff',
          textAlign:'center',
          fontSize:20
      }

});

export default Logout;