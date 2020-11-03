import React from 'react';
import { geoMercator, geoPath, scaleSequential,interpolateRdYlGn, extent } from 'd3';
import _ from 'lodash';



export const Map = ({geometry, width, height, data}) => {
const projection = geoMercator().scale(1350).translate([width/2, height/2]).center([73,19.7]);
const path = geoPath(projection);


// colorScale

let color_range = _.map(data, d =>{
  return +d.data_value
});
const colorScale = scaleSequential(interpolateRdYlGn).domain(extent(color_range))

//merge geometry and data

function addProperties(geojson,data){

  let newArr = _.map(data, function(item) {
    return {
      areacode: item.area.area_code,
      areaname: item.area.area_name,
      dataValue: parseFloat(item.data_value),
    }
  });
 
  let mergedGeoJson = _(newArr)
    .keyBy('areacode')
    .merge(_.keyBy(geojson, 'properties.ID_'))
    .values()
    .value();
    
    return mergedGeoJson;
}

let mergedGeometry = addProperties(geometry,data);
console.log(mergedGeometry)


const polygons = mergedGeometry.map((d,i) => <path key={"path"+i} d={path(d)}
style = {{ fill:colorScale(d.dataValue) ,stroke:"black",strokeOpacity:0.5}}
/>)


return ( 
	<g className="map">
    { polygons }
  </g>
)};
