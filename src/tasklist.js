import React, { Component } from 'react';
import { ScrollView,View, Text,  Alert, Image, ImageBackground,TouchableOpacity} from 'react-native';
import { AsyncStorage } from "react-native";
import styles from "../assets/stylesheets/calendar_page_css";
import { StackNavigator } from 'react-navigation';
import GLOBALS from './Globals';

class TaskList extends Component {
    
    static navigationOptions =
        {
            title: 'TaskList',
            header: null
        };
        constructor(props){
            super(props);
            this.state={
                id:"",
                list:[{service_name: "new", house:{full_address:"xyz"},status:"abc",due:"1998-05-18"}],
                item:{}
                
            };
            this.WorkOrderFunction= this.WorkOrderFunction.bind(this);
        }

        componentDidMount(){
            this.state.id=this.props.navigation.state.params.param.id;
            // this.state.id= 396;
            this.getTaskList();
            this._getToken();
           
             
    }


    _getToken = async () => {
        try {
           data = await AsyncStorage.getItem('session_data');
           this.setState({token: JSON.parse(data)[0].auth_token, worker: JSON.parse(data)[0].worker,user_id: JSON.parse(data)[0].user_id});
            console.log("Token information: ", JSON.parse(data));
        } catch (error) {
            console.log("Something went wrong in logged screen");
        }
    }

    getTaskList=()=>
    {   
        fetch(GLOBALS.API_URL+"service_schedules?assignee_id="+this.state.id)
                .then((response) => {return response.json()})
                .then((responseJson) => {
                  this.setState({list: responseJson});
                }).catch((error) => {
                    console.error(error);
        });

        
    }

    getLocation=()=>
    {   navigator.geolocation.getCurrentPosition((position)=>{
        const latitude=parseFloat(position.coords.latitude);
        const longitude= parseFloat(position.coords.longitude);
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/'+longitude+','+latitude+'.json?access_token='+GLOBALS.MAP_TOKEN)
                .then((response) => {return response.json()})
                .then((responseJson) => {
                    this.setState({loc: responseJson.features[0].place_name });
                }).catch((error) => {
                    console.error(error);
        });
    });
    
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

    WorkOrderFunction = (item) =>{
        var obj={
            access_in_datetime: new Date(),
            work_order_id:item.id,
            user_id: this.state.user_id,
            house_id: item.house.id,
            latitude:item.house.latitude,
            longitude:item.house.longitude
        }

        DistInMet=this.distanceInKmBetweenCoordinates(item.house.latitude,item.house.longitude,this.state.latitude,this.state.longitude);
        // this.getLocation();
        // console.log(this.state.loc);

        if(DistInMet<25)
        {   
            this.state.data={id:item.id,userData:{token:this.state.token}};
            this.props.navigation.navigate('ThirdPage',{param:item});
            //this.house_access(obj);
        }
        else{
            Alert.alert("Too far away to Check-In");
        }
        
        
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
    display_list(list)
    {   const that=this;
        return list.map(function(item, i){
            return(
                  <View style={styles.SubmitButtonStyle1} key={i} >
                      <View >
                          <Text style={styles.TextStyleHead}>{item.service_name}</Text>
                      </View>
                      <Text style={{marginLeft:10,marginBottom:5}} >
                          <Text style={styles.TextStyle2Bold}>Address : </Text>
                          <Text style={styles.TextStyle2}>{item.house.full_address}</Text>
                      </Text>
                      
                      <Text style={{marginLeft:10,marginBottom:5}} >
                          <Text style={styles.TextStyle2Bold}>Due Date : </Text>
                          <Text style={styles.TextStyle2}>{item.due}</Text>
                      </Text>
                        {that.note_display(item)}
                      <View style={{paddingRight:10}}>
                          <Text style={styles.TextStyle3}>{item.status}</Text>
                      </View>
                      <View style={{flexDirection: 'row', flex:1, justifyContent: 'flex-end'}}>
                      <TouchableOpacity style={styles.Check_inButtonStyle} onPress={()=>that.WorkOrderFunction(item)  } >
                          <Text style={styles.TextStyle4}>Check-In</Text>
                      </TouchableOpacity>
                      </View>
                  </View>  
            );
          });
    }


    line_break(){
        return(
            <View>
            <View style={{borderBottomColor: 'black',borderBottomWidth: 5, marginTop:15, marginBottom:5, margin:15}}/>
            </View>
        )
    }

    tasklist() 
    {   
 
        const length =this.state.list.length;
        var dup_list= this.state.list;
        if (length>1 && length<4){
            return(
                <View>
                {this.display_list(this.state.list)}
                </View>
            
            )
        }
        else if(length>=4){
            const that=this;
            const date= new Date().toISOString().split('T')[0];
            // const date= "2016-04-19";
            loc=[];
            last_days=[];
            current_day=[];
            future_days=[];
            this.state.list.forEach(function(item,i){
                if (date==item.due)
                {   
                    loc.push(i);
                    current_day.push(item);
                }
            });
            if(loc[0]<=3)
            {   
                const index=0;
                last_days=dup_list.slice(index,loc[0]);
                future_days=dup_list.slice(loc[-1]+1);
            }
            else{
                const index=i-4;
                last_days=dup_list.slice(index,loc[0]);
                future_days=dup_list.slice(loc[-1]+1);
            }

            return(
                <View>
                    {that.display_list(last_days)}
                    {that.line_break()}
                    {that.display_list(current_day)}
                    {that.line_break()}
                    {that.display_list(future_days)}
                </View>
            )
          
        }
        else{
            return(
                        <View >
                            <Text style={styles.TextStyle}>No item to display</Text>
                        </View>
            )
        }
    }
      
      
    
    render() {
        return (
            <ScrollView>
            {this.tasklist()}
            </ScrollView>
        );
    }
}


export default TaskList;
