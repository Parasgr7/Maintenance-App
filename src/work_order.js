import React, {Component} from 'react';
import { StyleSheet, TextInput, ScrollView, Alert, Text,  Image, ImageBackground, Dimensions} from 'react-native';
import {Form, Item, Label, Input, Button} from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

class WorkOrder extends Component {


    static navigationOptions =
        {
            title: 'Work Order',

        };


    render()
    {
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
    }

});


export default WorkOrder;