import React, {Component} from 'react';
import { View, Alert, Text, Dimensions,TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/calendar_page_css";


class ProfileActivity extends Component {

    static navigationOptions =
        {
            title: 'Home'

        }
        
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            data:{},
            visible: false
        };
    }
    componentDidMount(){
        this._getToken();
        navigator.geolocation.getCurrentPosition((position)=>{
            this.setState({latitude:parseFloat(position.coords.latitude)}) ;
            this.setState({longitude: parseFloat(position.coords.longitude)});
       
       })
    }
   

    _getToken = async () => {
        try {
           data = await AsyncStorage.getItem('session_data');
           this.setState({token: JSON.parse(data)[0].access_token, worker: JSON.parse(data)[0].worker });
        
        } catch (error) {
            console.log("Something went wrong in logged screen");
        }
    }

     degreesToRadians=(degrees)=> {
        return degrees * Math.PI / 180;
      }

    distanceInKmBetweenCoordinates=(lat1, lon1, lat2, lon2)=> {
        var earthRadiusKm = 6371;
      
        var dLat = this.degreesToRadians(lat2-lat1);
        var dLon = this.degreesToRadians(lon2-lon1);
      
        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);
      
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusKm * c;
    }

    WorkOrderFunction = (item) =>{
       
        dist=this.distanceInKmBetweenCoordinates(item.latitude,item.longitude,this.state.latitude,this.state.longitude);
        console.log(dist);
        if(dist<0.02)
        {   
            timeStamp = new Date();
            house_id = item.house_id;
            this.state.data={id:item.id,check:item.check,userData:{token:this.state.token,date:item.date}};
            this.props.navigation.navigate('ThirdPage',{param:this.state.data});  
        }
        else{
            Alert.alert("Too far away to Check-In");
        }
        
        
    }
    
    

    render()
    {  

        return(

            <View style={{ flex: 1}}>
                <View style={styles.container}>
                    <Agenda
                        items={this.state.items}
                        loadItemsForMonth={this.loadItems.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        rowHasChanged={this.rowHasChanged.bind(this)}
                        theme={
                            {
                                'stylesheet.agenda.list': {
                                    dayNum: {
                                        width: '100%',
                                        fontSize: 28,
                                        fontWeight: '200',
                                        textAlign: 'center',
                                        color: '#43515c',
                                    }
                                }
                            }
                        }
                    />
                </View>

            </View>

        );
    }


    loadItems(day) {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    this.state.items[strTime] = [];
                    const userData = {date:strTime};
                    if (this.state.worker==='0')
                    {
                    fetch('http://dev4.holidale.org/api/v1/work_orders/cleaner/?token='+this.state.token+'&date='+userData.date)
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
                                        app_data:responseJson[j].app_data,
                                        date:strTime,
                                        inventory: responseJson[j].inventory,
                                        cost: responseJson[j].cost,
                                        latitude:responseJson[j].location.latitude,
                                        longitude:responseJson[j].location.longitude
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
                else if(this.state.worker==='1')
                {
                    fetch('http://dev4.holidale.org/api/v1/work_orders/maintainer/?token='+this.state.token+'&date='+userData.date)
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
                                    app_data:responseJson[j].app_data,
                                    date:strTime,
                                    inventory: responseJson[j].inventory,
                                    cost: responseJson[j].cost,
                                    latitude:responseJson[j].location.latitude,
                                    longitude:responseJson[j].location.longitude
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
            }
            const newItems = {};
            Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
            this.setState({
                items: newItems
            });
    }

    renderItem(item) {
        return ( 
        <View style={styles.SubmitButtonStyle} activeOpacity = { .5 } >
                <View style={{flexDirection: 'row',flex:1}}>
                    <Text style={styles.TextStyle}>{item.name}</Text>
                </View>
                <Text style={styles.TextStyle2}>{item.address}</Text>
                <View >
                    <Text style={styles.TextStyle3}>{item.status}</Text>
                </View>
                <TouchableOpacity style={styles.Check_inButtonStyle} onPress={()=>{ this.WorkOrderFunction(item) } }>
                    <View>
                        <Text style={styles.TextStyle3}>Check-In</Text>
                    </View>
                </TouchableOpacity>
        </View>
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


export default ProfileActivity;