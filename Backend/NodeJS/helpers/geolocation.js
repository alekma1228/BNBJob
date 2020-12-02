var geo = require('node-geo-distance');

// coord1 = {
//     latitude: 38.8977330,
//     longitude: -77.0365310
// }

// coord2 = {
//     latitude: 38.8894840,
//     longitude: -77.0352790
// }

// geo.vincenty(coord1, coord2, function(dist) {
//   console.log(dist);
// });

// var vincentyDist = geo.vincentySync(coord1, coord2);

// geo.haversine(coord1, coord2, function(dist) {
//   console.log(dist);
// });

// var haversineDist = geo.haversineSync(coord1, coord2);

module.exports.distance = function(coord1, coord2) {    
    var dist = geo.vincentySync(coord1, coord2);    
    return dist
}