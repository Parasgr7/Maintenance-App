import React, {Component} from 'react';
import { ScrollView, View, Alert, Text,  Image, Dimensions, TouchableOpacity,ActivityIndicator,RefreshControl} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { Table, Row, Rows } from 'react-native-table-component';
import { AsyncStorage } from "react-native";
import Modal from 'react-native-modal';
import t from 'tcomb-form-native';
import { RNS3 } from 'react-native-aws3';
import {Permissions, ImagePicker } from 'expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextField } from 'react-native-material-textfield';
import { Input} from 'native-base';

import styles from "../assets/stylesheets/work_order_css";

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

        constructor(props){
            super(props);
            this.state = {
                image: false,
                text: '',
                keys: '',
                pickerResult:'',
                data: {
                    "listings":["Overview"],
                    "inventory":["Dummy"],
                    "cost":["Dummy"]
                },
                inspection_items:[],
                inspections_results:[],
                area:"",
                rate:"",
                visibleModal: null,
                visibleModalCost:null,
                res:[],
                status:"",
                refreshing: false,
                visible: false,
                area_data:false,
                renderUpload: false,
                id:"",
                check:""
            }
            this.thumbs_up=this.thumbs_up.bind(this);
            this.thumbs_down=this.thumbs_down.bind(this);
            this._pickImage=this._pickImage.bind(this);
            this.uploadImageAsync=this.uploadImageAsync.bind(this);
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

        if (check==1){
            fetch('http://kk.local:3000/api/v1/service_schedules?assignee_id=1&token='+this.state.token)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                              console.log("check here", responseJson)
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
            fetch('http://kk.local:3000/api/v1/service_schedules?assignee_id=1&token='+this.state.token)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                              console.log("check there", responseJson)
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
            this.setState({token: JSON.parse(data)[0].auth_token, worker: JSON.parse(data)[0].worker,  user_id: JSON.parse(data)[0].user_id});
        
        } catch (error) {
            console.log("Something went wrong");
        }
    }

    componentDidMount(){
        this._getToken();
        this.state.inspection_items=[
            {"id": 1, "description": "Capture a photo of the apartment front door showing the apartment number:", "photo_needed": true},
            {"id": 2, "description": "Is a lockbox present(with tag and light) if applicable?:", "photo_needed": false},
            {"id": 3, "description": "Capture a photo of theaccess items provided forthe guest:", "photo_needed": true}
        ];
            
        this.state.inspections_results=[
            {"inspection_item_id": 1, "service_schedule_id": 13356, "result": "bad", "picture_path": ""},
            {"inspection_item_id": 2, "service_schedule_id": 13356, "result": "bad", "picture_path": ""},
            {"inspection_item_id": 3, "service_schedule_id": 13356, "result": "bad", "picture_path": ""}
        ];
        
        this.state.id=this.props.navigation.state.params.param.id;
        this.state.check=1;
        if (this.state.check==1){
            fetch('http://kk.local:3000/api/v1/service_schedules/'+this.state.id+'/')
                        .then((response) => response.json())
                        .then((responseJson) => {
                              console.log("now!:", responseJson);
                            if(responseJson)
                            {  
                                let res = responseJson;
                                this.setState({
                                    data: res,
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
            fetch('http://kk.local:3000/api/v1/service_schedules/'+this.state.id+'/?token='+this.state.token)
                        .then((response) => response.json())
                        .then((responseJson) => {
                              console.log("here!:", responseJson);
                            if(responseJson)
                            {   
                            
                                let res= responseJson;
                                
                                this.setState({
                                    data: res,
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
        
        /*let list=[];
        if(this.state.data.listings!=null)
        {
            for(let i=0;i<this.state.data.listings.length;i++)
            {
                list.push({
                    value: this.state.data.listings[i]
                })
            }  
        }*/
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
        count=0;
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
                <Text style={styles.WorkOrderTextStyle}>{this.props.navigation.state.params.param.name}</Text>
                <Text style={styles.TextComponentStyle}>{this.props.navigation.state.params.param.address}</Text>
                <Text style={styles.TextComponentStyle}>{this.props.navigation.state.params.param.due}</Text>
               
                {this.state.data.inspection_results.map((item) => {
                    count=count+1;
                    return(
                        <View>
                           <Text style={styles.WorkOrderTextStyle}>{count+". "}{item.description}</Text>
                           <ScrollView contentContainerStyle={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-between'}}>
                           <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'stretch',flexDirection: 'row', flex: 1}}>
                                <ScrollView style={ {margin: 17}}>
                                    <Icon
                                        name='thumbs-up'
                                        type='font-awesome'
                                        color={item.result=="good" ?"#033b49":"#378A9E"}
                                        raised
                                        // reverse
                                        onPress={() => {
                                            this.thumbs_up(item);
                                        }}
                                    />
                                </ScrollView>
                                <ScrollView style={ {margin: 17}}>
                                    <Icon
                                        name='thumbs-down'
                                        type='font-awesome'
                                        color={item.result=="bad" ?"#033b49":"#378A9E"}
                                        raised
                                        onPress={() => {
                                            this.thumbs_down(item);
                                        }}
                                    />
                                </ScrollView>
                           </ScrollView>
                        
                           <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                                <ScrollView style={ {margin: 17}}>
                                    <Icon
                                        name='camera'
                                        type='font-awesome'
                                        color='#378A9E'
                                        raised
                                        onPress={() => {
                                            this._pickImage(item);
                                        }}
                                    />
                                {this._maybeRenderUploadingOverlay()}
                                 </ScrollView>
                           </ScrollView>

                        </ScrollView>
                        <ScrollView contentContainerStyle={{ justifyContent: 'center',alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                           <View style={styles.maybeRenderImageContainer}>
                           {item.images[0]&&(<Image source={{ uri: "http://kk.local:3000/"+item.images[0].directory}} style={styles.maybeRenderImage} />)}
                           </View>
                           
                        </ScrollView>
                    </View>
                    
                );
            })}
        
        
               
               
               
                    <View style={{marginBottom:20}}>
                            <Dropdown
                                label='Select Status'
                                data={status_data}
                                value={this.props.navigation.state.params.param.status}
                                onChangeText={(value,index,data)=>{this.statusUpdate(value)}}
                            />
                    </View>
                    <View style={{justifyContent: 'center',alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                        <TouchableOpacity style={styles.Check_outButtonStyle} onPress={()=>{ this.check_out() } }>                        
                            <Text style={styles.TextStyle4}>Check-Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </ScrollView>
  
        );
    }

    check_out=()=>{
         var time= new Date();
         var id=this.props.navigation.state.params.param.id;
         fetch('http://dev4.holidale.org/api/v1/access_out_update/check_out/'+id+'/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_out_datetime: time
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson)
                {
                    Alert.alert("Checked Out");
                }
            }).catch((error) => {
            console.error(error);
        }); 
         
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
        //const id = this.props.navigation.state.params.param.id;
        //const check = this.props.navigation.state.params.param.check;
      
        if (check==0)
        {
            fetch('http://dev4.holidale.org/api/v1/work_status/cleaning_schedules/'+this.state.id+'/', {
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
                    Alert.alert("Status Updated!");
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://dev4.holidale.org/api/v1/work_status/service_schedules/'+this.state.id+'/', {
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
                
                    Alert.alert("Status Updated!");

                }).catch((error) => {
                console.error(error);
            });
        }

    }

    thumbs_up=(inspection_result)=> {
        inspection_result.result="good";
        const check = 0;
        
        if (check==0)
        {
            fetch('http://kk.local:3000/api/v1/inspection_results/'+inspection_result.id+'/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inspector_id: this.state.user_id,
                    result: inspection_result.result
                })
                
            }).then((response) => response.json())
                .then((responseJson) => {
                      this.setState(() => {
                            console.log('Thumb up!');
                            return { unseen: "Thump up!" }
                        });
                      return;
                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://kk.local:3000/api/v1/inspection_results/'+inspection_result.id+'/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inspector_id: this.state.user_id,
                    result: inspection_result.result

                })

            }).then((response) => response.json())
                .then((responseJson) => {
                      this.setState(() => {
                            console.log('Thumb up!');
                            return { unseen: "Thump up!" }
                        });
                      return;
                }).catch((error) => {
                console.error(error);
            });
        }
    
    }
    
    thumbs_down=(inspection_result)=>{
        inspection_result.result="bad";

        const check = 0;

        if (check==0)
        {
            fetch('http://kk.local:3000/api/v1/inspection_results/'+inspection_result.id+'/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     inspector_id: this.state.user_id,
                     result: inspection_result.result
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                      this.setState(() => {
                            console.log('Thumb down');
                            return { unseen: "Thump down" }
                        });
                      return;
                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://kk.local:3000/api/v1/inspection_results/'+inspection_result.id+'/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     inspector_id: this.state.user_id,
                     result: inspection_result.result
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                      this.setState(() => {
                            console.log('Thumb down');
                            return { unseen: "Thump down" }
                        });
                      return;
                }).catch((error) => {
                console.error(error);
            });
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


    /*listing_data = async (inspection_result) =>{
        directory="";
        if (!inspection_result){
            return;
>>>>>>> V2.0 First BIG push
        }
        else{
            const uploadResponse = await fetch('http://kk.local:3000/api/v1/inspection_results/'+inspection_result.id+'/');
            const json = await response.json();
        }
        return(
               <View style={styles.maybeRenderImageContainer}>
               <Image source={{ uri: "http://kk.local:3000/"+directory}} style={styles.maybeRenderImage} />
               </View>
        );
    }*/
  
    changeText=(text)=>{
        this.setState({text: text});
        console.log(this.state.text);

    }

    // _maybeRenderImage = () => {
        
    //     let {
    //         image
    //     } = this.state;
    //     let x= this.state.image;
        
    //     if(image){
    //     return (
    //         <View style={styles.maybeRenderImageText}> 
    //             <View
    //                 style={styles.maybeRenderImageContainer}>
    //                 <Image source={{ uri: this.state.image }} style={styles.maybeRenderImage} />
    //             </View>

    //             <TextInput
    //                 style={styles.textInsert}
    //                 placeholder="Notes Here"
    //                 onChangeText={(text) => this.setState({text})}
    //                 value={this.state.text}
    //             />
    //             <View style={styles.content}>
    //             <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={()=>{ this.uploadNotes(this.state.image,this.state.text,this.state.area)}}>
    //                <Text style={styles.TextStyle}>Upload</Text>
    //             </TouchableOpacity>
    //             </View>
       
    //         </View>
            
    //     );
    // }
    // else{
    //     return;
    // }
    // };


    async _pickImage(inspection_result) {
            
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            // only if user allows permission to camera roll
            if (cameraRollPerm === 'granted') {
                 pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3]
                });
                this._handleImagePicked(inspection_result, pickerResult);
                this.setState(() => {
                    console.log('Image picked');
                    return { unseen: "Image picked" }
                });
            }
        this.setState({ unseen: "help me" });
    };

    _handleImagePicked = async (inspection_result, pickerResult) => {
        let uploadResponse, uploadResult;

        try {
            this.setState({
                uploading: true
            });

            if (!pickerResult.cancelled) {
                uploadResponse = await this.uploadImageAsync(inspection_result, pickerResult.uri);
                uploadResult = await uploadResponse;
               
                this.setState({
                    renderUpload: true,
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

    uploadNotes= (inspection_item, inspection_result)=> {
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        // if(link==false)
        // {
        //     Alert.alert("Image not selected!");
        // }
        if(inspection_result.picture_path&&inspection_result.comment){
            link= this.state.area_data.image;
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
                link= this.state.area_data.image;
    
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
        else if(link==false&&text=='')
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
            link= this.state.area_data.image;

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

     uploadImageAsync= async(inspection_result, uri)=> {

        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        
        const data = new FormData();
        data.append('images', {
             uri: uri,
             type: 'image/jpeg', // or photo.type
             name: 'testPhotoName'
        });
        data.append('inspector_id', this.state.user_id);
        data.append('result', inspection_result.result);
        fetch('http://kk.local:3000/api/v1/inspection_results/'+inspection_result.id+'/', {
             method: 'POST',
             headers: {
              'Content-Type': 'multipart/form-data',
             },
             body: data
        }).then(res => {
             console.log(res)
        });
        /*const file = {
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
         
          }*/
          
        /*return RNS3.put(file, options).then(response => {
            if (response.status !== 201)
              throw new Error("Failed to upload image to S3");
            return response.body.postResponse;
          });*/
    
    }
    
    
}


export default WorkOrder;
