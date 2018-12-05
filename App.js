import React, { Component } from 'react';
import { View, Alert, Text, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback,Image, ImageBackground, Dimensions,ActivityIndicator,KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Form, Item, Input} from 'native-base';
import { AsyncStorage } from "react-native";
import { createBottomTabNavigator,createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Icon from '@expo/vector-icons/FontAwesome';
import WorkOrder from "./src/work_order";
import ProfileActivity from './src/LoggedScreen';
import Logout from "./src/logout";
import SwitchSelector from 'react-native-switch-selector';
import styles from "./assets/stylesheets/login_css";
import GLOBALS from './src/Globals';

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

        super(props);
    
        this.state = {

            UserEmail: '',
            UserPassword: '',
            worker:'0',
            isLoading: false,
        }
        this.UserLoginFunction = this.UserLoginFunction.bind(this);
        console.disableYellowBox = true;
    }
    componentWillMount(){
        this._getToken();
        navigator.geolocation.getCurrentPosition((position)=>{
            this.setState({latitude:parseFloat(position.coords.latitude)});
            this.setState({longitude: parseFloat(position.coords.longitude)});
        });
    }

    

    _storeToken = async responseJson => {
        try{

            console.log("Token information, worker, user_id:", responseJson.auth_token, this.state.worker, responseJson.user_id )
            userdata={"access_token": responseJson.json.auth_token, "worker": this.state.worker, "user_id": responseJson.json.user_id};
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
            this.props.navigation.navigate(token? 'App':'Auth');
        }
        } catch (error) {
            // console.log(error);
            console.log("Something went wrong while getting token");
        }
    }

    UserLoginFunction = () =>{
        this.setState({isLoading: true});

        UserEmail   = this.state.UserEmail ;
        UserPassword  = this.state.UserPassword ;

        if(this.state.worker=='1')
        {
        fetch(GLOBALS.AUTH_URL, {
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
                    if(typeof(responseJson)=='object')
                    {   
                        this._storeToken(responseJson);
                        this.setState({isLoading: false});
                        // Then open Profile activity and send user email to profile activity.
                        this.props.navigation.navigate('App');
                    
                    }
                    else{
                        // this.props.navigation.navigate('App');
                        Alert.alert("Provide Proper Credentials");
                        this.setState({isLoading: false});
                    }

                }).catch((error) => {
                console.log(error);
                Alert.alert("Server Unavailable");
                this.setState({isLoading: false});
                // console.error(error);
            });
        }
        else if (this.state.worker==='0'){
            fetch(GLOBALS.AUTH_URL, {
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
                    if(typeof(responseJson)=='object')
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

        return (

            <View style={{flex:1}}>
                <ImageBackground source={require('./assets/Images/login.jpg')} style={styles.backgroundImage}>
                    <View style={styles.logoImage}>
                        <Image source={require('./assets/Images/logout.png')} style={styles.logoImagedesign}>
                        </Image>
                    </View>
                    
                <KeyboardAvoidingView style={styles.inputStyle} behavior="padding" enabled>
                    <Form>
                            <Item style={[{marginLeft: 0}]}>
                                <TextInput onSubmitEditing={Keyboard.dismiss} style={[{fontSize: 18, flex: 1}]}
                                    autoCorrect={false}
                                    placeholder="Email"
                                    textContentType="emailAddress"
                                    placeholderTextColor="white"
                                    onChangeText={UserEmail => this.setState({UserEmail})}
                                />
                            </Item>
                
                            <Text>{"\n"}</Text>
                            <Item style={[{marginLeft: 0}]}>
                                <TextInput onSubmitEditing={Keyboard.dismiss} style={[{fontSize: 18, flex: 1}]}
                                    autoCorrect={false}
                                    placeholder="Password"
                                    placeholderTextColor="white"
                                    secureTextEntry={true}
                                    onChangeText={UserPassword => this.setState({UserPassword})}
                                />
                            </Item>
                            <Text>{"\n"}</Text>
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
          backgroundColor: '#006075',
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
                    navigationOptions: {
                      headerStyle: {
                        backgroundColor: '#007085',
                    },
                      headerTintColor: '#fff',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                      },
                      headerBackground: (
                        <Image
                          style={{width: 150,height:adjst, flex:1,alignSelf: 'center', marginTop:5, marginLeft:8}}
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
