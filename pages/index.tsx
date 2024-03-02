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
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null); // Create a ref for the map container
  const map = useRef<Map | null>(null); // Create a ref for the map instance
  const vectorSource = useRef<VectorSource<Feature<Geometry>>>(new VectorSource()); // Create a ref for the vector source
  const vectorLayer = useRef<VectorLayer<VectorSource<Feature<Geometry>>>>(new VectorLayer({ source: vectorSource.current })); // Create a ref for the vector layer
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
        vectorLayer.current, // Add the vector layer to the map
      ],
      view: new View({
        center: fromLonLat([0, 0]), // Set the initial center of the map to (0, 0) (longitude, latitude)
        zoom: 2, // Set the initial zoom level of the map
      }),
    });

    // Create a new Draw interaction for drawing points
    drawInteraction.current = new Draw({
      source: vectorSource.current, // Use the vector source for drawing
      type: 'Point', // Set the type of geometry to draw (Point, LineString, Polygon, etc.)
    });
    // Add the draw interaction to the map
    map.current.addInteraction(drawInteraction.current);

    // Create a new Modify interaction for modifying drawn features
    modifyInteraction.current = new Modify({
      source: vectorSource.current, // Use the vector source for modifying
    });
    // Add the modify interaction to the map
    map.current.addInteraction(modifyInteraction.current);

    // Create a new Snap interaction for snapping to nearby points
    snapInteraction.current = new Snap({
      source: vectorSource.current, // Use the vector source for snapping
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
  return <div ref={mapRef} style={{ width: '100%', height: '700px' }}></div>;
};

export default Home;
