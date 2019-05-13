import React, { Component } from 'react';
import { View, Text,  Image, ImageBackground,TouchableOpacity} from 'react-native';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/logout_css";
import { StackNavigator } from 'react-navigation';
import GLOBALS from './Globals';

class Logout extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            user_id: "",
            worker: "",
            token: ""
        };
        this._signOutAsync=this._signOutAsync.bind(this);
    }
    
    componentDidMount(){
        this._getToken();
    }
    
    static navigationOptions =
        {
            title: 'Log Out',
            header: null
        };
    
    _getToken = async () => {
        try {
            data = await AsyncStorage.getItem('session_data');
            this.setState({token: JSON.parse(data)[0].auth_token, worker: JSON.parse(data)[0].worker,user_id: JSON.parse(data)[0].user_id});
            console.log("Token information: ", JSON.parse(data));
        } catch (error) {
            console.log("_getToken in logout.js failed");
        }
    }
    
    _signOutAsync = async () => {
        await fetch(GLOBALS.AUTH_URL+'logout/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: this.state.user_id
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.json.result_code==0){
                  this.setState(() => {
                    console.log('Logged out!');
                    return { unseen: "Logged out!" }
                    });
                  return;
                }
            }).catch((error) => {
            console.error(error);
        });
        
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
                    
                    <Text style={styles.WorkOrderTextStyle2}>Maintenance App</Text>
                    <Text style={styles.WorkOrderTextStyle2}>V1.0</Text>                            
                
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this._signOutAsync }>
                                <Text style={styles.TextStyle}> Logout </Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>

        );
    }
}


export default Logout;
