import React, { Component } from 'react';

import { StyleSheet, View, Alert, Text,  Image, ImageBackground, Dimensions,KeyboardAvoidingView,TextInput,TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';
import {Form, Item, Label, Input} from 'native-base';

import { AsyncStorage } from "react-native";
import { createBottomTabNavigator,createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Icon from '@expo/vector-icons/FontAwesome';


import WorkOrder from "./src/work_order";
import ProfileActivity from './src/LoggedScreen';
import Logout from "./src/logout";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

const ACCESS_TOKEN= 'access_token';


// Creating Login Activity.
class LoginActivity extends Component {

    // Setting up Login Activity title.
    static navigationOptions =
        {
            // title: 'Log In',
            header:null
        };
       
       
    constructor(props) {

        super(props)
    
        this.state = {

            UserEmail: '',
            UserPassword: ''

        }

    }


    _storeToken = async accessToken => {
        try{
        await AsyncStorage.setItem(ACCESS_TOKEN,JSON.stringify(accessToken))
        this._getToken();
    }catch(error){
        console.log("Something went wrong");
    }
        
    }


    _getToken = async () => {
        try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        if (token !== null) {
            this.props.navigation.navigate(token? 'App':'Auth');
        }
        } catch (error) {
            console.log(error);
            console.log("Something went wrong");
        }
    }

    UserLoginFunction = () =>{

        const { UserEmail }  = this.state ;
        const { UserPassword }  = this.state ;


        fetch('http://18.222.123.107/api/v1/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                email: UserEmail,

                password: UserPassword

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                
                // If server response message same as Data Matched
                if(typeof(responseJson)=='string')
                {   
                    this._storeToken(responseJson);
                    //Then open Profile activity and send user email to profile activity.
                    this.props.navigation.navigate('App');
                   
                }
                else{
                    this.props.navigation.navigate('App');
                    // Alert.alert("Provide Proper Credentials");
                }

            }).catch((error) => {
            console.error(error);
        });


    }

    render() {
        return (

            <View style={{flex:1}}>
                <ImageBackground source={require('./assets/Images/login.jpg')} style={styles.backgroundImage}>
                    <View style={styles.logoImage}>
                        <Image source={require('./assets/Images/logout.png')} style={styles.logoImagedesign}>
                        </Image>
                    </View>
                    
                    <KeyboardAvoidingView style={styles.inputStyle} behavior="padding" enabled>
                        <Form>
                            <Item >
                                <Input
                                    autoCorrect={false}
                                    placeholder="Email"
                                    placeholderTextColor="white"
                                    onChangeText={UserEmail => this.setState({UserEmail})}
                                />
                            </Item>
                            <Item >
                                <Input
                                    autoCorrect={false}
                                    placeholder="Password"
                                    placeholderTextColor="white"
                                    onChangeText={UserPassword => this.setState({UserPassword})}
                                />
                            </Item>
                            </Form>
                            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.UserLoginFunction }>
                                <Text style={styles.TextStyle}> Sign In </Text>
                            </TouchableOpacity>
  

                    </KeyboardAvoidingView>

                    
                </ImageBackground>
            </View>

        );
    }
}

const Tabs = createBottomTabNavigator({
    Home:   {
        screen: ProfileActivity,
        navigationOptions: () => ({
            tabBarIcon: ({tintColor}) => (
                <Icon name="home" size={24} color={tintColor}/>
            )
            
        })},
    User:  {
        screen: Logout,
        navigationOptions: () => ({
            tabBarIcon: ({tintColor}) => (
                <Icon name="user" size={24} color={tintColor}/>
            )
            
        })
    } 
},{
    tabBarOptions: {
        showLabel: false,
        activeTintColor: '#45AAC5',
        inactiveTintColor: 'white',
        style: {
          backgroundColor: 'black',
        },
      }
    }
)

const AppStack = createStackNavigator({ 
                SecondPage: Tabs, 
                ThirdPage: WorkOrder, 
                navigationOptions: () => ({
                        
                }),
                LastPage: {
                       screen: Logout,
                      

            
                } },{
                    // initialRouteName: 'SecondPage',
                    navigationOptions: {
                      headerStyle: {
                        backgroundColor: 'black',
                      },
                      headerTintColor: '#fff',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                      },
                      headerBackground: (
                        <Image
                          style={{width: 150,height:100,resizeMode: 'contain',alignItems: 'center',marginLeft:28}}
                          source= {require('./assets/Images/logout.png')}
                        />
                      ),
                    },
                  }
                
  
  );
const AuthStack = createStackNavigator({ First: LoginActivity });



export default MaintenanceApp = createSwitchNavigator(
    {
        App: AppStack,
        Auth: AuthStack,

    },
    {
        initialRouteName: 'Auth',
    }
);

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
    error: {
        color: 'red',
        paddingTop: 10
    },
    SubmitButtonStyle: {
 
        marginTop:30,
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