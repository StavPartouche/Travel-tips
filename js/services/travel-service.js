import { storageService } from './storage-service.js';



export const mapService = {
    getLocs,
    splitCoord,
    saveLocation,
    deleteLocation,
    getStringCoords,
    getWeather,
};

const LOC_KEY = 'locationsDB';
var gLocs = (storageService.LoadFromLocalStorage(LOC_KEY)) ? storageService.LoadFromLocalStorage(LOC_KEY) : [];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs);
        }, 100);
    });
}

function splitCoord(coordStr) {
    var latlngStr = coordStr.split(",", 2);
    var lat = parseFloat(latlngStr[0].substring(1));
    var lng = parseFloat(latlngStr[1]);
    return [lat, lng];
}

function saveLocation(lat, lng, name) {
    const locObj = { lat, lng, name, id: generateID(), createdAt: Date.now() };
    gLocs.push(locObj);
    storageService.saveToLocalStorage(LOC_KEY, gLocs);
}

function deleteLocation(id) {
    const currLocIdx = gLocs.findIndex(loc => loc.id === id);
    gLocs.splice(currLocIdx, 1);
    storageService.saveToLocalStorage(LOC_KEY, gLocs);
}

function generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getStringCoords(str) {
    var newStr = str.split(' ').join('+');
    return Promise.resolve(axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${newStr}&key=AIzaSyDnYKkDmrXVOTwEesvKZsshzGBSx7GmY4c`)
        .then(res => res.data.results[0].geometry.location))
        .catch(console.log('Oops! No locations found!'));
}

function getWeather(lat, lng) {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=101ac678798cc9cfe82700a564f2661c`)
        .then(res => console.log(res.data))
}




