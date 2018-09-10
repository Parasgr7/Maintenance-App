import React, {Component} from 'react';
import { StyleSheet, View, Alert, Text, Dimensions,TouchableOpacity} from 'react-native';

import {Agenda} from 'react-native-calendars';



import { AsyncStorage } from "react-native";

const ACCESS_TOKEN= 'access_token';


let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;
// Creating Profile activity.
class ProfileActivity extends Component {

    static navigationOptions =
        {
            title: 'Home'

        }
        
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            data:{}
        };
    }

    _getToken = async () => {
        try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        // console.log(token);
 
        } catch (error) {

            console.log("Something went wrong");
        }
    }

    WorkOrderFunction = (item) =>{
        this._getToken();
        // const token=  AsyncStorage.getItem(ACCESS_TOKEN);


        this.state.data={id:item.id,check:item.check,userData:{token:108574197299687074239,date:item.date}};
        // console.log(this.state.data);
        this.props.navigation.navigate('ThirdPage',{param:this.state.data});
        
    }





    render()
    {
        const {goBack} = this.props.navigation;

        return(

            <View style={{
                flex: 1
            }}>
                <View style={styles.container}>
                    <Agenda
                        items={this.state.items}
                        loadItemsForMonth={this.loadItems.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        rowHasChanged={this.rowHasChanged.bind(this)}
                    />
                </View>

            </View>

        );
    }


    loadItems(day) {
        
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    this.state.items[strTime] = [];
                    const userData = {token:108574197299687074239, date:strTime};
                    fetch('http://localhost:3000/api/v1/work_orders/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {

                            // If server response message same as Data Matched
                            if(responseJson)
                            {
                                const numItems = responseJson.length;
                                for (let j = 0; j < numItems; j++) {
                                    this.state.items[strTime].push({
                                        name: responseJson[j].name,
                                        id: responseJson[j].id,
                                        address: responseJson[j].address,
                                        status: responseJson[j].status,
                                        height: Math.max(50, Math.floor(Math.random() * 150)),
                                        check:responseJson[j].check,
                                        date:strTime
                                    });
                                }

                            }
                            else{

                                Alert.alert(responseJson);
                            }

                        }).catch((error) => {
                        console.error(error);
                    });

                }  
            }
            const newItems = {};
            Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
            this.setState({
                items: newItems
            });
        }, 1000);

    }

    renderItem(item) {
        return ( <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={()=>{ this.WorkOrderFunction(item) } }>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TextStyle}>{item.name}</Text>
                    <Text style={styles.TextStyle3}>{item.status}</Text>
                </View>
                <Text style={styles.TextStyle2}>{item.address}</Text>
                 </TouchableOpacity>
           


        );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }
}

const styles = StyleSheet.create({

    MainContainer :{


        flex:1,
        margin: 10,
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        // marginTop: 50

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
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30,
        marginLeft:30
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
          fontSize:16,
          marginLeft:10,
          fontWeight:'bold'
      },
      TextStyle2:{
        color:'#fff',
        fontSize:14,
        marginLeft:10
    },
    TextStyle3:{
        color:'#fff',
        fontSize:15,
        marginLeft:60
        
    }

});



export default ProfileActivity;