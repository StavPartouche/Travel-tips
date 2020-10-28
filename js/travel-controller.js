import { mapService } from './services/travel-service.js';

var gMap;
var gMarkers = [];
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs));

window.onload = () => {
    getPosition()
        .then(res => initMap(res.coords.latitude, res.coords.longitude))
        .catch(err => {
            console.log('err!!!', err);
        })
        .then(addMarker)
        .catch(console.log('INIT MAP ERROR'));
};

document.querySelector('.go-location').addEventListener('click', (ev) => {
    ev.preventDefault();
    console.log('Aha!', ev.target);
    panTo(35.6895, 139.6917)
        .then(addMarker)
        .catch(console.log('INIT MAP ERROR'));
});

document.querySelector('.my-location').addEventListener('click', (ev) => {
    ev.preventDefault();
    getPosition()
        .then(res => initMap(res.coords.latitude, res.coords.longitude))
        .catch(err => {
            console.log('err!!!', err);
        })
        .then(addMarker)
        .catch(console.log('INIT MAP ERROR'));
});

export function initMap(lat, lng) {
    console.log(lat, lng);
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });
            gMap.addListener('click', function (mapsMouseEvent) {
                console.log(mapsMouseEvent);
                var latLng = mapsMouseEvent.latLng.toString()
                var coords = mapService.splitCoord(latLng)
                console.log(coords);
            });
            console.log('Map!', gMap);
            return { lat, lng };
        });
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });

    gMarkers.push(marker);
    return marker;
}

function clearMarkers() {
    setMapOnAll(null);
}

function setMapOnAll(gMap) {
    for (let i = 0; i < gMarkers.length; i++) {
        gMarkers[i].setMap(gMap);
    }
}

function deleteMarkers() {
    gMarkers = [];
    clearMarkers();
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
    return Promise.resolve({ lat, lng });
}

function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyDnYKkDmrXVOTwEesvKZsshzGBSx7GmY4c';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

// function splitCoord(coordStr) {
//     var latlngStr = coordStr.split(",", 2);
//     var lat = parseFloat(latlngStr[0].substring(1));
//     var lng = parseFloat(latlngStr[1]);
//     return [lat, lng]
// }




