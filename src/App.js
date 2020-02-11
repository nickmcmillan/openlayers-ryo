import React, { useRef, useEffect } from 'react'

import View from 'ol/View'
import olMap from 'ol/Map'
import Tile from 'ol/layer/Tile'
import Zoom from 'ol/control/Zoom'
import Feature from 'ol/Feature'
import { Icon, Style } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer } from 'ol/layer'
import Point from 'ol/geom/Point'


import { fromLonLat } from 'ol/proj'

import icon from './icon.png'


import Stamen from 'ol/source/Stamen'

import './App.css'

export default function Map() {

  const mapEl = useRef()

  useEffect(() => {

    const view = new View({
      center: fromLonLat([144.9787, -37.7987]),
      zoom: 17,
      minZoom: 2,
      maxZoom: 28,
    })


    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([144.9787, -37.7987])),
    })

    const iconStyle = new Style({
      image: new Icon({
        src: icon,
        scale: 0.08,
      })
    })

    iconFeature.setStyle(iconStyle)

    const vectorSource = new VectorSource({
      features: [iconFeature]
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource
    })


    let mapInstance = new olMap({
      view,
      controls: [new Zoom()],
      layers: [new Tile({ source: new Stamen({ layer: 'toner' }) }), vectorLayer],
      target: mapEl.current
    })


    // https://github.com/openlayers/openlayers/issues/9556
    return () => {
      // clear the icon
      vectorLayer.getSource().clear()
      vectorLayer.setSource(undefined)
      // clear the map
      mapInstance.removeLayer(vectorLayer)
      mapInstance.setTarget(null)

      // good measure
      mapInstance = null
    }

  }, [])


  return (
    <div id="mapContainer" ref={mapEl} />
  )
}