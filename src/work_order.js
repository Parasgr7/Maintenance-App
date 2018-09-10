import React, {Component} from 'react';
import {StyleSheet, TextInput, ScrollView, View, Alert, Text, Image, ImageBackground, Dimensions, Share, ActivityIndicator, Clipboard} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { AsyncStorage } from "react-native";
import { RNS3 } from 'react-native-aws3';


import {Permissions, ImagePicker } from 'expo';

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

class WorkOrder extends Component {

    state = {
        image: null,
        text: '',
        pickerResult:''
    };

    static navigationOptions =
        {
 
        };

    
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

        let data = [{
            value: 'Overview',
        }, {
            value: 'Master Bedroom',
        }, {
            value: 'Garage',
        }];

        const {goBack} = this.props.navigation;

        return(

            <ScrollView style={styles.container}>
                <Text style={styles. WorkOrderTextStyle}>Checkout Inspection</Text>
                <Text style={styles.TextComponentStyle}>8 Corporate Park, Irvine CA</Text>
                <Text style={styles.TextComponentStyle}>Due: 11:00 AM 05/24/18</Text>
                <ScrollView style={[{flex: 1}, styles.elementsContainer]}>
                    <ScrollView style={{flex: 1}}>
                       <Dropdown
                         label='Select Area'
                         data={data}
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
                                    onPress={() => console.log('hello')} />
                            </ScrollView>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='thumbs-down'
                                    type='font-awesome'
                                    color='#517fa4'
                                />
                            </ScrollView>
                        </ScrollView>
                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row', flex: 1}}>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='camera'
                                    type='font-awesome'
                                    color='#517fa4'
                                    onPress={this._pickImage} 
                                />
                                {this._maybeRenderImage()}
                                {this._maybeRenderUploadingOverlay()}
                            </ScrollView>
                            <ScrollView style={ {margin: 7}}>
                                <Icon
                                    name='sticky-note'
                                    type='font-awesome'
                                    color='#517fa4'
                                />
                            </ScrollView>
                        </ScrollView>

                    </ScrollView>
                    <ScrollView style={styles.TableContainer} >
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={InventoryState.tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={InventoryState.tableData} textStyle={styles.text}/>
                        </Table>
                        <Button
                            primary
                            block
                            style={[{ width: "50%", margin: 10, padding: 4, backgroundColor: "#43889c" }]}
                        >
                            <Text style={{color: 'white'}}>Add Inventory</Text>
                        </Button>
                    </ScrollView>
                    <ScrollView style={styles.TableContainer} >
                        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                            <Row data={CostState.tableHead} style={styles.head} textStyle={styles.text}/>
                            <Rows data={CostState.tableData} textStyle={styles.text}/>
                        </Table>
                        <Button
                            primary
                            block
                            style={[{ width: "50%", margin: 10, padding: 4, backgroundColor: "#43889c" }]}
                        >
                            <Text style={{color: 'white'}}>Add Cost</Text>
                        </Button>
                    </ScrollView>
                </ScrollView>
            </ScrollView>

        );
    }

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
                    <ActivityIndicator color="red" size="small" />
                </View>
            );
        }
    };

    _maybeRenderImage = () => {
        let {
            image,
        } = this.state;
        // console.log(image);
        if (!image) {
            return;
        }
        // console.log(this.state.text);
        return (
            <View
                style={styles.maybeRenderImageText}>
                 
                <View
                    style={styles.maybeRenderImageContainer}>
                    <Image source={{ uri: image }} style={styles.maybeRenderImage} />
                </View>

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 2}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
                <Button
                    primary
                    block
                    onPress={()=>{ this.uploadNotes(this.state.image,this.state.text)}}
                >
               <Text>Upload</Text>
                </Button>
       
            </View>
            
        );
    };

    _share = () => {
        Share.share({
            message: this.state.image,
            title: 'Check out this photo',
            url: this.state.image,
        });
    };

    _copyToClipboard = () => {
        Clipboard.setString(this.state.image);
        alert('Copied image URL to clipboard');
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
                uploadResponse = await uploadImageAsync(pickerResult.uri);
                uploadResult = await uploadResponse;
              this.setState({
                    image: uploadResult.location,
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

    uploadNotes= (link,text,area,id)=> {

        if (check==0)
        {
            fetch('http://localhost:3000/api/v1/notesupload/cleaning_schedules/'+id+'/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    image: link,
                    note: text,
                    area: area,
                    id: id

                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    

                }).catch((error) => {
                console.error(error);
            });
        }
        else
        {   
            fetch('http://localhost:3000/api/v1/notesupload/service_schedules/'+id+'/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    image: link,
                    note: text,
                    area: area,
                    id: id

                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    

                }).catch((error) => {
                console.error(error);
            });
        }
    
    }
    
    
}

async function uploadImageAsync(uri) {
    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];
    
    const file = {
        uri: uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`
      }

    const options = {
        // keyPrefix: "uploads/",
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


const styles = StyleSheet.create({

    MainContainer :{

        flex:1,
        margin: 10,
    },

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    TableContainer: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff' },
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
        alignItems: 'center',
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    maybeRenderContainer: {
        borderRadius: 3,
        elevation: 2,
        marginTop: 30,
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
        width:  250,
    },
    maybeRenderImageText: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    }

});


export default WorkOrder;