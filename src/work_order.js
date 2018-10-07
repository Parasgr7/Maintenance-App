import React, {Component} from 'react';
import { StyleSheet, TextInput, ScrollView, View, Alert, Text,  Image, ImageBackground, Dimensions, TouchableOpacity,ActivityIndicator,Platform,KeyboardAvoidingView,RefreshControl,TouchableHighlight} from 'react-native';
import { Item, Label, Input, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { AsyncStorage } from "react-native";
import Modal from 'react-native-modal';
import t from 'tcomb-form-native';
import { RNS3 } from 'react-native-aws3';
import {Permissions, ImagePicker } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "../assets/stylesheets/work_order_css"

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

const Form = t.form.Form;

let Sources = t.enums({
    Car: 'Car',
    Bike: 'Bike'
});
let ProductNames = t.enums({
    Soap: 'Soap',
    Towel: 'Towel'
});
let Count = t.enums({
    1: '1',
    2: '2'
});

const Products = t.struct({
    name: ProductNames,
    count: t.Number
})


const User = t.struct({
    source: Sources,
    product: t.list(Products),
});

const listCost=t.struct({
    item: t.String,
    cost: t.Number
});

const Cost = t.struct({
    add_cost: t.list(listCost)
})



function customTemplate(locals) {
 
    return (
        <View style={{flexDirection: 'row',width:width-100, marginTop:35}}>
          <View style={{flex:1}}>
            {locals.inputs.name}
          </View>
        <View style={{flex:1}}>
             {locals.inputs.count}
        </View>
      </View>
    );
  }

  function costTemplate(locals) {
    return (
        <View style={{flexDirection: 'row',width:width-100, marginTop:35}}>
          <View style={{flex:1}}>
            {locals.inputs.item}
          </View>
        <View style={{flex:1}}>
             {locals.inputs.cost}
        </View>
      </View>
    );
  }


const options = {
 

    fields: {
            product:{
                    disableOrder:true,

                    item:{   
                            template: customTemplate 
                    }
                }
            }

};

const optionsCost = {
 

    fields: {
            add_cost:{
                    disableOrder:true,

                    item:{   
                            template: costTemplate 
                    }
                }
            }

};



class WorkOrder extends Component {


        constructor(){
            super();
            this.state = {
                image: false,
                text: '',
                pickerResult:'',
                data: {
                    "listings":["Overview"],
                    "inventory":["Dummy"],
                    "cost":["Dummy"]
                },
                area:"",
                rate:"",
                visibleModal: null,
                visibleModalCost:null,
                res:[],
                status:"",
                refreshing: false,
                visible: false,
                area_data:false,
                renderUpload: false
            }
        }
    

    handleSubmit = () => {
        const value = this.formRef.getValue();
        let req={};
        let result=[];
        if(value==null)
        {
            Alert.alert("Fields cannot be empty");
            return;
        }
        else(value.product.length)
        {   
            for(let i=0;i<value.product.length;i++)
            {   
                result.push({count:value.product[i].count,product:value.product[i].name,source:value.source});
            }
            const id = this.props.navigation.state.params.param.id;
            const check = this.props.navigation.state.params.param.check;
            if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/add_inventory/cleaning_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     result: JSON.stringify(result)
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    Alert.alert("Inventory Updated","Done",[{text: 'OK', onPress: () =>  this.setState({ visibleModal: null }) }]);

                    
                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://dev4.holidale.org/api/v1/add_inventory/service_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    result: JSON.stringify(result)
                })

            }).then((response) => response.json())
                .then((responseJson) => {

                    Alert.alert("Inventory Updated","Done",[{text: 'OK', onPress: () =>  this.setState({ visibleModal: null }) }]);

                    
                }).catch((error) => {
                console.error(error);
            });
        }
        }
    }

    handleSubmitCost = () => {
        const value = this.formRef.getValue();
        let req={};
        let result=[];
        if(value==null)
        {
            Alert.alert("Fields cannot be empty");
            return;
        }
        else if(value.add_cost.length)
        {   
            for(let i=0;i<value.add_cost.length;i++)
            {   
                result.push({item:value.add_cost[i].item,cost:"$ "+value.add_cost[i].cost});
            }
            const id = this.props.navigation.state.params.param.id;
            const check = this.props.navigation.state.params.param.check;

            if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/add_cost/cleaning_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     cost: JSON.stringify(result)
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    Alert.alert("Cost Updated","Done",[{text: 'OK', onPress: () =>  this.setState({ visibleModalCost: null }) }]);
                    
                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://dev4.holidale.org/api/v1/add_cost/service_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cost: JSON.stringify(result)
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                
                    Alert.alert("Cost Updated","Done",[{text: 'OK', onPress: () => this.setState({ visibleModalCost: null }) }]);
 
                    // 
                }).catch((error) => {
                console.error(error);
            });
        }

        }
        else{
            Alert.alert("Add Items");
            return
        }
    }

    _renderButton = (text, onPress) => (
        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={onPress}>
                <Text style={styles.TextStyle}>{text}</Text>
        </TouchableOpacity>
    );
    _renderButtonClose = (text, onPress) => (
        <TouchableOpacity style={styles.SubmitButtonStyle1} activeOpacity = { .5 } onPress={onPress}>
                <Text style={styles.TextStyle}>{text}</Text>
        </TouchableOpacity>
    );


    _renderInventoryModalContent = () => (
        <ScrollView contentContainerStyle={styles.modalContent}>
            <Form ref={c => this.formRef = c} type={User} options={options} />

            <TouchableOpacity style={styles.SubmitButtonStyle1} activeOpacity = { .5 } onPress={ this.handleSubmit }>
                <Text style={styles.TextStyle}> Submit </Text>
            </TouchableOpacity>
            {this._renderButtonClose('Close', () => this.setState({ visibleModal: null }))}
        </ScrollView>
    );

    _renderCostModalContent = () => (
        <ScrollView contentContainerStyle={styles.modalContent}>
            <Form ref={d => this.formRef = d} type={Cost} options={optionsCost} />
            <TouchableOpacity style={styles.SubmitButtonStyle1} activeOpacity = { .5 } onPress={ this.handleSubmitCost }>
                <Text style={styles.TextStyle}> Submit </Text>
            </TouchableOpacity>
            {this._renderButtonClose('Close', () => this.setState({ visibleModalCost: null }))}
        </ScrollView>
    );

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchData();
      }

      fetchData(){
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        const userData=this.props.navigation.state.params.param.userData;

        if (check==1){
            fetch('http://dev4.holidale.org/api/v1/work_order/service_schedules/'+id+'/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                                let res = responseJson;
                                
                                this.setState({
                                    data: res[0],
                                    refreshing: false
                                });

                            }
                            else{

                                Alert.alert(responseJson);
                            }

                        }).catch((error) => {
                        console.error(error);
                    });
        }
        else{
            fetch('http://dev4.holidale.org/api/v1/work_order/cleaning_schedules/'+id+'/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {   
                                let res= responseJson;
                                this.setState({
                                    data: res[0],
                                    refreshing: false
                                });

                            }
                            else{

                                Alert.alert(responseJson);
                            }

                        }).catch((error) => {
                        console.error(error);
                    });
        }

      }

      _getToken = async () => {
        try {
           data = await AsyncStorage.getItem('session_data');
           this.setState({token: JSON.parse(data)[0].access_token, worker: JSON.parse(data)[0].worker });
        
        } catch (error) {
            console.log("Something went wrong");
        }
    }

        componentDidMount(){
        this._getToken();
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        const userData=this.props.navigation.state.params.param.userData;
        if (check==1){
            fetch('http://dev4.holidale.org/api/v1/work_order/service_schedules/'+id+'/?token='+this.state.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                                let res = responseJson;
                                this.setState({
                                    data: res[0],
                                    visible: !this.state.visible
                                });

                            }
                            else{

                                Alert.alert(responseJson);
                            }

                        }).catch((error) => {
                        console.error(error);
                    });
        }
        else{
            fetch('http://dev4.holidale.org/api/v1/work_order/cleaning_schedules/'+id+'/?token='+this.state.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {   
                                let res= responseJson;
                                
                                this.setState({
                                    data: res[0],
                                    visible: !this.state.visible
                                });

                            }
                            else{

                                Alert.alert(responseJson);
                            }

                        }).catch((error) => {
                        console.error(error);
                    });
        }
           
        }

        
    

    
    render()
    {
        if(!this.state.visible) { 
        return (
            <View style={{ flex: 1 }}>
             <Spinner visible={!this.state.visible} textContent={"Loading..."} textStyle={{color: '#FFF', width: '100%', textAlign: 'center'}} />
            </View>
          );
        }
        
       
        
    
        

        let list=[];
        if(this.state.data.listings!=null)
        {
            for(let i=0;i<this.state.data.listings.length;i++)
            {
                list.push({
                    value: this.state.data.listings[i]
                })
            }  
        }

        status_data=[{
            value:"Completed"
        },{
            value:"Pending"
        },{
            value:"Scheduled"
        }]

        source=[{
            value:"Car"
        },{
            value:"Bus"
        },{
            value:"Train"
        }]
        
        const {goBack} = this.props.navigation;


        return(
            <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            
            <ScrollView style={styles.container}>
                <Text style={styles.WorkOrderTextStyle}>{this.state.data.name}</Text>
                <Text style={styles.TextComponentStyle}>{this.state.data.address}</Text>
                <Text style={styles.TextComponentStyle}>{this.state.data.due}</Text>
                <ScrollView style={[{flex: 1}, styles.elementsContainer]}>
                    <ScrollView style={{flex: 1}}>
                       <Dropdown
                         label='Select Area'
                         data={list} 
                         onChangeText={(value,index,data)=>{
                            this.setState({area:value});
                                for(let i=0;i<this.state.data.app_data.length;i++)
                                {   
                                    if (this.state.area==this.state.data.app_data[i].area)
                                    {   
                                        this.setState({area_data : this.state.data.app_data[i] });
                                        this.setState({index:i});
                                        this.setState({image:false});  
                                        console.log(this.state.area_data);
 
                                    }
                                    
                                }  
                        }}
                       />
                     
                    </ScrollView>
                    <ScrollView contentContainerStyle={{flex: 1, flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'space-between'}}>
                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'stretch',flexDirection: 'row', flex: 1}}>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='thumbs-up'
                                    type='font-awesome'
                                    color={this.state.area_data.rate=="true" && this.state.area_data.area==this.state.area?"#033b49":"#378A9E"}
                                    raised
                                    // reverse
                                    onPress={() => this.thumbs_up()} />
                            </ScrollView>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='thumbs-down'
                                    type='font-awesome'
                                    color={this.state.area_data.rate=="false" && this.state.area_data.area==this.state.area?"#033b49":"#378A9E"}
                                    raised
                                    onPress={() => this.thumbs_down()}
                                />
                            </ScrollView>
                        </ScrollView>
                        
                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='camera'
                                    type='font-awesome'
                                    color='#378A9E'
                                    raised
                                    onPress={this._pickImage} 
                                />
                                {this._maybeRenderUploadingOverlay()}
                                 </ScrollView>
                        </ScrollView>

                    </ScrollView>
                    <ScrollView contentContainerStyle={{ justifyContent: 'center',alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                            {this._maybeRenderImage()}
                            {this.listing_data()}
                            {this._maybeRenderUploadingOverlay()}
                    </ScrollView>
                    {this.add_inventory()}
                    {this.add_cost()}
                    <View style={{marginBottom:80}}>
                            <Dropdown
                                label='Select Status'
                                data={status_data}
                                value={this.state.data.status}
                                onChangeText={(value,index,data)=>{this.statusUpdate(value)}}

                            />
                    </View>
                </ScrollView>

            </ScrollView>
    </ScrollView>
        );
    }

    add_inventory=()=>{
        const InventoryState = {
            tableHead: ['Source', 'Product', 'Count']
        };
        let inventData=[];
        for(let i=0;i<this.state.data.inventory.length;i++)
        {
            inventData.push([this.state.data.inventory[i].source,this.state.data.inventory[i].product,this.state.data.inventory[i].count])
        }
        console.log(this.state.worker);
        if(this.state.worker==='0')
        {
            return(
        <ScrollView style={styles.TableContainer} >
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={InventoryState.tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={inventData} textStyle={styles.text}/>
                        </Table>
                        <View style={styles.content}>
                            {this._renderButton('Add Inventory', () => this.setState({ visibleModal: 1 }))}
                            <Modal isVisible={this.state.visibleModal === 1} style={styles.bottomModal}>
                                {this._renderInventoryModalContent()}
                            </Modal>
                        </View>   
        </ScrollView>
            );
        }
        else 
            return;

    }

    add_cost=()=>{
        const CostState = {
            tableHead: ['Item', 'Cost']
        };
        let costData=[];
        for(let i=0;i<this.state.data.cost.length;i++)
        {
            costData.push([this.state.data.cost[i].item,this.state.data.cost[i].cost])
        }
        console.log(this.state.worker);
        if(this.state.worker==='1')
        {
            return(
        <ScrollView style={styles.TableContainer} >
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={CostState.tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={costData} textStyle={styles.text}/>
                        </Table>
                        <View style={styles.content}>
                            {this._renderButton('Add Cost', () => this.setState({ visibleModalCost: 1 }))}
                            <Modal isVisible={this.state.visibleModalCost === 1} style={styles.bottomModal}>
                                {this._renderCostModalContent()}
                            </Modal>
                        </View>    
        </ScrollView>
            );
        }
        else
            return;

    }

    statusUpdate=(value)=> {
        this.setState({status:value});
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
      
        if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/work_status/cleaning_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    status: this.state.status,
            
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    Alert.alert("Status Updated!");
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://dev4.holidale.org/api/v1/work_status/service_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    status: this.state.status

                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    Alert.alert("Status Updated!");

                }).catch((error) => {
                console.error(error);
            });
        }

    }

    thumbs_up=()=> {
       
        if(this.state.area=="")
        {
            Alert.alert("Select Proper Area");
            return;
        }
        else if(this.state.area_data.area!=this.state.area)
        {
            Alert.alert("Please upload image");
            return;
        }

        else (this.state.area_data.area==this.state.area)
        {
        this.setState({rate:"true"});
        this.state.area_data.rate="true";

        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        
        if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/up/cleaning_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    data: this.state.area_data,
                    index: this.state.index

                })
                
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    Alert.alert("Liked :)");  

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   console.log(this.state.area_data);
            fetch('http://dev4.holidale.org/api/v1/down/service_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    data: this.state.area_data,
                    index: this.state.index

                })

            }).then((response) => response.json())
                .then((responseJson) => {
                  
                    Alert.alert("Liked :)");
                }).catch((error) => {
                console.error(error);
            });
        }
    }
    }
    thumbs_down=()=>{
        console.log(this.state.area);
        if(this.state.area=="")
        {
            Alert.alert("Select Proper Area");
            return;
        }
        else if(this.state.area_data.area!=this.state.area)
        {   
            Alert.alert("Please upload image");
            return;
        }

        else(this.state.area_data.area==this.state.area)
        {
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        this.setState({rate:"false"});
        this.state.area_data.rate="false";
       
        if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/up/cleaning_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: this.state.area_data,
                    index: this.state.index
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                
                    Alert.alert("Unliked :(");
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://dev4.holidale.org/api/v1/down/service_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: this.state.area_data,
                    index: this.state.index
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    Alert.alert("Unliked :(");

                }).catch((error) => {
                console.error(error);
            });
        }
    }

    }

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={ styles.maybeRenderUploading}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }
    };

    listing_data=()=>{
        if (this.state.area_data.area==this.state.area) {
            
            return(
                <View
                    style={styles.maybeRenderImageText}>
                     
                    <View
                        style={styles.maybeRenderImageContainer}>
                        <Image source={{ uri: this.state.area_data.image }} style={styles.maybeRenderImage} />
                    </View>
    
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 2, margin:5}}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.area_data.note}
                    />
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={()=>{ this.uploadNotes(this.state.image,this.state.text,this.state.area)}}>
                   <Text style={styles.TextStyle}>Upload</Text>
                    </TouchableOpacity>
           
                </View>
                
            );
        }
        else{
            return;
            
        }
    }
    _maybeRenderImage = () => {
        
        let {
            image
        } = this.state;
        let x= this.state.image;
        
        if(image){
        return (
            <View style={styles.maybeRenderImageText}> 
                <View
                    style={styles.maybeRenderImageContainer}>
                    <Image source={{ uri: this.state.image }} style={styles.maybeRenderImage} />
                </View>

                <TextInput
                    style={styles.textInsert}
                    placeholder="Notes Here"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
                <View style={styles.content}>
                <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={()=>{ this.uploadNotes(this.state.image,this.state.text,this.state.area)}}>
                   <Text style={styles.TextStyle}>Upload</Text>
                </TouchableOpacity>
                </View>
       
            </View>
            
        );
    }
    else{
        return;
    }
    };


    _pickImage = async () => {
        if(this.state.area=="")
        {
            Alert.alert("Select proper area");
            return
        }
            
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            // only if user allows permission to camera roll
            if (cameraRollPerm === 'granted') {
                 pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3]
                });  
                this._handleImagePicked(pickerResult);
            }     
    };

    _handleImagePicked = async (pickerResult) => {
        let uploadResponse, uploadResult;

        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                uploadResponse = await this.uploadImageAsync(pickerResult.uri);
                uploadResult = await uploadResponse;
               
              this.setState({
                    image: uploadResult.location,
                    renderUpload: true,
                    area_data: false,
                    text:''
                });
            }
        } catch (e) {
            console.log({ e });
            alert('Upload failed, sorry :(');
        } finally {
            
            this.setState({
                uploading: false
            });
        }
    };

    uploadNotes= (link,text,area)=> {
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        if(link==false)
        {
            Alert.alert("Image not selected!");
        }
        else{
      
        if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/notesupload/cleaning_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    image: link,
                    note: text,
                    area: area,
                    rate: this.state.rate

                })

            }).then((response) => response.json())
                .then((responseJson) => {

                    Alert.alert("Successfully Uploaded");

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://dev4.holidale.org/api/v1/notesupload/service_schedules/'+id+'/', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    image: link,
                    note: text,
                    area: area,
                    rate: this.state.rate

                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    Alert.alert("Successfully Uploaded");

                }).catch((error) => {
                console.error(error);
            });
        }
    }
    
    }

     uploadImageAsync= async(uri)=> {

        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        
        const file = {
            uri: uri,
            name: `${uriParts[uriParts.length - 2]}.${fileType}`,
            type: `image/${fileType}`
          }
        const options = {
            keyPrefix: "work-order/"+(check?"service_schedule/":"cleaning_schedule/")+id.toString()+"/images/",
            bucket: "holidale-maintenance-app",
            region: "us-east-2",
            accessKey: "AKIAJ4XF6TLKXHLKHERQ",
            secretKey: "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",
            successActionStatus: 201,
         
          }
          
        return RNS3.put(file, options).then(response => {
            if (response.status !== 201)
              throw new Error("Failed to upload image to S3");
            return response.body.postResponse;
          });
    
    }
    
    
}


export default WorkOrder;