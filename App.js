import React, { Component } from 'react';

import { StyleSheet, View, Alert, Text,  Image, ImageBackground, Dimensions,KeyboardAvoidingView,TextInput,TouchableHighlight, TouchableOpacity} from 'react-native';
import {Form, Item, Label, Input} from 'native-base';

import { AsyncStorage } from "react-native";
import { createBottomTabNavigator,createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Icon from '@expo/vector-icons/FontAwesome';
import WorkOrder from "./src/work_order";
import ProfileActivity from './src/LoggedScreen';
import Logout from "./src/logout";
import SwitchSelector from 'react-native-switch-selector';

import styles from "./assets/stylesheets/login_css";
import FlashMessage from 'react-native-flash-message';

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;


// Creating Login Activity.
class LoginActivity extends Component {

    // Setting up Login Activity title.
    static navigationOptions =
        {
            header:null
        };
       
       
    constructor(props) {

        super(props)
    
        this.state = {

            UserEmail: '',
            UserPassword: '',
            worker:'0'

        }

    }
    

    _storeToken = async accessToken => {
        try{
            userdata={"access_token": accessToken, "worker": this.state.worker};
            item=[];
            item.push(userdata);
        await AsyncStorage.setItem('session_data',JSON.stringify(item))
        this._getToken();
    }catch(error){
        console.log("Something went wrong");
    }
        
    }


    _getToken = async () => {
        try {
        const token = await AsyncStorage.getItem('data');
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

        if(this.state.worker=='1')
        {
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
        else if (this.state.worker==='0'){
            fetch('http://localhost:3000/api/v1/cleaner_login', {
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
                    if(typeof(responseJson)=='number')
                    {  
                        this._storeToken(responseJson);
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
                                    secureTextEntry={true}
                                    onChangeText={UserPassword => this.setState({UserPassword})}
                                />  
                                
                            </Item>
                  
                            
                      
                         </Form>
                         <View style={styles.Select}>
                         <SwitchSelector
                            initial={0}
                            onPress={value => {this.setState({ worker: value });console.log(value)}}
                            // textColor='#7a44cf' //'#7a44cf'
                            // selectedColor='#7a44cf'
                            buttonColor='#6db3bc'
                            // borderColor='#7a44cf'
                            hasPadding
                            // style={styles.SubmitButtonStyle}
                            options={[
                                { label: 'Cleaner', value: '0' }, //images.feminino = require('./path_to/assets/img/feminino.png')
                                { label: 'Maintainer', value: '1'} //images.masculino = require('./path_to/assets/img/masculino.png')
                            ]}
                         />
                         </View>
                         
                            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.UserLoginFunction }>
                                <Text style={styles.TextStyle}> Sign In </Text>
                            </TouchableOpacity>
  

                    </KeyboardAvoidingView>

                    
                </ImageBackground>
                <FlashMessage position="top" />
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