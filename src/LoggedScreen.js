import React, {Component} from 'react';
import { StyleSheet, TextInput, View, Alert, Text,  Image, ImageBackground, Dimensions} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';
let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;
// Creating Profile activity.
class ProfileActivity extends Component {

    static navigationOptions =
        {
            title: 'Holidale Maintenance',

        };


    render()
    {

        const {goBack} = this.props.navigation;

        return(
            <View style = { styles.MainContainer }>

                <Text style = {styles.TextComponentStyle}> { this.props.navigation.state.params.Email } </Text>

                <View style= {{marginTop:20}}>
                    <Button
                        primary
                        block
                        onPress={ () => goBack(null) }
                    >
                        <Text style={{color: 'white'}}>Log Out</Text>
                    </Button>
                </View>

            </View>
        );
    }
}

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

export default ProfileActivity;