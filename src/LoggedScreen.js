import React, {Component} from 'react';
import { View, Alert, Text, Dimensions,TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/calendar_page_css";

const auth_token= 'pk.eyJ1IjoiZWRnYXJqaSIsImEiOiJjajVuMm42ZHEzYm53MndvMjl5YXprZGZyIn0.aySqkra3YpvqN7FQvOtdIA';

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
            visible: false,

            latitude: "",
            longitude: ""
        };
        
    }
    componentDidMount(){
        this._getToken();

        
        
    }
   

    _getToken = async () => {
        try {
           data = await AsyncStorage.getItem('session_data');
           this.setState({token: JSON.parse(data)[0].auth_token, worker: JSON.parse(data)[0].worker,user_id: JSON.parse(data)[0].user_id});
            console.log("Token information hahaha: ", JSON.parse(data));
        
        } catch (error) {
            console.log("Something went wrong in logged screen");
        }
    }

    getLocation=()=>
    {   
    
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.state.longitude+','+this.state.latitude+'.json?access_token='+auth_token)
                .then((response) => {return response.json()})
                .then((responseJson) => {
                    this.setState({loc: responseJson.features[0].place_name });
                }).catch((error) => {
                    console.error(error);
        });
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
        return Math.round(earthRadiusKm * c * 1000);
    }

    house_access=(data)=>{
  
        fetch('http://dev4.holidale.org/api/v1/access_update/check_in', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    house_id: data.house_id,
	                user_id: data.user_id,
	                work_order_id: data.work_order_id,
	                location: data.location,
                    access_in_datetime: data.access_in_datetime,
                    access_out_datetime: "nil"
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    // console.log(responseJson);
                }).catch((error) => {
                console.error(error);
            }); 
    }

    WorkOrderFunction = (item) =>{

        var obj={
            access_in_datetime: new Date(),
            work_order_id:item.id,
            user_id: this.state.user_id,
            house_id: item.house_id,
            latitude:item.latitude,
            longitude:item.longitude
        }
    
        DistInMet=this.distanceInKmBetweenCoordinates(item.latitude,item.longitude,this.state.latitude,this.state.longitude);

        if(DistInMet>25)
        {   
            this.state.data={id:item.id,userData:{token:this.state.token}};
            this.props.navigation.navigate('ThirdPage',{param:item});
            //this.house_access(obj);
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
            
        if (this.state.worker==='0'){
            fetch('http://kk.local:3000/api/v1/service_schedules?assignee_id='+this.state.user_id+'&token='+this.state.token)
            .then((response) => response.json())
            .then((responseJson) => {
                  console.log("Cleaner: ", responseJson)
                  if(responseJson){
                    responseJson.map((item) => {
                        strTime = this.timeToString(item.due);
                        console.log("what the due is : ", item.due);
                        this.state.items[strTime]=[];
                        this.state.items[strTime].push({
                            name: item.house.address,
                            id: item.id,
                            house_id: item.house.id,
                            address: item.house.full_address,
                            status: item.status,
                            booking_id: item.booking_id,
                            cleaner_id: item.cleaner_id,
                            completed: item.completed,
                            created_at: item.created_at,
                            creator_id: item.creator_id,
                            due: item.due,
                            end_time: item.end_time,
                            note: item.note,
                            scheduled: item.scheduled,
                            service_id: item.service_id,
                            start_time: item.start_time,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            latitude:item.house.latitude,
                            longitude:item.house.longitude
                        });
                    })
                  }
                  else{
                  
                  Alert.alert(responseJson);
                  }
                  
                  }).catch((error) => {
                    console.error(error);
                });
        }else if(this.state.worker==='1')
        {
            fetch('http://kk.local:3000/api/v1/service_schedules?assignee_id='+this.state.user_id+'&token='+this.state.token)
            .then((response) => response.json())
            .then((responseJson) => {
                  console.log("Cleaner: ", responseJson)
                  if(responseJson){
                    responseJson.map((item) => {
                        console.log("due is : ", item.due)
                        strTime = this.timeToString(item.due);
                        if (this.state.items[strTime]) {
                        this.state.items[strTime]=[];
                        this.state.items[strTime].push({
                            name: item.house.address,
                            id: item.id,
                            house_id: item.house.id,
                            address: item.house.full_address,
                            status: item.status,
                            booking_id: item.booking_id,
                            cleaner_id: item.cleaner_id,
                            completed: item.completed,
                            created_at: item.created_at,
                            creator_id: item.creator_id,
                            due: item.due,
                            end_time: item.end_time,
                            note: item.note,
                            scheduled: item.scheduled,
                            service_id: item.service_id,
                            start_time: item.start_time,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            //check:responseJson[j].check,
                            //app_data:responseJson[j].app_data,
                            //date:strTime,
                            //inventory: responseJson[j].inventory,
                            //cost: responseJson[j].cost,
                            latitude:item.house.latitude,
                            longitude:item.house.longitude
                        });
                        }
                    })
                  }
                  else{
                  
                  Alert.alert(responseJson);
                  }
                  
                  }).catch((error) => {
                    console.error(error);
                });
        }
        for (let i = -15; i < 85; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = this.timeToString(time);
            console.log("strTime:::", strTime);
            if (!this.state.items[strTime]) {
                this.state.items[strTime] = [];
            }
        }
        
            /*for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!this.state.items[strTime]) {
                    this.state.items[strTime] = [];
                    const userData = {date:strTime};
                    if (this.state.worker==='0')
                    {
                    fetch('http://kk.local:3000/api/v1/service_schedules?assignee_id=1&token='+this.state.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                              console.log("Cleaner: ", responseJson)
                            // If server response message same as Data Matched

                            if(responseJson)
                            {   
                                const numItems = responseJson.length;
                                for (let j = 0; j < numItems; j++) {
                                    this.state.items[strTime].push({
                                        name: responseJson[j].house.address,
                                        id: responseJson[j].id,
                                        house_id: responseJson[j].house.id,
                                        address: responseJson[j].house.full_address,
                                        status: responseJson[j].status,
                                        booking_id: responseJson[j].booking_id,
                                        cleaner_id: responseJson[j].cleaner_id,
                                        completed: responseJson[j].completed,
                                        created_at: responseJson[j].created_at,
                                        creator_id: responseJson[j].creator_id,
                                        due: responseJson[j].due,
                                        end_time: responseJson[j].end_time,
                                        note: responseJson[j].note,
                                        scheduled: responseJson[j].scheduled,
                                        service_id: responseJson[j].service_id,
                                        start_time: responseJson[j].start_time,
                                        height: Math.max(50, Math.floor(Math.random() * 150)),
                                        //check:responseJson[j].check,
                                        //app_data:responseJson[j].app_data,
                                        date:strTime,
                                        //inventory: responseJson[j].inventory,
                                        //cost: responseJson[j].cost,
                                        latitude:responseJson[j].house.latitude,
                                        longitude:responseJson[j].house.longitude
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
                    fetch('http://kk.local:3000/api/v1/service_schedules?assignee_id=1&token='+this.state.token+'&date='+userData.date)
                    .then((response) => response.json())
                    .then((responseJson) => {
                          console.log("Maintainer: ", responseJson)
                        // If server response message same as Data Matched
                        if(responseJson)
                        {   
                            const numItems = responseJson.length;
                            for (let j = 0; j < numItems; j++) {
                                this.state.items[strTime].push({
                                    name: responseJson[j].house.address,
                                    id: responseJson[j].id,
                                    house_id: responseJson[j].house.id,
                                    address: responseJson[j].house.full_address,
                                    status: responseJson[j].status,
                                    booking_id: responseJson[j].booking_id,
                                    cleaner_id: responseJson[j].cleaner_id,
                                    completed: responseJson[j].completed,
                                    created_at: responseJson[j].created_at,
                                    creator_id: responseJson[j].creator_id,
                                    due: responseJson[j].due,
                                    end_time: responseJson[j].end_time,
                                    note: responseJson[j].note,
                                    scheduled: responseJson[j].scheduled,
                                    service_id: responseJson[j].service_id,
                                    start_time: responseJson[j].start_time,
                                    height: Math.max(50, Math.floor(Math.random() * 150)),
                                    //check:responseJson[j].check,
                                    //app_data:responseJson[j].app_data,
                                    date:strTime,
                                    //inventory: responseJson[j].inventory,
                                    //cost: responseJson[j].cost,
                                    latitude:responseJson[j].house.latitude,
                                    longitude:responseJson[j].house.longitude
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
            }*/
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
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', flex:1, marginTop:3, marginBottom:8, paddingRight:10}}>
                    <Text style={styles.TextStyle3}>{item.status}</Text>
                </View>
                <View style={{flexDirection: 'row', flex:1, justifyContent: 'center'}}>
                <TouchableOpacity style={styles.Check_inButtonStyle} onPress={()=>{ this.WorkOrderFunction(item) } }>
                        <Text style={styles.TextStyle4}>Check-In</Text>
                    </TouchableOpacity>
                    </View>
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
