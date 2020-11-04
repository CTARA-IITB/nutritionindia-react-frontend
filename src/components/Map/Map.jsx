import React,{useRef,useEffect} from 'react';
import { geoMercator, geoPath, scaleSequential,interpolateRdYlGn, min,max,extent,select } from 'd3';
import _ from 'lodash';

import "./Map.css";



export const Map = ({geometry, width, height, data}) =>{


const svgRef = useRef();
const wrapperRef = useRef();

// colorScale


// const colorScale = scaleSequential(interpolateRdYlGn).domain()

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



useEffect(() => {
  const svg = select(svgRef.current);
  const projection = geoMercator().scale(1110).translate([width/2, height/2]).center([73,19.7]);
  const pathGenerator = geoPath(projection);
  let mergedGeometry = addProperties(geometry,data);
  let c1Value  = d => d.data_value;
  let c2Value  = d => d.dataValue;
  
  let color_range = _.map(data, d =>{
    return +d.data_value
  });
  let [min,max] = extent(color_range);
  let comp = (max - min)/3;
  let low = min + comp;
  let high = max - comp;


  let colorScale = (v) =>{
    if (typeof v != "undefined") {
        let selectedColor;
          if (v < low) {selectedColor =  "#24562B";}//matte green
          else if (v >= low && v <= high) {selectedColor =  "#FFE338";}//matte yellow
          else if (v > high) {selectedColor =  "#B2022F";} //matte red
        return selectedColor;
    }
    else {
      return "#A9A9B0";
    }
  };

  svg
    .selectAll(".polygon")
    .data(mergedGeometry)
    .join("path").attr("class", "polygon")
    .attr("d" ,feature => pathGenerator(feature))
    .style("fill", d =>colorScale(c2Value(d)))
    .on("mouseclick", d =>{
      console.log(d)
    });
}, [geometry,width,height,data])



return ( 
<div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
  <svg ref={svgRef}></svg>
</div>
)};
