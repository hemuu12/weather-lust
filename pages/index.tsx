import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map'; // Import the Map class from OpenLayers
import View from 'ol/View'; // Import the View class from OpenLayers
import TileLayer from 'ol/layer/Tile'; // Import the TileLayer class from OpenLayers
import OSM from 'ol/source/OSM'; // Import the OSM class from OpenLayers
import { fromLonLat } from 'ol/proj'; // Import the fromLonLat function from OpenLayers
import { Draw, Modify, Snap } from 'ol/interaction'; // Import interaction classes from OpenLayers
import VectorLayer from 'ol/layer/Vector'; // Import the VectorLayer class from OpenLayers
import VectorSource from 'ol/source/Vector'; // Import the VectorSource class from OpenLayers
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'; // Import style classes from OpenLayers

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null); // Create a ref for the map container
  const map = useRef<Map | null>(null); // Create a ref for the map instance
  const vectorLayer = useRef<VectorLayer | null>(null); // Create a ref for the vector layer
  const drawInteraction = useRef<Draw | null>(null); // Create a ref for the draw interaction
  const modifyInteraction = useRef<Modify | null>(null); // Create a ref for the modify interaction
  const snapInteraction = useRef<Snap | null>(null); // Create a ref for the snap interaction

  useEffect(() => {
    if (!mapRef.current) return; // Check if the map container ref is valid

    // Create a new Map instance with a TileLayer using OpenStreetMap (OSM) as the source
    map.current = new Map({
      target: mapRef.current, // Set the target to the map container ref
      layers: [
        new TileLayer({
          source: new OSM(), // Use OSM as the tile source
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]), // Set the initial center of the map to (0, 0) (longitude, latitude)
        zoom: 2, // Set the initial zoom level of the map
      }),
    });

    // Create a new VectorLayer instance with a VectorSource
    vectorLayer.current = new VectorLayer({
      source: new VectorSource(), // Use a VectorSource for the layer
      style: new Style({ // Apply styles to the vector layer
        fill: new Fill({
          color: 'rgba(255, 215, 0, 0.2)', // Golden color with opacity
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.8)', // Black color with opacity
          width: 2, // Set the stroke width to 2 pixels
        }),
        image: new CircleStyle({ // Use a circle style for points
          radius: 7, // Set the radius of the circle
          fill: new Fill({
            color: 'rgba(255, 215, 0, 0.8)', // Golden color with opacity
          }),
          stroke: new Stroke({
            color: '#fff', // White color for the stroke
            width: 2, // Set the stroke width to 2 pixels
          }),
        }),
      }),
    });

    // Add the vector layer to the map
    map.current.addLayer(vectorLayer.current);

    // Create a new Draw interaction for drawing points
    drawInteraction.current = new Draw({
      source: vectorLayer.current.getSource(), // Set the source of the draw interaction to the vector layer source
      type: 'Point', // Set the type of geometry to draw (Point, LineString, Polygon, etc.)
    });
    // Add the draw interaction to the map
    map.current.addInteraction(drawInteraction.current);

    // Create a new Modify interaction for modifying drawn features
    modifyInteraction.current = new Modify({
      source: vectorLayer.current.getSource(), // Set the source of the modify interaction to the vector layer source
    });
    // Add the modify interaction to the map
    map.current.addInteraction(modifyInteraction.current);

    // Create a new Snap interaction for snapping to nearby points
    snapInteraction.current = new Snap({
      source: vectorLayer.current.getSource(), // Set the source of the snap interaction to the vector layer source
    });
    // Add the snap interaction to the map
    map.current.addInteraction(snapInteraction.current);

    // Cleanup function to dispose the map instance when the component unmounts
    return () => {
      if (map.current) {
        map.current.dispose();
      }
    };
  }, []); // Run this effect only once after the initial render

  // Return the map container element
  return <div ref={mapRef} style={{ width: '100%', height: '700px' , color:"black"}}></div>;
};

export default Home;
