import React, { Component } from 'react';

import { StyleSheet, TextInput, View, Alert, Text,  Image, ImageBackground, Dimensions} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';

import ProfileActivity from './src/LoggedScreen';

// Importing Stack Navigator library to add multiple activities.
import { createStackNavigator } from 'react-navigation';

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

// Creating Login Activity.
class LoginActivity extends Component {

    // Setting up Login Activity title.
    static navigationOptions =
        {
            title: 'Log In',
        };

    constructor(props) {

        super(props)

        this.state = {

            UserEmail: '',
            UserPassword: ''

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
                if(responseJson)
                {

                    //Then open Profile activity and send user email to profile activity.
                    this.props.navigation.navigate('Second', { Email: UserEmail });

                }
                else{

                    Alert.alert(responseJson);
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
                        <Image source={require('./assets/Images/logo.png')} style={styles.logoImagedesign}>
                        </Image>
                    </View>
                    <View style={styles.inputStyle}>
                        <Form>
                            <Item floatingLabel>
                                <Label style={{color: 'white'}}>Email</Label>
                                <Input
                                    autoCorrect={false}
                                    onChangeText={UserEmail => this.setState({UserEmail})}
                                />
                            </Item>
                            <Item floatingLabel>
                                <Label style={{color: 'white'}}>Password</Label>
                                <Input
                                    autoCorrect={false}
                                    onChangeText={UserPassword => this.setState({UserPassword})}

                                />
                            </Item>
                        </Form>
                        <View style= {{marginTop:20}}>
                            <Button
                                primary
                                block
                                onPress={this.UserLoginFunction}
                            >
                                <Text style={{color: 'white'}}>Sign In</Text>
                            </Button>
                        </View>

                    </View>
                </ImageBackground>
            </View>

        );
    }
}



export default MainProject = createStackNavigator(
    {
        First: { screen: LoginActivity },

        Second: { screen: ProfileActivity }

    });

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
        marginTop: 100,
        width: 100,
        height: 100,
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
    }

});