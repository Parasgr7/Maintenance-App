import React from 'react';
import {View, Text, AsyncStorage, Dimensions, Image, ImageBackground} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';

var background = require('../assets/Images/login.jpg');
var logo = require('../assets/Images/logo.png');

var height= Dimensions.get('window').height;
var width= Dimensions.get('window').width;

const ACCESS_TOKEN = 'acess_token';

class SignIn extends React.Component{
  constructor() {
    super()

  this.state = {
    email: "",
    password: "",
    error: ""
  }
}

    async storeToken (accessToken) {
      try {
         await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
         this.getToken();
      } catch (error) {
          console.log("something went wrong")
      }
    }

    async getToken (accessToken) {
        try {
          let token = await AsyncStorage.getItem(ACCESS_TOKEN, accessToken);
            console.log("Token is:" + token);
        } catch (error) {
            console.log("something went wrong")
        }
    }

    async removeToken (accessToken) {
        try {
           await AsyncStorage.removeItem(ACCESS_TOKEN, accessToken);
           this.getToken();
        } catch (error) {
            console.log("something went wrong")
        }
    }

async onLoginPressed() {
  this.setState({showProgress: true})
  try {
    let response = await fetch('http://dev4.holidale.org/api/v1/login', {
                            method: 'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({

                                email: this.state.email,
                                password: this.state.password,

                            })
                          });
    let res = await response.text();
    console.log(response.status);
    if (response.status >= 200 && response.status < 300) {
        //Handle success
        let accessToken = res;
        console.log(accessToken);
        //On success we will store the access_token in the AsyncStorage
        this.storeToken(accessToken);
        //this.redirect('home');
    } else {
        //Handle error
        let error = res;
        throw error;
    }
  } catch(error) {
      this.removeToken();
      this.setState({error: error});
      console.log("error " + error);
      //console.log(response.status);
      this.setState({showProgress: false});
  }
}

  render(){
    return(
      <View style={{flex:1}}>
        <ImageBackground source={background} style={styles.backgroundImage}>
        <View style={styles.logoImage}>
          <Image source={logo} style={styles.logoImagedesign}>
          </Image>
        </View>
           <View style={styles.inputStyle}>
              <Form>
                 <Item floatingLabel>
                   <Label style={{color: 'white'}}>Email</Label>
                   <Input
                       autoCorrect={false}
                       onChangeText={(email)=>this.setState({email})}
                   />
                 </Item>
                 <Item floatingLabel>
                    <Label style={{color: 'white'}}>Password</Label>
                    <Input
                        autoCorrect={false}
                        onChangeText={(password)=>this.setState({password})}

                    />
                 </Item>
              </Form>
              <View style= {{marginTop:20}}>
                 <Button
                   primary
                   block
                   onPress={this.onLoginPressed.bind(this)}
                 >
                   <Text style={{color: 'white'}}>Sign In</Text>
                 </Button>
              </View>

              <Text style={styles.error}>
                 {this.state.error}
              </Text>

           </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles= {
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
}

export default SignIn;
