var MAPS = MAPS || {};

// Vars
MAPS.vars = {
    map: null,
    geocoder: null,
    centerPoint: null,
    option: null,
    div: "",
    markets: [],
    current: null,
    info: []
};

// General functions about of google maps
MAPS.tools = {
    init: function (div) {
        MAPS.vars.geocoder = new google.maps.Geocoder();
        MAPS.vars.centerPoint = new google.maps.LatLng(0, 0);
        MAPS.vars.options = { zoom: 8, center: MAPS.vars.centerPoint };
        MAPS.vars.div = div;
        MAPS.vars.map = new google.maps.Map(document.getElementById(div), MAPS.vars.options);
    },
    error: function (message, object) {
        object = null;
    },
    fromCoordenatesToPosition: function (longitude, latitude) {        
        return new google.maps.LatLng(latitude.replace(",", "."), longitude.replace(",", "."));
    },
    centerMap: function (location) {
        MAPS.vars.centerPoint = location;
        MAPS.vars.map.setCenter(MAPS.vars.centerPoint);
    },
    addMarket: function (position) {
        MAPS.vars.markets.push(new google.maps.Marker({
            map: MAPS.vars.map,
            position: position
        }));
    },
    clearMarket: function () {
        for (var i = 0; i < MAPS.vars.markets.length; i++) 
            MAPS.vars.markets[i].setMap(null);
    },
    centerMapWithMark: function (location) {
        MAPS.tools.centerMap(location);
        MAPS.tools.addMarket(MAPS.vars.centerPoint);
    },
    getCurrent: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                MAPS.vars.current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            }, function () {
                MAPS.tools.error('No se logro ubicar su punto actual', MAPS.vars.current);
            });
        }
        else
            MAPS.tools.error('Su navegador no soporta ubicación', MAPS.vars.current);
    },
    getCurrentCenter: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                MAPS.vars.current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                MAPS.tools.centerMap(MAPS.vars.current);
            }, function () {
                MAPS.tools.error('No se logro ubicar su punto actual', MAPS.vars.current);
            });
        }
        else
            MAPS.tools.error('Su navegador no soporta ubicación', MAPS.vars.current);
    },
    getCurrentCenterMarket: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                MAPS.vars.current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                MAPS.tools.centerMapWithMark(MAPS.vars.current);
            }, function () {
                MAPS.tools.error('No se logro ubicar su punto actual', MAPS.vars.current);
            });
        }
        else
            MAPS.tools.error('Su navegador no soporta ubicación', MAPS.vars.current);
    },
    getCurrentCenterMarketFunction: function (functionName) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                MAPS.vars.current = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                MAPS.tools.centerMapWithMark(MAPS.vars.current);
                functionName(MAPS.vars.current);
            }, function () {
                MAPS.tools.error('No se logro ubicar su punto actual', MAPS.vars.current);
            });
        }
        else
            MAPS.tools.error('Su navegador no soporta ubicación', MAPS.vars.current);
    },
    searchAddress: function (address) {
        MAPS.vars.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK)
                return results;//results[0].geometry.location;
            else
                return null;
        });
    },
    searchAddressCenterMarket: function (address) {
        MAPS.vars.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK)
                MAPS.tools.centerMapWithMark(results[0].geometry.location);
        });
            
    },
    searchAddressCenterMarketFunction: function (address,functionName) {
        MAPS.vars.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                MAPS.tools.centerMapWithMark(results[0].geometry.location);
                functionName(results[0].geometry.location);
            }

        });

    },
    addInfoWindow: function (marker, message) {
        MAPS.vars.info[marker] = new google.maps.InfoWindow({ content: message });
        google.maps.event.addListener(MAPS.vars.markets[marker], 'click', function () {
            MAPS.vars.info[marker].open(MAPS.vars.map, MAPS.vars.markets[marker]);
        });
    },
    addMarketWithInfoWindow: function (location, message) {
        MAPS.tools.addMarket(location);        
        MAPS.tools.addInfoWindow(MAPS.vars.markets.length - 1, message);
    },
    getAddressFromLatLonFunction: function (location,functionName) {
        MAPS.vars.geocoder.geocode({ 'latLng': location }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0])
                    functionName(results[0].formatted_address);
            }

        });
    }
};