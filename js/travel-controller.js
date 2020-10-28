import { mapService } from './services/travel-service.js';

var gMap;
var gMarkers = [];
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs));

window.onload = () => {

    mapService.getLocs()
        .then(renderLocations);

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
    var inputVal = (document.querySelector('.main-input').value) ? document.querySelector('.main-input').value : 'no where';
    document.querySelector('.location-name span').innerText = inputVal;
    getStringCoords(inputVal)
        .then(res => {
            mapService.saveLocation(res.lat, res.lng, inputVal);
            return panTo(res.lat, res.lng);
        })
        .then(addMarker)
        .catch(console.log('INIT MAP ERROR'));

    mapService.getLocs()
        .then(renderLocations);
});

document.querySelector('.my-location').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.location-name span').innerText = 'Your Location';
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
                var latLng = mapsMouseEvent.latLng.toString();
                var coords = mapService.splitCoord(latLng);
                addMarker({ lat: coords[0], lng: coords[1] });
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

function getStringCoords(str) {
    var newStr = str.split(' ').join('+');
    return Promise.resolve(axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${newStr}&key=AIzaSyDnYKkDmrXVOTwEesvKZsshzGBSx7GmY4c`)
        .then(res => res.data.results[0].geometry.location))
        .catch(console.log('Oops! No locations found!'));
}

function getWeather(lat, lng){
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=101ac678798cc9cfe82700a564f2661c`)
}

function renderLocations(locations) {
    const elTbody = document.querySelector('.location-body');
    const strHtmls = locations.map((location, idx) => `<tr>
<td>${idx + 1}</td>
<td>${location.name}</td>
<td data-id="${location.id}" class="delete-btn">X</td>
</tr>`).join('');

    elTbody.innerHTML = strHtmls;

    document.querySelectorAll('.delete-btn').forEach(button =>
        button.addEventListener('click', (ev) => {
            console.log(ev.target.dataset.id)
            
        })
    );
}



