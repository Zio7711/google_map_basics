import './App.css';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';

import { useState } from 'react';
import Geocode from 'react-geocode';
import { Descriptions } from 'antd';

Geocode.setApiKey('AIzaSyBSiONJOQ8YPQ-hcoVG54976JFY15jiNb4');

const getCity = (addressArray) => {
  let city = '';
  for (const index in addressArray) {
    if (
      addressArray[index].types[0] &&
      'administrative_area_level_2' === addressArray[index].types[0]
    ) {
      city = addressArray[index].long_name;
      return city;
    }
  }
};

const getArea = (addressArray) => {
  let area = '';
  for (let i = 0; i < addressArray.length; i++) {
    if (addressArray[i].types[0]) {
      for (let j = 0; j < addressArray[i].types.length; j++) {
        if (
          'sublocality_level_1' === addressArray[i].types[j] ||
          'locality' === addressArray[i].types[j]
        ) {
          area = addressArray[i].long_name;
          return area;
        }
      }
    }
  }
};

const getProvince = (addressArray) => {
  let province = '';
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        'administrative_area_level_1' === addressArray[i].types[0]
      ) {
        province = addressArray[i].long_name;
        return province;
      }
    }
  }
};

const App = () => {
  const [state, setState] = useState({
    adress: '',
    city: '',
    area: '',
    state: '',
    zoom: 10,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  });

  const onMarkerDragEnd = (event) => {
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then((response) => {
      const address = response.results[0].formatted_address;
      const addressArray = response.results[0].address_components;
      const city = getCity(addressArray);
      const area = getArea(addressArray);
      const province = getProvince(addressArray);
      setState({
        address: address ? address : '',
        area: area ? area : '',
        city: city ? city : '',
        province: province ? province : '',
        markerPosition: {
          lat: newLat,
          lng: newLng,
        },
        mapPosition: {
          lat: newLat,
          lng: newLng,
        },
      });
    });
  };

  const MapWithAMarker = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{
          lat: state.mapPosition.lat,
          lng: state.mapPosition.lng,
        }}
      >
        <Marker
          draggable={true}
          onDragEnd={onMarkerDragEnd}
          position={{
            lat: state.markerPosition.lat,
            lng: state.markerPosition.lng,
          }}
        >
          <InfoWindow>
            <div>hello</div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    ))
  );

  return (
    <div>
      <Descriptions title="User Info" bordered>
        <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
        <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
        <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
        <Descriptions.Item label="Order time">
          2018-04-24 18:00:00
        </Descriptions.Item>
        <Descriptions.Item label="Usage Time" span={2}>
          2019-04-24 18:00:00
        </Descriptions.Item>
      </Descriptions>

      <MapWithAMarker
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBSiONJOQ8YPQ-hcoVG54976JFY15jiNb4"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
};

export default App;
