import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";

import withModal from "../common/Modal";
import RequestRide from "../request-ride/RequestRide";

import Context from "../../context";

const AddressPicker = ({ toggleModal }) => {
  const [isFrom, setIsFrom] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const { selectedFrom, setSelectedFrom, selectedTo, setSelectedTo } =
    useContext(Context);

  const provider = useRef();
  const searchRef = useRef();

  useEffect(() => {
    initProvider();
  }, []);

  const shouldRequestDriver = useCallback(() => {
    if (selectedFrom && selectedTo) {
      toggleModal(true);
    }
  }, [selectedFrom, selectedTo, toggleModal]);

  useEffect(() => {
    if (selectedFrom && selectedTo) {
      shouldRequestDriver();
    }
  }, [selectedFrom, selectedTo, shouldRequestDriver]);

  const onInputChanged = (e) => {
    const input = e.target.value;
    provider.current.search({ query: input }).then((results) => {
      setSearchResults(() => results);
    });
  };

  const initProvider = () => {
    provider.current = new OpenStreetMapProvider({
      params: {
        "accept-language": "en",
        countrycodes: "us",
      },
    });
  };

  const onLocationSelected = (selectedLocation) => {
    if (selectedLocation?.label && selectedLocation?.x && selectedLocation?.y) {
      if (isFrom) {
        setSelectedFrom(() => selectedLocation);
        setIsFrom(() => false);
      } else {
        setSelectedTo(() => selectedLocation);
        setIsFrom(() => true);
      }
      setSearchResults(() => []);
      searchRef.current.value = "";
    }
  };

  return (
    <div className="address">
      <div className="address__title">
        <div className="address__title-container">
          <p className="address__title-from" onClick={() => setIsFrom(true)}>
            {selectedFrom && selectedFrom.label
              ? selectedFrom.label
              : "Pickup location ?"}
          </p>
          <p className="address__title-to" onClick={() => setIsFrom(false)}>
            {selectedTo && selectedTo.label
              ? selectedTo.label
              : "Destination ?"}
          </p>
        </div>
      </div>
      <div className="search">
        <input
          className="search__input"
          type="text"
          placeholder={
            isFrom ? "Add a pickup location" : "Enter your destination"
          }
          onChange={onInputChanged}
          ref={searchRef}
        />
        <div className="search__result">
          {searchResults &&
            searchResults.length !== 0 &&
            searchResults.map((result, index) => (
              <div
                className="search__result-item"
                key={index}
                onClick={() => onLocationSelected(result)}
              >
                <div className="search__result-icon">
                  <svg
                    title="LocationMarkerFilled"
                    viewBox="0 0 24 24"
                    className="g2 ec db"
                  >
                    <g transform="matrix( 1 0 0 1 2.524993896484375 1.0250244140625 )">
                      <path
                        fillRule="nonzero"
                        clipRule="nonzero"
                        d="M16.175 2.775C12.475 -0.925 6.475 -0.925 2.775 2.775C-0.925 6.475 -0.925 12.575 2.775 16.275L9.475 22.975L16.175 16.175C19.875 12.575 19.875 6.475 16.175 2.775ZM9.475 11.475C8.375 11.475 7.475 10.575 7.475 9.475C7.475 8.375 8.375 7.475 9.475 7.475C10.575 7.475 11.475 8.375 11.475 9.475C11.475 10.575 10.575 11.475 9.475 11.475Z"
                        opacity="1"
                      ></path>
                    </g>
                  </svg>
                </div>
                <p className="search__result-label">{result.label}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default withModal(RequestRide)(AddressPicker);
