import React, {Component} from 'react';
import {StyleSheet, TextInput, ScrollView, View, Alert, Text, Image, Dimensions, Share, ActivityIndicator, Clipboard, TouchableOpacity} from 'react-native';
import { Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { Table, Row, Rows } from 'react-native-table-component';

import { RNS3 } from 'react-native-aws3';


import {Permissions, ImagePicker } from 'expo';


let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

class WorkOrder extends Component {


        constructor(){
            super();
            this.state = {
                image: "",
                text: '',
                pickerResult:'',
                data: {
                    "listings":["Overview"],
                    "inventory":["Dummy"]
                },
                area:"",
                rate:"",
                
            }
        }
    
        componentDidMount(){
    
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        const userData=this.props.navigation.state.params.param.userData;
        if (check==1){
            fetch('http://localhost:3000/api/v1/work_order/service_schedules/'+id+'/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                                let res = responseJson;
                                
                                this.setState({
                                    data: res[0]   
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
            fetch('http://localhost:3000/api/v1/work_order/cleaning_schedules/'+id+'/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                                let res= responseJson;
                        
                                this.setState({
                                    data: res[0]
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


        let { image } = this.state;

        const InventoryState = {
            tableHead: ['Source', 'Product', 'Count'],
            tableData: [
                ['Car', 'Soap', '1'],
                ['Car', 'Toilet Paper', '2'],
                ['Car', 'Tower', '3'],
                ['Car', 'Clothe', '4']
            ]
        };

        const CostState = {
            tableHead: ['Item', 'Cost'],
            tableData: [
                ['2x Bulb', '$30'],
                ['Carpet Cleaning', '$150']
            ]
        };
       
        let inventData=[];
        for(let i=0;i<this.state.data.inventory.length;i++)
        {
            inventData.push([this.state.data.inventory[i].source,this.state.data.inventory[i].product,this.state.data.inventory[i].count])
        }
        console.log(inventData);

            let list=[];
            for(let i=0;i<this.state.data.listings.length;i++)
            {
                list.push({
                    value: this.state.data.listings[i]
                })
            }  
        
        const {goBack} = this.props.navigation;
     

        return(
            
            <ScrollView style={styles.container}>
                <Text style={styles.WorkOrderTextStyle}>{this.state.data.name}</Text>
                <Text style={styles.TextComponentStyle}>{this.state.data.address}</Text>
                <Text style={styles.TextComponentStyle}>{this.state.data.due}</Text>
                <ScrollView style={[{flex: 1}, styles.elementsContainer]}>
                    <ScrollView style={{flex: 1}}>
                       <Dropdown
                         label='Select Area'
                         data={list} 
                         onChangeText={(value,index,data)=>{this.setState({area:value});

                                for(let i=0;i<this.state.data.app_data.length;i++)
                                {   
                                    if (this.state.area==this.state.data.app_data[i].area)
                                    {   
                                        this.setState({area_data : this.state.data.app_data[i] });
                                        this.setState({index:i});
                                        this.setState({image:""});
 

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
                                    color='#517fa4'
                                    // reverseColor='red'
                                    raised
                                    // reverse
                                    onPress={() => this.thumbs_up()} />
                            </ScrollView>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='thumbs-down'
                                    type='font-awesome'
                                    color='#517fa4'
                                    // reverseColor='green'
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
                                    color='#517fa4'
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
                    <ScrollView style={styles.TableContainer} >
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={InventoryState.tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={inventData} textStyle={styles.text}/>
                        </Table>
                        <View style={styles.content}>
                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={()=>{ console.log("Hello1") }}>
                   <Text style={styles.TextStyle}>Add Inventory</Text>
                    </TouchableOpacity>
                    </View>
                    </ScrollView>
                    <ScrollView style={styles.TableContainer} >
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={CostState.tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={CostState.tableData} textStyle={styles.text}/>
                        </Table>
                        <View style={styles.content}>
                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={()=>{ console.log("Hello2") }}>
                   <Text style={styles.TextStyle}>Add Cost</Text>
                    </TouchableOpacity>
                    </View>
                    </ScrollView>
                </ScrollView>
            </ScrollView>

        );
    }

    thumbs_up=()=> {
        this.setState({rate:"true"});
        console.log(this.state.rate);
        this.state.area_data.rate="true";
        console.log(this.state.area_data);
    
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
      
        if (check==0)
        {
            fetch('http://localhost:3000/api/v1/up/cleaning_schedules/'+id+'/', {
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
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://localhost:3000/api/v1/down/service_schedules/'+id+'/', {
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

                }).catch((error) => {
                console.error(error);
            });
        }

    }
    thumbs_down=()=>{
        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        this.setState({rate:"false"});
        console.log(this.state.area_data);
        this.state.area_data.rate="false";
       
        if (check==0)
        {
            fetch('http://localhost:3000/api/v1/up/cleaning_schedules/'+id+'/', {
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
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://localhost:3000/api/v1/down/service_schedules/'+id+'/', {
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

    listing_data=()=>{
        console.log("Listing data: "+this.state.area_data);
        if (this.state.area_data) {

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
        console.log("RenderImage from UPload: "+image);
        let x= this.state.image;
        if(image){
        return (
            <View style={styles.maybeRenderImageText}> 
                <View
                    style={styles.maybeRenderImageContainer}>
                    <Image source={{ uri: image }} style={styles.maybeRenderImage} />
                </View>

                <TextInput
                    style={styles.textInsert}
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
                // console.log(uploadResult);
              this.setState({
                    image: uploadResult.location,
                    area_data: undefined
                });
            }
        } catch (e) {
            console.log({ uploadResponse });
        
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
      
        if (check==0)
        {
            fetch('http://localhost:3000/api/v1/notesupload/cleaning_schedules/'+id+'/', {
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
                    console.log(responseJson);
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://localhost:3000/api/v1/notesupload/service_schedules/'+id+'/', {
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
                    console.log(responseJson);

                }).catch((error) => {
                console.error(error);
            });
        }
    
    }

     uploadImageAsync= async(uri)=> {
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        
        const file = {
            uri: uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`
          }
          
          console.log(check);
          console.log(id);
        const options = {
            keyPrefix: "work-order/"+(check?"service_schedule/":"cleaning_schedule/")+id.toString()+"/images/",
            bucket: "holidale-maintenance-app",
            region: "us-east-2",
            accessKey: "AKIAJ4XF6TLKXHLKHERQ",
            secretKey: "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",
            successActionStatus: 201,
         
          }
          console.log(options);
    
        return RNS3.put(file, options).then(response => {
            if (response.status !== 201)
              throw new Error("Failed to upload image to S3");
            return response.body.postResponse;
          });
    
    }
    
    
}




const styles = StyleSheet.create({

    MainContainer :{

        flex:1,
        margin: 10,
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    TableContainer: { flex: 1, paddingTop: 10, backgroundColor: '#fff', marginTop:15 },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6 },

    elementsContainer: {
        margin: 20
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
        fontSize: 17,
        color: "#000",
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 4
    },

    WorkOrderTextStyle: {
        fontSize: 16,
        color: "#43889c",
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 8
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

    maybeRenderUploading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    maybeRenderContainer: {
        borderRadius: 3,
        elevation: 2,
        marginTop: 40,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOpacity: 0.2,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        shadowRadius: 5,
        width: 250,
    },
    maybeRenderImageContainer: {
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
 
    },
    maybeRenderImage: {
        height: 250,
        width:  400,
    },
    maybeRenderImageText: {
      
        flex:1,
        marginTop: 20
       
    
    },
    SubmitButtonStyle: {
        marginTop:10,
        padding:10,
        backgroundColor:'#00BCD4',
        borderRadius:10,
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
      },

      content:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
     
      TextStyle:{
          color:'#fff',
          textAlign:'center',
          fontSize:15
      },
      textInsert:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor: 'gray', 
        borderWidth: 1, 
        padding:5,
        margin:5,
        borderRadius:5
      }

});


export default WorkOrder;