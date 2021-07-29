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
import AutoComplete from 'react-google-autocomplete';
import apiKey from './apiKey';

require('dotenv').config();

Geocode.setApiKey(apiKey);

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

  const onPlaceSelected = (place) => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();

    setState({
      address: address ? address : '',
      area: area ? area : '',
      city: city ? city : '',
      state: state ? state : '',
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
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

        <AutoComplete
          apiKey={apiKey}
          style={{
            width: '100%',
            height: '40px',
            paddingLeft: '16px',
            marginTop: '2px',
            marginBottom: '2rem',
          }}
          onPlaceSelected={onPlaceSelected}
          types={['(regions)']}
        />
      </GoogleMap>
    ))
  );

  return (
    <div style={{ oadding: '1rem', margin: '0 auto', maxWidth: 1000 }}>
      <h1>Google Map Basic</h1>
      <Descriptions bordered>
        <Descriptions.Item label="City">{state.city}</Descriptions.Item>
        <Descriptions.Item label="Area">{state.area}</Descriptions.Item>
        <Descriptions.Item label="State">{state.state}</Descriptions.Item>
        <Descriptions.Item label="Address">{state.address}</Descriptions.Item>
      </Descriptions>

      <MapWithAMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
};

export default App;
