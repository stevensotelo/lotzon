var MAPS = MAPS || {};

// Vars
MAPS.vars = {
    map: null,
    geocoder: null,
    centerPoint: null,
    option: null,
    div: "",
    markets: [],
    rectangles: [],
    info: [],
    grandient : [],
    pathIcons: '/static/home/images/icons/',
    layerPoints: [],
    layerHeatMap: null,
};

// General functions about of google maps
MAPS.tools = {
    init: function (div) {
        MAPS.vars.div = div;        
        MAPS.vars.geocoder = new google.maps.Geocoder();
        MAPS.vars.centerPoint = new google.maps.LatLng(0, 0);
        MAPS.vars.options = { zoom: 2, center: MAPS.vars.centerPoint, mapTypeId: google.maps.MapTypeId.TERRAIN };
        MAPS.vars.map = new google.maps.Map(document.getElementById(MAPS.vars.div), MAPS.vars.options);
    },
    error: function (message, object) {
        console.log(message);
        console.log(object);
    },
    coordenates2Location: function (longitude, latitude) {        
        //return new google.maps.LatLng(latitude.replace(",", "."), longitude.replace(",", "."));
        return new google.maps.LatLng(latitude, longitude);
    },
    centerMap: function (location) {
        MAPS.vars.centerPoint = location;
        MAPS.vars.map.setCenter(MAPS.vars.centerPoint);
    },
    generateGradient: function(count){
        var color = '104020';
        for (i = 0; i <count; i++) 
            MAPS.vars.grandient.push(MAPS.tools.addHexColor(color, '010201'));
        
    },
    addHexColor: function (c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 6) { hexStr = '0' + hexStr; }
        return hexStr;
    }
};

MAPS.points = {
    addMarket: function (location) {
        MAPS.points.addMarketWithTitle(location,'');
    },
    addMarketWithTitle: function (location, title) {
        MAPS.vars.markets.push(new google.maps.Marker({
            map: MAPS.vars.map,
            position: location,
            title:title
        }));
    },
    addMarketWithTitleImage: function (location, title, image) {        
        MAPS.vars.markets.push(new google.maps.Marker({
            map: MAPS.vars.map,
            position: location,
            title:title,
            icon:image
        }));
    },
    clearMarket: function () {
        for (var i = 0; i < MAPS.vars.markets.length; i++) 
            MAPS.vars.markets[i].setMap(null);
        MAPS.vars.markets = [];
    },
    centerMapWithMark: function (location) {
        MAPS.tools.centerMap(location);
        MAPS.points.addMarket(MAPS.vars.centerPoint);
    },
    addInfoWindow: function (marker, message) {
        MAPS.vars.info[marker] = new google.maps.InfoWindow({ content: message });
        google.maps.event.addListener(MAPS.vars.markets[marker], 'click', function () {
            if(MAPS.vars.markets[marker].getAnimation() == null)
            {
                MAPS.vars.info[marker].open(MAPS.vars.map, MAPS.vars.markets[marker]);
                MAPS.vars.markets[marker].setAnimation(google.maps.Animation.BOUNCE);
            }
            else
            {
                MAPS.vars.info[marker].close();
                MAPS.vars.markets[marker].setAnimation(null);
            }
            /*MAPS.vars.info[marker].open(MAPS.vars.map, MAPS.vars.markets[marker]);
            MAPS.vars.markets[marker].setAnimation(MAPS.vars.markets[marker].getAnimation() != null ? null : google.maps.Animation.BOUNCE);*/
            
        });
    },    
    addMarketWithInfoWindow: function (location, message) {
        MAPS.points.addMarket(location);        
        MAPS.points.addInfoWindow(MAPS.vars.markets.length - 1, message);
    },
    addMarketWithInfoWindowTitle: function (location, message, title) {
        MAPS.points.addMarketWithTitle(location,title);        
        MAPS.points.addInfoWindow(MAPS.vars.markets.length - 1, message);
    },
    addMarketWithInfoWindowTitleImage: function (location, message, title, image) {
        MAPS.points.addMarketWithTitleImage(location,title,image);        
        MAPS.points.addInfoWindow(MAPS.vars.markets.length - 1, message);
    }
};

MAPS.layer = {
    addPoint: function (location) {
        MAPS.vars.layerPoints.push(location);
    },
    setLayer:function(){
        //MAPS.vars.layerHeatMap = new google.maps.visualization.HeatmapLayer({ data: MAPS.vars.layerPoints });
        MAPS.vars.layerHeatMap = new google.maps.visualization.HeatmapLayer({ data: new google.maps.MVCArray(MAPS.vars.layerPoints) });
        MAPS.vars.layerHeatMap.setMap(MAPS.vars.map);
        MAPS.vars.layerHeatMap.set('radius',20);
        MAPS.vars.layerHeatMap.set('dissipating',true);
    }
};

MAPS.draw = {
    addRentangle : function (locationStart, locationEnd, value){
        MAPS.vars.rectangles.push(new google.maps.Rectangle({
                    strokeColor: '#' + MAPS.vars.grandient[value],
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#' + MAPS.vars.grandient[value],
                    fillOpacity: 0.35,
                    map: MAPS.vars.map,
                    bounds: new google.maps.LatLngBounds(locationStart,locationEnd)
                }));
    },
    clearLayer : function(){
        for (var i = 0; i < MAPS.vars.rectangles.length; i++) 
            MAPS.vars.rectangles[i].setMap(null);
        MAPS.vars.rectangles = [];
    }
};

MAPS.search = {    
    searchAddress: function (address) {
        MAPS.vars.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK)
                return results;
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
    }
};
