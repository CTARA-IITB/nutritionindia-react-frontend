import React from 'react';
import { geoMercator, geoPath } from 'd3';



export const Map = ({geometry, width, height, data}) => {
const projection = geoMercator().scale(1350).translate([width/2, height/2]).center([73,19.7]);
const path = geoPath(projection);
//zoomToBoundingBox
const zoomToBoundingBox = d => {
let bounds = path.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
    translate = [width / 2 - scale * x, height / 2 - scale * y];
  // svg.transition().duration(transitionDuration).call(
  // zzoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale)
  // ); 
}
zoomToBoundingBox(geometry);  

return ( 
	<g className="map">
    {
    	geometry.map(feature =>{
        return <path key = {feature.properties['ID_']}d= {path(feature)}/>
      })
    }
  </g>
)};
