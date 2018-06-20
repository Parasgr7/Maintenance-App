import React from 'react';
import {View, Text, Dimensions, Image, ImageBackground} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';

var background = require('../assets/Images/login.jpg');
var logo = require('../assets/Images/logo.png');

var height= Dimensions.get('window').height;
var width= Dimensions.get('window').width;

class SignIn extends React.Component{
  state = {
    email: "",
    password: ""
  }
  logIn = () =>{

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
                        secureTextEntry
                    />
                 </Item>
              </Form>
              <View style= {{marginTop:20}}>
                 <Button
                   primary
                   block
                   onPress={this.logIn}
                 >
                   <Text style={{color: 'white'}}>Sign In</Text>
                 </Button>
              </View>
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
  }
}

export default SignIn;
