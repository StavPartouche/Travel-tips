export const mapService = {
    getLocs: getLocs,
    splitCoord
}
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function splitCoord(coordStr) {
    var latlngStr = coordStr.split(",", 2);
    var lat = parseFloat(latlngStr[0].substring(1));
    var lng = parseFloat(latlngStr[1]);
    return [lat, lng]
}

