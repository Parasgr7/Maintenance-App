import React, { Component } from 'react';
import { View, Text,  Image, ImageBackground,TouchableOpacity} from 'react-native';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/logout_css";

class Logout extends Component {
    static navigationOptions =
        {
            title: 'Log Out',
            
        };
    _signOutAsync = async () => {
        await AsyncStorage.removeItem('session_data');
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
                
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this._signOutAsync }>
                                <Text style={styles.TextStyle}> Logout </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>

        );
    }
}


export default Logout;