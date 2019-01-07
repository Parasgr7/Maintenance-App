import React, { Component } from 'react';
import { View,Text,Alert,TouchableOpacity,ScrollView } from 'react-native';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/logout_css";
import MapView from 'react-native-maps';
import Modal from "react-native-modal";
import GLOBALS from './Globals';
import { FontAwesome } from '@expo/vector-icons';
 
var markers=[];
var latitude,longitude;
class OnMap extends Component {
    
    static navigationOptions =
        {
            title: 'Map',
            header: null
        };
        constructor(props){
            super(props);
            
            this.state={
                id:1583,
                isModalVisible: false,
                markerData:
                [{
                    "id": 209,
                    
                    "due": "2016-04-25",
                    "service_name": "Others",
                    "coordinates":{
                        "latitude":33.6956,
                        "longitude": -117.746
                    },
                    "house": {
                        "id": 174,
                        "address": "The 3b Family Summer House",
                        "full_address": "78 Talisman *, Irvine, CA 92620, USA"
                    },
                    "note": null,
                    "status": "Completed",
                    "city": "irvine"
                }]
            }
            
           this._getToken(); 
           this.getLocation();

        }

    
    _getToken = async () => {
        try {
            data = await AsyncStorage.getItem('session_data');
            this.setState({token: JSON.parse(data)[0].auth_token, worker: JSON.parse(data)[0].worker,user_id: JSON.parse(data)[0].user_id});
            console.log("Token information: ", JSON.parse(data));
            fetch("http://18.216.18.191/api/v1/service_schedules?assignee_id="+this.state.id)
                .then((response) => {return response.json()})
                .then((responseJson) => {
             
                    
                    responseJson.map(x=>{
                        
                        markers.push(
                            {
                                coordinates:{
                                    latitude:x.house.latitude,
                                    longitude: x.house.longitude
                                },
                                id: x.id,
                                title: x.service_name,
                                description: x.city,
                                due: x.due,
                                status: x.status,
                                service_name:x.service_name,
                                house:x.house,

                            }
                        
                        )
                    
                    })
               
                    this.setState({list: responseJson});
                }).catch((error) => {
                    console.error(error);
        });
        
        } catch (error) {
            console.log("Something went wrong in logged screen");
        }
    } 

    getLocation=()=>
    {   navigator.geolocation.getCurrentPosition((position)=>{
        latitude=parseFloat(position.coords.latitude);
        longitude= parseFloat(position.coords.longitude);
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/'+longitude+','+latitude+'.json?access_token='+GLOBALS.MAP_TOKEN)
                .then((response) => {return response.json()})
                .then((responseJson) => {
                    this.setState({loc: responseJson.features[0].place_name });
                }).catch((error) => {
                    console.error(error);
        });
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

    WorkOrderFunction = (item) =>{
        var obj={
            access_in_datetime: new Date(),
            work_order_id:item.id,
            user_id: this.state.user_id,
            house_id: item.house.id,
            latitude:item.house.latitude,
            longitude:item.house.longitude
        }

        // DistInMet=this.distanceInKmBetweenCoordinates(item.house.latitude,item.house.longitude,this.state.latitude,this.state.longitude);
        // this.getLocation();
        // console.log(this.state.loc);
        this.setState({ isModalVisible: !this.state.isModalVisible  });
        if(25)
        {    
            this.state.data={id:item.id,userData:{token:this.state.token}};
            this.props.navigation.navigate('ThirdPage',{param:item});
            //this.house_access(obj);
        }
        else{
            
            Alert.alert("Too far away to Check-In");
        }
        
        
    }
 
   
    _toggleModal = (marker) =>{
    data=markers.filter(selected_marker=>
        selected_marker.house.latitude==marker.coordinates.latitude && selected_marker.house.longitude==marker.coordinates.longitude
    )

    this.setState({ isModalVisible: !this.state.isModalVisible,markerData: data  });

    }

    _toggleModalClose = () =>{
        this.setState({ isModalVisible: !this.state.isModalVisible  });
    }

    note_display(item){
       
        if(item.note!=null)
        {
        return(
            <Text style={{marginLeft:10, marginBottom:5}} >
                <Text style={styles.TextStyle2Bold}>Note : </Text>
                <Text style={styles.TextStyle2}>{item.note}</Text>
            </Text>
        
        )
        }

    }


    render() {
        // console.log(latitude,longitude);
        return (
            <View style={{ height: 600,width: 400,justifyContent: 'flex-end',alignItems: 'center'}}>
                <MapView style={styles.map}
                    initialRegion={{
                    latitude: 33.7972,
                    longitude: -117.89,
                    // latitude:latitude,
                    // longitude:longitude,
                    latitudeDelta:  1.922,
                    longitudeDelta: 1.421,
                    }}
                    zoomEnabled={true}
                    showsCompass={true}
                    >

                {markers.map(marker => (

                    <MapView.Marker
                    key={marker.id}
                    coordinate={marker.coordinates}
                    // title={marker.title}
                    // description={"At "+ marker.description +" due till "+marker.due}
                    pinColor={marker.status==="Completed"||"completed"?'#008000':marker.status==="Scheduled"||"scheduled"?'#ff0000':'#0000ff'}        
                    onPress={(e) => { this._toggleModal(marker)}}
                    />
                    
                ))}
            
            </MapView>

            <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}>
            <ScrollView>
                {this.state.markerData.map(marker=>(
                    <View>
                    <View style={styles.SubmitButtonStyle1} >
                        <View style={{flex:1, flexDirection:'row'}}>

                            <View style={{flexDirection: 'row', flex:1, justifyContent: 'flex-end'}}>
                                <TouchableOpacity  onPress={this._toggleModalClose}>
                                    <FontAwesome name="close" size={24} color='black'/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={styles.TextStyleHead}>{marker.service_name}</Text>
                        <Text style={{marginLeft:10,marginBottom:5}} >
                            <Text style={styles.TextStyle2Bold}>Address : </Text>
                            <Text style={styles.TextStyle2}>{marker.house.full_address}</Text>
                        </Text>
                        <Text style={{marginLeft:10,marginBottom:5}} >
                            <Text style={styles.TextStyle2Bold}>City : </Text>
                            <Text style={styles.TextStyle2}>{marker.house.full_address.split(',')[1]}</Text>
                        </Text>
                        <Text style={{marginLeft:10,marginBottom:5}} >
                            <Text style={styles.TextStyle2Bold}>Due Date : </Text>
                            <Text style={styles.TextStyle2}>{marker.due}</Text>
                        </Text>
                          {this.note_display(marker)}
                        <View style={{paddingRight:10}}>
                            <Text style={styles.TextStyle3}>{marker.status}</Text>
                        </View>

                        <View style={{flexDirection: 'row', flex:1, justifyContent: 'flex-end'}}>
                        <TouchableOpacity style={styles.Check_inButtonStyle} onPress={()=>this.WorkOrderFunction(marker)  } >
                            <Text style={styles.TextStyle4}>Check-In</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                        <View style={{margin:3}}/>
                    </View>
                
                    
                ))}
                </ScrollView>
                   
                  
               
                </Modal>
        </View>
        
      

        );
    }
}


export default OnMap;
