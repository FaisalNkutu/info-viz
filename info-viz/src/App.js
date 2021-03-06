import React, { Component } from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import './App.css'

import BarChart from './Components/BarChart'

const geoJson = require('./affected_people.json');
const position = [49,-123];

class App extends Component {
  state = {
    markerRadius: 30,
    map: React.createRef(),
    chartData: {
      margins: {top: 0, right: 50, bottom: 200, left: 50},
      width: 800,
      height: 600,
    },
  }
  
  bindFeatures = (feature, layer) => {
    layer.on({
      click: this.featureClick
    });
    
  }

  featureClick = (e) => {
    const { chartData } = this.state
    var layer = e.target;
    const data = layer.feature.properties
    const dataSet = Object.keys(data).map(label => ({ label, value: data[label] }) )
    dataSet.splice('id', 1)
    console.log(dataSet)
    this.setState({ chartData: {
      ...chartData,
      dataSet,
    } })
  }

  pointToLayer = (feature, latlng) => {
    const val = parseFloat(feature.properties['sc_DP30'])
    const heat = val*0.256
    if(heat === 0) { return null }
    const fillOpacity = val/20
    const radius = 200 + (heat*2)
    const r = parseInt(heat/2+128,10)
    const g = parseInt(heat,10)
    const b = parseInt(heat/4,10)
    return L.circle(latlng, {fillColor: `rgb(${r},${g},${b})`, fill: true, fillOpacity, radius, stroke: false})
  }

  render() {
    const { map, chartData } = this.state
    return (
      <div className="infoViz">
        <Map center={position} zoom={10} ref={map}>
          <TileLayer
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={geoJson}
            onEachFeature={this.bindFeatures}
            pointToLayer={this.pointToLayer} 
          />
        </Map>
        <div className="narrative">
          <h2>sc_CasNitL1</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div className="chart">
          <BarChart data={chartData} />
        </div>
      </div>
    )
  }
}

export default App;
