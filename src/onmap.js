import React, { Component } from 'react';
import { View, Modal,Alert, TouchableHighlight,Text} from 'react-native';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/logout_css";
import MapView from 'react-native-maps';
 
var markers=[];
class OnMap extends Component {
    
    static navigationOptions =
        {
            title: 'Map',
            header: null
        };
        constructor(props){
            super(props);
            
            this.state={
                id:396,
                
            //     markers: [{
            //     title: 'hello',
            //     coordinates: {
            //       latitude: 37.78825,
            //       longitude: -122.4324
            //     },
            //   },
            //   {
            //     title: 'hello123',
            //     coordinates: {
            //       latitude: 37.774929,
            //       longitude: -122.419418
            //     },  
            //   }]
            }
            
           this._getToken(); 

        }


    _getToken = async () => {
        try {
            data = await AsyncStorage.getItem('session_data');
            this.setState({token: JSON.parse(data)[0].auth_token, worker: JSON.parse(data)[0].worker,user_id: JSON.parse(data)[0].user_id});
            console.log("Token information: ", JSON.parse(data));
            fetch("http://localhost:3000/api/v1/service_schedules?assignee_id="+this.state.id)
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
                                description: x.city
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
 
 
    move(marker){
     
        Alert.alert("marker");
        
    }

    render() {
        
        return (
            
            <View style={{ height: 600,width: 400,justifyContent: 'flex-end',alignItems: 'center'}}>
                <MapView style={styles.map}
    initialRegion={{  
      latitude: 33.7972,
      longitude: -117.89,
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
                    title={marker.title}
                    description={marker.description}
                    onPress={(e) => { this.move(marker)}}
                    />
                ))}

  </MapView>
            </View>

        );
    }
}


export default OnMap;
