import React, { Component } from 'react';
import { View, Text,  Image, ImageBackground,TouchableOpacity} from 'react-native';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/logout_css";
import call from 'react-native-phone-call';


class Contact extends Component {
    
    static navigationOptions =
        {
            title: 'Contact',
            header: null
        };
    _signOutAsync = async () => {
        await AsyncStorage.removeItem('session_data');
        this.props.navigation.navigate('Auth');
        };
    
    call= async ()=>{

        const args = {
            number: '(855) 346-3050', // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
          }
           
          call(args).catch(console.error)
    }

    render() {
        return (
            
            <View style={{flex:1}}>
                <ImageBackground source={require('../assets/Images/login.jpg')} style={styles.backgroundImage}>
                    <View style={styles.logoImage}>
                        <Image source={require('../assets/Images/logout.png')} style={styles.logoImagedesign}>
                        </Image>
                    </View>
                    
                    <Text style={styles.WorkOrderTextStyle}>ADDRESS : </Text>
                    <Text style={styles.WorkOrderTextStyle1}>9 Corporate Park, Ste 130 Irvine CA 92606</Text>
                    <Text style={styles.WorkOrderTextStyle}>PHONE : </Text>
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.call}>
                             <Text style={styles.TextStyle}>Call</Text>
                    </TouchableOpacity>                            
                </ImageBackground>
            </View>

        );
    }
}


export default Contact;
