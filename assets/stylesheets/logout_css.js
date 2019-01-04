import {StyleSheet, Dimensions} from "react-native";

let height= Dimensions.get('window').height;
let width= Dimensions.get('window').width;

export default StyleSheet.create({

    MainContainer :{

        justifyContent: 'center',
        flex:1,
        margin: 10,
    },
    map:{
        ...StyleSheet.absoluteFillObject
    },
    SubmitButtonStyle1: {
        flex:0,
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:'#00BCD5',
        borderRadius: 15,
        // marginTop:10,
        // padding:25,
        paddingTop:15,
        paddingBottom:20,
        paddingRight:10,
        // marginRight:30,
    },
    
    Fix_ButtonStyle: {
       borderWidth:1,
       borderColor:'rgba(0,0,0,0.2)',
       alignItems:'center',
       justifyContent:'center',
       width:50,
       height:50,
       backgroundColor:'#fff',
       borderRadius:100,
       margin:10
    },
    Check_inButtonStyle: {
        flex:0.5,
        justifyContent: "center",
        height:35,
        // marginTop:0,
        // marginLeft:0,
        // marginRight:5,
        // marginBottom:15,
        backgroundColor:'#018bb3',
        borderRadius:10,
    },
    TextStyleHead:{
        color:'white',
        fontSize:18,
        marginLeft:10,
        marginBottom:5,
        fontWeight:'bold'
    },

    TextStyle:{
        color:'#fff',
        fontSize:16,
        marginLeft:10,
        fontWeight:'bold',
        
    },
    TextStyle2Bold:{
        color:'#fff',
        fontSize:15,
        marginLeft:10,
        marginBottom:5,
        fontWeight:'bold',
    },
    NoStyle2Bold:{
        color:'black',
        fontSize:22,
        marginLeft:10,
        marginBottom:5,
        margin:20,
        fontWeight:'bold',
    },
    TextStyle2:{
        color:'#fff',
        fontSize:15,
        marginLeft:10,
        marginBottom:5,
    },
    TextStyle3:{
        textAlign: 'right',
        color:'#fff',
        fontWeight:'bold',
        fontSize:16,
        marginRight:0,
        margin:10

    },
    TextStyle5:{
        textAlign: 'right',
        color:'#fff',
        fontWeight:'bold',
        fontSize:16,
        marginRight:0,


    },
    TextStyle4:{
        color:'#fff',
        textAlign:'center',
        fontSize:15,
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
        marginTop: 80,
        width: 300,
        resizeMode: 'contain'
    },
    inputStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 15
    },
    WorkOrderTextStyle2: {
        fontSize: 20,
        color: "white",
        textAlign: 'center',
        marginTop: 14,
    },
    WorkOrderTextStyle: {
        fontSize: 16,
        color: "Black",
        textAlign: 'center',
        marginTop: 14,
    },
    WorkOrderTextStyle1: {
        fontSize: 18,
        color: "white",
        textAlign: 'center',
        margin: 10,
    },
    error: {
        color: 'red',
        paddingTop: 10
    },
    SubmitButtonStyle: {
 
        marginTop:40,
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