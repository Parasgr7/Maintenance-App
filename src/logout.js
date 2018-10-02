import React, { Component } from 'react';

import { StyleSheet, TextInput, View, Alert, Text,  Image, ImageBackground, Dimensions,TouchableOpacity} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';


import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/logout_css";

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


export default Logout;