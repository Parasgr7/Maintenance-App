import {StyleSheet, Dimensions} from "react-native";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

export default StyleSheet.create({

    MainContainer :{


        flex:1,
        margin: 10,
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        // marginTop: 50

    },

    TextInputStyleClass: {

        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
        borderColor: '#2196F3',
        borderRadius: 5 ,

    },

    TextComponentStyle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        marginBottom: 15
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
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30,
        marginLeft:30
    },
    SubmitButtonStyle: {
        flex:1,
        // justifyContent: "center",
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
        fontSize:17,
        marginLeft:10,
        fontWeight:'bold'
    },
    TextStyle2:{
        color:'#fff',
        fontSize:14,
        marginLeft:10
    },
    TextStyle3:{
        color:'#fff',
        fontSize:15,
        marginLeft:60,

    }

});
