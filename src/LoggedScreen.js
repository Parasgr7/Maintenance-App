import React, {Component} from 'react';
import {View, Alert, Text, Dimensions, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {AsyncStorage} from "react-native";
import styles from "../assets/stylesheets/calendar_page_css";
import GLOBALS from './Globals';

class ProfileActivity extends Component {


    static navigationOptions =
        {
            title: 'Home'
        }

    constructor(props) {
        super(props);
        this.state = {
            items: {},
            selected: ProfileActivity.timeToString((new Date()).getTime()),
            data: {},
            visible: false,
            token: "",
            latitude: "",
            longitude: "",
        };

    }

    componentDidMount() {
        this._getToken();

    }


    _getToken = async () => {
        try {
            data = await AsyncStorage.getItem('session_data');
            this.setState({
                token: JSON.parse(data)[0].auth_token,
                worker: JSON.parse(data)[0].worker,
                user_id: JSON.parse(data)[0].user_id
            });
            console.log("Token information: ", JSON.parse(data));
            this.refresh();
        } catch (error) {
            console.log("_getToken in LoggedScreen.js failed");
        }
    };

    getLocation=()=>
    {   
    
        fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.state.longitude+','+this.state.latitude+'.json?access_token='+GLOBALS.MAP_TOKEN)
                .then((response) => {return response.json()})
                .then((responseJson) => {
                    this.setState({loc: responseJson.features[0].place_name });
                }).catch((error) => {
                    console.error(error);
        });
    };

    degreesToRadians = (degrees) => {
        return degrees * Math.PI / 180;
    }

    distanceInKmBetweenCoordinates = (lat1, lon1, lat2, lon2) => {
        var earthRadiusKm = 6371;

        var dLat = this.degreesToRadians(lat2 - lat1);
        var dLon = this.degreesToRadians(lon2 - lon1);
        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(earthRadiusKm * c * 1000);
    };

    house_access = (data) => {

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
    };

    WorkOrderFunction = (item) => {

        var obj = {
            access_in_datetime: new Date(),
            work_order_id: item.id,
            user_id: this.state.user_id,
            house_id: item.house_id,
            latitude: item.latitude,
            longitude: item.longitude
        };

        DistInMet = this.distanceInKmBetweenCoordinates(item.latitude, item.longitude, this.state.latitude, this.state.longitude);

        if (DistInMet > 25) {
            this.state.data = {id: item.id, userData: {token: this.state.token}};
            this.props.navigation.navigate('ThirdPage', {param: item, onGoBack: () => this.refresh()});
            //this.house_access(obj);
        } else {
            Alert.alert("Too far away to Check-In");
        }


    }


    render() {

        return (

            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <Agenda
                        loadItemsForMonth={this.loadItems.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={ProfileActivity.renderEmptyDate.bind(this)}
                        rowHasChanged={ProfileActivity.rowHasChanged.bind(this)}
                        items={this.state.items}
                        selected={this.state.selected}
                        onRefresh={this.refresh.bind(this)}
                        //rowHasChanged={this.rowHasChanged.bind(this)}
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
        this.setState({selected: ProfileActivity.timeToString(day.timestamp)});
        const one_day = 24 * 60 * 60 * 1000;
        const due_before = ProfileActivity.timeToString(day.timestamp + 30 * one_day);
        const due_after = ProfileActivity.timeToString(day.timestamp - 15 * one_day);

        if (this.state.worker === '0') {
            fetch(GLOBALS.API_URL + 'service_schedules?assignee_id=' + this.state.user_id + '&auth_token=' + this.state.token + '&due_before=' + due_before + '&due_after=' + due_after)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson) {
                        for (let i = day.timestamp - 15 * one_day; i < day.timestamp + 30 * one_day; i += one_day) {
                            this.state.items[ProfileActivity.timeToString(i)] = [];
                        }
                        responseJson.map((item) => {
                            const strTime = ProfileActivity.timeToString(item.due);
                            if (!this.state.items[strTime]) {
                                this.state.items[strTime] = [];
                            }
                            if (!this.state.items[strTime].some(function (el) {
                                return el.id === item.id;
                            })) {
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
                                    service_name: item.service_name,
                                    start_time: item.start_time,
                                    height: Math.max(50, Math.floor(Math.random() * 150)),
                                    latitude: item.house.latitude,
                                    longitude: item.house.longitude
                                });
                            }
                        })
                    } else {

                        Alert.alert(responseJson);
                    }

                }).catch((error) => {
                console.error(error);
            });
        } else if (this.state.worker === '1') {
            fetch(GLOBALS.API_URL + 'service_schedules?assignee_id=' + this.state.user_id + '&auth_token=' + this.state.token + '&due_before=' + due_before + '&due_after=' + due_after)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson) {
                        responseJson.map((item) => {
                            const strTime = ProfileActivity.timeToString(item.due);
                            if (!this.state.items[strTime]) {
                                this.state.items[strTime] = [];
                            }
                            if (!this.state.items[strTime].some(function (el) {
                                return el.id === item.id;
                            })) {
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
                                    service_name: item.service_name,
                                    start_time: item.start_time,
                                    height: Math.max(50, Math.floor(Math.random() * 150)),
                                    //check:responseJson[j].check,
                                    //app_data:responseJson[j].app_data,
                                    //date:strTime,
                                    //inventory: responseJson[j].inventory,
                                    //cost: responseJson[j].cost,
                                    latitude: item.house.latitude,
                                    longitude: item.house.longitude
                                });
                            }

                        });
                    } else {

                        Alert.alert(responseJson);
                    }

                }).catch((error) => {
                console.error(error);
            });
        }
        for (let i = -15; i < 30; i++) {
            const time = day.timestamp + i * one_day;
            const strTime = ProfileActivity.timeToString(time);
            if (!this.state.items[strTime]) {
                this.state.items[strTime] = [];
            }
        }
        const newItems = {};
        Object.keys(this.state.items).forEach(key => {
            newItems[key] = this.state.items[key];
        });
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
                {/*<Text style={styles.TextStyle2}>{item.address}</Text>*/}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    flex: 1,
                    marginTop: 3,
                    marginBottom: 8,
                    paddingRight: 10
                }}>
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

    static renderEmptyDate() {
        return (
            <View style={styles.emptyDate}><Text>This is empty date!</Text></View>

        );
    }

    static timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    static rowHasChanged(r1, r2) {
        return JSON.stringify(r1) !== JSON.stringify(r2)
    }

    refresh() {
        let today = new Date(this.state.selected);
        today.timestamp = today.getTime();
        this.loadItems(today);
        this.setState(() => {
            console.log('Refreshed!');
            return {unseen: "Refreshed!"}
        });
    }
}


export default ProfileActivity;
