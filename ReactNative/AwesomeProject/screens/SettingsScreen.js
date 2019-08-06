
import React from "react";
import { Button, View, Text } from "react-native";

import Svg, {
  Circle,
  Ellipse,
  G,
  //Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';


import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'

import { Dimensions } from 'react-native'
const screenWidth = Dimensions.get('window').width

import { NavigationEvents } from 'react-navigation';
//import console = require("console");

import RNFetchBlob from 'rn-fetch-blob'



export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      films: [],
      searchedText: "", // Initialisation de notre donnée searchedText dans le state
      data: [
        Math.random() * 100,

      ],
      bigData: [],
      chartLoaded: false,
      modeSelected: false,
      chartColor: '#e26a00',
      temperatureCColor: '#e26a00',
      temperatureFColor: '#000084',
      heatIndexCColor: '#f41584',
      heatIndexFColor: '#841584',
      humidityColor: '#84a5a4',
      chartType: 'a',
      temperaturesC: [],
      temperaturesF: [],
      heatIndexsC: [],
      heatIndexsF: [],
      humidities: [],
      yAxisLabel: "°C ",
      labelTempC: "°C ",
      labelTempF: "°F ",
      labelHumidity: "% "
    }


    this.handleTempC = this.handleTempC.bind(this);
    this.handleTempF = this.handleTempF.bind(this);
    this.handleHeatIndexC = this.handleHeatIndexC.bind(this);
    this.handleHeatIndexF = this.handleHeatIndexF.bind(this);
    this.handleHumidity = this.handleHumidity.bind(this);


  }


  componentDidMount() {


    console.log("compoennt did mount ");

    this.fetchData();

    //
    //

  }

  fetchData() {

    let _temperaturesC = [];
    let _temperaturesF = [];
    let _heatIndexsC = [];
    let _heatIndexsF = [];
    let _humidities = [];


    fetch('http://192.168.1.29/get?log=20190704')
      .then((response) => response.text())
      .then((response) => {

        let lines = response.split("\r\n");

        //console.log(lines);
        for (let i = 1; i < lines.length - 1; i++) {
          let splLine = lines[i].split(",");
          //console.log(splLine);
          //console.log(splLine[4]);


     
          _humidities.push(parseFloat(splLine[3]));
          _temperaturesC.push(parseFloat(splLine[4]));
          _heatIndexsC.push(parseFloat(splLine[5]));
          _temperaturesF.push(parseFloat(splLine[6]));
          _heatIndexsF.push(parseFloat(splLine[7]));

       

        }



      })
      .then((response) => {
        console.log(_heatIndexsC)


        this.setState({temperaturesC: _temperaturesC})
        this.setState({temperaturesF: _temperaturesF})
        this.setState({heatIndexsC: _heatIndexsC})
        this.setState({heatIndexsF: _heatIndexsF})
        this.setState({humidities: _humidities})


        this.setState({ data: _temperaturesC });
        this.setState({ chartLoaded: true });
      })

  }




  async onFocus(payload) {
    console.log("focus");

/*
    let dayData = [
      Math.random() * 100,
      Math.random() * 100,
    ];
    */

    let _temperaturesC = [];
    let _temperaturesF = [];
    let _heatIndexsC = [];
    let _heatIndexsF = [];
    let _humidities = [];



    let splText;

    RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
      })
      .fetch('GET', 'http://192.168.1.29/get?log=20190704', {
        //some headers ..
      })
      .then((res, payload) => {
        // the temp file path
        //console.log(res);
        res.text().then(function (res) {
          //console.log(res);

          splText = res.split("\r\n");

        }).then(function (res, payload) {

          console.log("hello? ");
          
          for (let i = 1; i < splText.length - 1; i++) {
            //console.log(splText[i]);
            let splLine = splText[i].split(",");
            //console.log(splLine);
            //console.log(splLine[4]);


            let tempC = splLine[4];

            _humidities.push(parseFloat(splLine[3]));
            _temperaturesC.push(parseFloat(splLine[4]));
            _heatIndexsC.push(parseFloat(splLine[5]));
            _temperaturesF.push(parseFloat(splLine[6]));
            _heatIndexsF.push(parseFloat(splLine[7]));
        
          }

          console.log("hic");
          console.log(_heatIndexsC);

          this.setState({ chartLoaded: false })

          /*
          this.setState({temperaturesC: _temperaturesC})
          this.setState({temperaturesF: _temperaturesF})
          this.setState({heatIndexsC: _heatIndexsC})
          this.setState({heatIndexsF: _heatIndexsF})
          this.setState({humidities: _humidities})
          */
          this.setState({ data: _temperaturesC })

 


        });

        //let splText = text.split("\r\n");
        //console.log(text);

        

        //
        console.log('The file saved to ', res.path())
      })



    // ON DEMANDE LES DONNEES A CE MOMENT LA POUR LES METTRE A JOUR SUR LE GRAPH

  }

  _renderChart() {
    if (this.state.chartLoaded === true) {

        return (
          <LineChart
            data={{
              labels: ['', '', '', '', '', '', '', '', '', '', ''],
              datasets: [{
                data: this.state.data
              }]
            }} //
            width={Dimensions.get('window').width - 20} // from react-native
            height={220}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            yAxisLabel={this.state.yAxisLabel}
            chartConfig={{
              backgroundColor: this.state.chartColor,
              backgroundGradientFrom: this.state.chartColor, //
              backgroundGradientTo: this.state.chartColor,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        );
      
      
    } else {

      return (
        <Image source={require('../img/giphy.gif')} />
      );
    }
  }

  _renderChartSelection() {

    if (this.state.chartLoaded === true) {
      return (

        <View>
          <View style={[{ width: "100%", marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <Button
              onPress={this.handleTempC}
              title="Temperature °C"
              color={this.state.temperatureCColor}
              accessibilityLabel="Learn more about this purple button"
            />
          </View>

          <View style={[{ width: "100%", marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <Button
              onPress={this.handleTempF}
              title="Temperature °F"
              color={this.state.temperatureFColor}
              accessibilityLabel="Learn more about this purple button"
            />
          </View>

          <View style={[{ width: "100%", marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <Button
              onPress={this.handleHeatIndexC}
              title="HeatIndex °C"
              color={this.state.heatIndexCColor}
              accessibilityLabel="Learn more about this purple button"
            />
          </View>

          <View style={[{ width: "100%", marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <Button
              onPress={this.handleHeatIndexF}
              title="HeatIndex °F"
              color={this.state.heatIndexFColor}
              accessibilityLabel="Learn more about this purple button"
            />
          </View>

          <View style={[{ width: "100%", marginBottom: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <Button
              onPress={this.handleHumidity}
              title="Humidity"
              color={this.state.humidityColor}
              accessibilityLabel="Learn more about this purple button"
            />
          </View>

        </View>
      );
    } else {
      return null;
    }
  }

  handleTempC(){
    this.setState({chartColor: this.state.temperatureCColor});
    this.setState({ data: this.state.temperaturesC })
    this.setState({yAxisLabel: this.state.labelTempC})
  }

  handleTempF(){
    this.setState({chartColor: this.state.temperatureFColor});
    this.setState({ data: this.state.temperaturesF });
    this.setState({yAxisLabel: this.state.labelTempF})
  }

  handleHeatIndexC(){
    this.setState({chartColor: this.state.heatIndexCColor});
    this.setState({ data: this.state.heatIndexsC });
    this.setState({yAxisLabel: this.state.labelTempC})
  }

  handleHeatIndexF(){
    this.setState({chartColor: this.state.heatIndexFColor});
    this.setState({ data: this.state.heatIndexsF });
    this.setState({yAxisLabel: this.state.labelTempF})
  }


  handleHumidity(){
    this.setState({chartColor: this.state.humidityColor});
    this.setState({ data: this.state.humidities });
    this.setState({yAxisLabel: this.state.labelHumidity})
  }





  render() {

    const chartLoaded = this.state.chartLoaded;
    let text;

    if (!chartLoaded) {
      // text = <Image source={{uri: "https://media.tenor.com/images/39d6060576a516f1dd437eafccafbdb1/tenor.gif"}} style={{width:100, height:100}} />; //
      text = <Text style={{ fontWeight: 'bold' }}>Data is loading, please wait a moment ...</Text>;

    } else {
      text = null;
    } //

    return (
      <View >

        <NavigationEvents
        //onWillFocus={ payload => this.onFocus(payload) }

        />


        <Text>
          Temperature Chart
      </Text>


        {this._renderChart()}

        {this._renderChartSelection()}


        {text}




      </View>
    );
  }
}