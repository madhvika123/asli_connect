import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from "antd";
import { TextField } from "@mui/material";
import { FiMapPin } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";

const initialCoordinates = {
  latitude: 0, // Replace with your default latitude
  longitude: 0, // Replace with your default longitude
};

const initialAddress = {
  area: "manimajra",
  city: "Chandigarh",
  state: "Punjab",
  zip: "160047",
  country: "INDIA",
  plain() {
    return `${this.area}, ${this.city}, ${this.zip}, ${this.state}, ${this.country}`;
  },
};

const LocationSearchMui = ({
  setLatitude,
  setLongitude,
  setArea,
  setAddress,
  initialValue,
  onChange,
  disabledStatus,
  setAddressObject,
}) => {
  const searchInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = "AIzaSyD0pb4Bwj8KYUWRimZfmNuZQ9BOotkezF4";
  const mapApiJs = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
  const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";

  const loadAsyncScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      Object.assign(script, {
        type: "text/javascript",
        async: true,
        src,
      });
      script.addEventListener("load", () => resolve(script));
      document.head.appendChild(script);
    });
  };

  const initAutocomplete = () => {
    if (!searchInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInputRef.current
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () =>
      onChangeAddress(autocomplete)
    );
  };

  useEffect(() => {
    loadAsyncScript(mapApiJs).then(() => {
      if (window.google) {
        initAutocomplete();
        // const storedAddress = JSON.parse(localStorage.getItem("currentPlace"));
        // if (storedAddress) {
        //   // Ensure the plain method is added to the stored address
        //   const addressWithPlain = {
        //     ...storedAddress,
        //     plain: function() {
        //       return `${this.area}, ${this.city}, ${this.zip}, ${this.state}, ${this.country}`;
        //     },
        //   };
        //   searchInputRef.current.value = addressWithPlain.plain();
        //   setAddress(addressWithPlain);
        //   onLocationChange(initialCoordinates, addressWithPlain);
        // } else {
        //   findMyLocation();
        // }
      }
    });
  }, []);

  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    if (!place || !place.geometry || !place.geometry.location) {
      const defaultCoords = initialCoordinates;
      const defaultAddress = initialAddress;
      //   onLocationChange(defaultCoords, defaultAddress);
      return;
    }

    const newAddress = extractAddress(place);
    console.log(newAddress, place);
    setAddress(newAddress.plain());

    const { lat, lng } = place.geometry.location;
    const latitude = lat();
    const longitude = lng();

    // onLocationChange({ latitude, longitude }, newAddress);
    // updateValue(newAddress.plain());
    setAddressObject(newAddress);
    setArea(newAddress.area);
    setLatitude(latitude);
    setLongitude(longitude);
    console.log(newAddress.state);
  };

  const extractAddress = (place) => {
    const address = {
      area: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      plain() {
        const area = this.area ? this.area + ", " : "";
        const city = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        return area + city + zip + state + this.country;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }

    let cityFallback = "";
    let areaFallback = "";

    place.address_components.forEach((component) => {
      const types = component.types;
      const value = component.long_name;

      if (
        types.includes("sublocality") ||
        types.includes("sublocality_level_1") ||
        types.includes("sublocality_level_2") ||
        types.includes("sublocality_level_3") ||
        types.includes("neighborhood") ||
        types.includes("colloquial_area") ||
        types.includes("political")
      ) {
        if (
          address.area === "" &&
          !types.includes("administrative_area_level_1")
        ) {
          address.area = value;
        }
      }

      if (
        types.includes("locality") ||
        types.includes("administrative_area_level_2")
      ) {
        if (address.city === "") {
          address.city = value;
        }
      }

      if (types.includes("administrative_area_level_1")) {
        address.state = value;
      }

      if (types.includes("postal_code")) {
        address.zip = value;
      }

      if (types.includes("country")) {
        address.country = value;
      }
    });

    // Apply fallbacks if necessary
    if (address.city === "" && cityFallback !== "") {
      address.city = cityFallback;
    }

    if (address.area === "" && areaFallback !== "") {
      address.area = areaFallback;
    }

    return address;
  };

  const handleInputChange = (selectedLocation) => {
    if (onChange) {
      onChange(selectedLocation); // Update the address in the form
    }
    if (searchInputRef.current) {
      const inputValue = searchInputRef.current.value;

      if (inputValue.trim() !== "") {
        const autoCompleteService =
          new window.google.maps.places.AutocompleteService();
        autoCompleteService.getPlacePredictions(
          {
            input: inputValue,
            componentRestrictions: { country: "IN" }, // Restrict predictions to India
          },
          (predictions) => {
            setSuggestions(
              predictions?.map((prediction) => prediction.description) || []
            );
          }
        );
      } else {
        setSuggestions([]);
      }
    }
  };

  return (
    <div className=''>
      <div className='client-details-form' style={{}}>
        {/* <input
          ref={searchInputRef}
          type='text'
          defaultValue={initialValue}
          className='ant-input'
          style={{
            padding: 10,
            border: "1px solid grey",
            width: "100%",
            borderRadius: 5,
            height: 40,
          }}
          placeholder='Search location....'
          onChange={(e) => handleInputChange(e.target.value)}
        /> */}

        {/* <TextField
            inputRef={searchInputRef} // Ref for the input
            type='text'
            defaultValue={initialValue} // Default value
            variant='outlined' // Styled similar to your original input
            placeholder='Search location....'
            onChange={(e) => handleInputChange(e.target.value)} // Triggering input change
            fullWidth // Ensures the input takes up the full width
            sx={{
              padding: 1, // Adjust padding similar to your original input
              border: "1px solid grey", // Custom border
              borderRadius: 1, // Border radius (5px equivalent)
              height: 40, // Setting the input height
            }}
            InputProps={{
              style: { height: 40 }, // Ensures consistent height inside the TextField
            }}
          /> */}
        <TextField
          inputRef={searchInputRef}
          value={initialValue}
          onChange={(e) => handleInputChange(e.target.value)}
          variant='outlined'
          // label='Address *'
          label={
            <div className='flex items-center text-primary hover:text-primary border-[#b11336]'>
              <FaLocationDot
                style={{ marginRight: 8, fontSize: 16, color: "gray" }}
              />{" "}
              <div className='text-[grey]'>Address</div>
            </div>
          }
          placeholder='Search location....'
          size='small'
          fullWidth
          disabled={disabledStatus === true}
          InputLabelProps={{
            shrink:
              Boolean(initialValue) || Boolean(searchInputRef.current?.value),
          }}
          InputProps={{
            style: { height: 40 }, // Ensures consistent height inside the TextField
          }}
        />
      </div>
    </div>
  );
};

export default LocationSearchMui;
