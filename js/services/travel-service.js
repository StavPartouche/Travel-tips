import { storageService } from './storage-service.js';



export const mapService = {
    getLocs,
    splitCoord,
    saveLocation,
    deleteLocation
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



