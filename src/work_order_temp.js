import React, {Component} from 'react';
import { StyleSheet, TextInput, View, Alert, Text,  Image, ImageBackground, Dimensions} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import ReactStickies from 'react-stickies';

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

class WorkOrder extends Component {

    static navigationOptions =
        {
            title: 'Work Order',

        };


    render()
    {

        let data = [{
            value: 'Overview',
        }, {
            value: 'Master Bedroom',
        }, {
            value: 'Garage',
        }];

        const {goBack} = this.props.navigation;

        return(

            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <View style={{flex:1}}>
                    <Text style={styles. WorkOrderTextStyle}>Checkout Inspection</Text>
                    <Text style={styles.TextComponentStyle}>8 Corporate Park, Irvine CA</Text>
                    <Text style={styles.TextComponentStyle}>Due: 11:00 AM 05/24/18</Text>
                    <View style={styles.DropDownStyle}>
                        <Dropdown
                            label='Select Area'
                            data={data}
                        />
                    </View>


                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'space-between'
                    }}>
                        <View style={{ justifyContent: 'center', alignItems: 'stretch',flexDirection: 'row', flex: 1}}>
                            <View style={ {margin: 7}}>
                                <Icon
                                    name='thumbs-up'
                                    type='font-awesome'
                                    color='#517fa4'
                                    onPress={() => console.log('hello')} />
                            </View>
                            <View style={ {margin: 7}}>
                                <Icon
                                    name='thumbs-down'
                                    type='font-awesome'
                                    color='#517fa4'
                                />
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                            <View style={ {margin: 7}}>
                                <Icon
                                    name='camera'
                                    type='font-awesome'
                                    color='#517fa4'
                                    onPress={() => console.log('hello')} />
                            </View>
                            <View style={ {margin: 7}}>
                                <Icon
                                    name='sticky-note'
                                    type='font-awesome'
                                    color='#517fa4'
                                />
                            </View>
                        </View>
                    </View>



                </View>


            </View>

        );
    }
}

const styles = StyleSheet.create({

    MainContainer :{


        flex:1,
        margin: 10,
    },

    container: {
        flex: 1,
        flexDirection: 'row'
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
        marginBottom: 13,
        marginTop: 8
    },
    WorkOrderTextStyle: {
        fontSize: 20,
        color: "#43889c",
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 8
    },

    DropDownStyle: {
        flex: 1,
        marginLeft: 25,
        marginRight: 25,
        marginTop: 5
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


export default WorkOrder;