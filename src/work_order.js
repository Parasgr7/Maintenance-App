import React, {Component} from 'react';
import { StyleSheet, TextInput, ScrollView, View, Alert, Text,  Image, ImageBackground, Dimensions, TouchableOpacity} from 'react-native';
import { Item, Label, Input, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { AsyncStorage } from "react-native";
import Modal from 'react-native-modal';
import t from 'tcomb-form-native';

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

var _ = require('lodash');

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = {
    flexDirection: 'row'
};
stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.error.flex = 1;

const Form = t.form.Form;

let Sources = t.enums({
    Car: 'Car',
    Bike: 'Bike'

});
let ProductNames = t.enums({
    Soap: 'Soap',
    Towel: 'Towel'
});

const Products = t.struct({
    name: ProductNames,
    count: t.Number
})

const User = t.struct({
    source: Sources,
    product: t.list(Products)
});

const options = {
    fields: {
        name: { /*...*/ },
        product: {
            item: {
                fields: {
                    name: {
                        // Documents t.struct 'type' options
                    },
                    count: {
                        // Documents t.struct 'value' options
                    },
                    stylesheet: stylesheet
                }
            }
        }
    }
}

class WorkOrder extends Component {


    static navigationOptions =
        {
            // title: 'Work Order',
        };
        constructor(){
            super();
            this.state = {
                data: {
                    "listings":["Overview"]
                },
                visibleModal: null,
            }
        }

    handleSubmit = () => {
        const value = this.formRef.getValue();
        console.log('value:', value);
    }

    _renderButton = (text, onPress) => (
        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={onPress}>
                <Text style={styles.TextStyle}>{text}</Text>
        </TouchableOpacity>
    );

    _renderModalContent = () => (
        <ScrollView contentContainerStyle={[{justifyContent: 'flex-start'}, styles.modalContent]}>

            <Form ref={c => this.formRef = c} type={User} options={options} />
            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.handleSubmit }>
                <Text style={styles.TextStyle}> Submit </Text>
            </TouchableOpacity>
            {this._renderButton('Close', () => this.setState({ visibleModal: null }))}
        </ScrollView>
    );

        componentDidMount(){

        const id = this.props.navigation.state.params.param.id;
        const check = this.props.navigation.state.params.param.check;
        const userData=this.props.navigation.state.params.param.userData;
        if (check===1){
            fetch('http://dev4.holidale.org/api/v1/work_order/service_schedules/'+id+'/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                                let res = responseJson;
                                console.log(res);

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
            fetch('http://dev4.holidale.org/api/v1/work_order/cleaning_schedules/'+id+'/?token='+userData.token+'&date='+userData.date)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            if(responseJson)
                            {
                                let res= responseJson;
                                console.log(res);
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
        console.log(this.state.data.listings);
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

        let status_data = [{
            value: 'Completed',
        }, {
            value: 'Scheduled',
        }, {
            value: 'Pending',
        }];

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
                                    onPress={() => console.log('hello')} />
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
                        {this._renderButton('Add Inventory', () => this.setState({ visibleModal: 1 }))}
                        <Modal isVisible={this.state.visibleModal === 1} style={styles.bottomModal}>
                            {this._renderModalContent()}
                        </Modal>
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

                <ScrollView style={[{flex: 1, marginBottom: 20}, styles.elementsContainer]}>
                    <ScrollView style={{flex: 1}}>
                        <Dropdown
                            label='Select Status'
                            data={status_data}
                            onChangeText={(value,index,data)=>{console.log(value)}}
                        />
                    </ScrollView>
                </ScrollView>

            </ScrollView>

        );
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
    modalContent: {
        backgroundColor: 'white',
        paddingTop: 35,
        padding: 20,
        //justifyContent: 'center',
        height: height
        //alignItems: 'center',
       // borderRadius: 4,
        //borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    SubmitButtonStyle: {

        marginTop:30,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#00BCD4',
        borderRadius:10,
    },
    TextStyle:{
        color:'#fff',
        textAlign:'center',
        fontSize:20
    }
});


export default WorkOrder;