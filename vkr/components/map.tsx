import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import cluster from "cluster";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;



export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(() => ({ lat: 59.967384, lng: 30.289533 }), []);
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "f818ae67dd019888",
      disabledDefaultUI: true,
      clickableIcons: false,
    }), 
    []
  );
  const onLoad = useCallback(map => (mapRef.current = map), []);
  const houses = useMemo(() => generateHouses(center), [center]);

  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    )
  }

  return (
    <div className="container">
      <div className="controls">
        <h1>Commute?</h1>
        <Places setOffice={(position) => {
          setOffice(position);
          mapRef.current?.panTo(position);
        }} />
        {!office && <p>Enter the address.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
          <GoogleMap 
            zoom={13} 
            center={center} 
            mapContainerClassName="map-container"
            options={options}
            onLoad={onLoad}
          >
            {directions && (<DirectionsRenderer directions={directions} options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "#1976D2",
                strokeWeight: 5,
              },
            }}/>)}

            {office && (
              <>
                <Marker 
                  position={office} 
                />
                
              <MarkerClusterer>
                {clusterer => 
                  houses.map(house => ( 
                    <Marker 
                      key={house.lat} 
                      position={house}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(house);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              <Circle center={office} radius={2500} options={defaultOptions}/>
              </>  
            )}

          </GoogleMap>
      </div>  
    </div>
);
}

const defaultOptions = {
  strokeOpacity: 0,
  strokeWeight: 0,
  clickable: false,
  draggable: false,
  editable: false,
  visible: false,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 1000; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
