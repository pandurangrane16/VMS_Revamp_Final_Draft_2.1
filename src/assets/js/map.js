var map_init = L.map('map',{
    center:[ 19.1570343, 72.9327444],
    zoom:13
});
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_init);
var marker = L.marker([9.0820, 8.6753]).addTo(map_init);
var Basemaps = {
    "OSM": osm
}
var Overlaymaps = {
    "Marker": marker
}
L.control.layers(Basemaps, Overlaymaps).addTo(map_init);