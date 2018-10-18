import React, { Component } from 'react';

import { StyleSheet, View, Alert, Text,  Image, ImageBackground, Dimensions,ActivityIndicator,KeyboardAvoidingView,TextInput,TouchableHighlight, TouchableOpacity} from 'react-native';
import {Form, Item, Label, Input} from 'native-base';

import { AsyncStorage } from "react-native";
import { createBottomTabNavigator,createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Icon from '@expo/vector-icons/FontAwesome';
import WorkOrder from "./src/work_order";
import ProfileActivity from './src/LoggedScreen';
import Logout from "./src/logout";
import SwitchSelector from 'react-native-switch-selector';
import styles from "./assets/stylesheets/login_css";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;
let diff = height-width;
let adjst;

 if (diff<420){
    adjst=80;
 }
 else if (420<=diff<=470){
    adjst=120;
 }
 else if(diff>470){
    adjst=95;
 }
 
 else{
    // break;
 }

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
            worker:'0',
            isLoading: false

        }

    }
    componentWillMount(){
        this._getToken();
    }

    

    _storeToken = async accessToken => {
        try{
            userdata={"access_token": accessToken, "worker": this.state.worker};
            item=[];
            item.push(userdata);
        await AsyncStorage.setItem('session_data',JSON.stringify(item))
        this._getToken();
        }
        catch(error){
            console.log("Something went wrong");
        }
        
    }


    _getToken = async () => {
        try {
        const token = await AsyncStorage.getItem('session_data');
        this.setState({token: token});
        if (token !== null) {
            this.props.navigation.navigate(token? 'App':'Auth',{ name: 'Brent' });
        }
        } catch (error) {
            // console.log(error);
            console.log("Something went wrong while getting token");
        }
    }

    UserLoginFunction = () =>{
        this.setState({isLoading: true});

        const { UserEmail }  = this.state ;
        const { UserPassword }  = this.state ;

        if(this.state.worker=='1')
        {
        fetch('http://dev4.holidale.org/api/v1/login', {
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
                        this.setState({isLoading: false});
                        // Then open Profile activity and send user email to profile activity.
                        // this.props.navigation.navigate('App');
                    
                    }
                    else{
                        // this.props.navigation.navigate('App');
                        Alert.alert("Provide Proper Credentials");
                        this.setState({isLoading: false});
                    }

                }).catch((error) => {
                Alert.alert("Server Unavailable");
                this.setState({isLoading: false});
                // console.error(error);
            });
        }
        else if (this.state.worker==='0'){
            fetch('http://dev4.holidale.org/api/v1/cleaner_login', {
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
                        this.setState({isLoading: false});
                        this.props.navigation.navigate('App');
                    
                    }
                    else{
                        // this.props.navigation.navigate('App');
                        Alert.alert("Provide Proper Credentials");
                        this.setState({isLoading: false});
                    }

                }).catch((error) => {
                    Alert.alert("Server Unavailable");
                    this.setState({isLoading: false});
                // console.error(error);
            });
        }


    }
    _maybeRenderUploadingOverlay = () => {
        if (this.state.isLoading) {
            return (
                <View
                    style={ styles.maybeRenderUploading}>
                    <ActivityIndicator size="small" color="black"/>
                </View>
            );
        }
    };
    render() {
        // console.log(height,width);
        // console.log(diff);
        // console.log(adjst);
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
                            onPress={value => {this.setState({ worker: value })}}
                            buttonColor='#6db3bc'
                            // borderColor='#7a44cf'
                            hasPadding
                            options={[
                                { label: 'Cleaner', value: '0' }, 
                                { label: 'Maintainer', value: '1'} 
                            ]}
                         />
                         </View>
                         
                            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.UserLoginFunction }>
                            {this._maybeRenderUploadingOverlay()}
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
                          style={{width: 150,height:adjst,resizeMode: 'contain',alignItems: 'center',marginLeft:28}}
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