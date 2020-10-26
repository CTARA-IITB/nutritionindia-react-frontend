import React,{useState,useEffect} from "react";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';


// import Form from "../../components/Form/Form";
import { Marks } from "../../components/Marks/Marks";
import { Map } from "../../components/Map/Map";
import { useData } from '../../containers/UseData'
import { json } from 'd3';

import "./Layout.css";

const width = window.innerWidth;
const height = window.innerHeight;

const renderedMap = (boundaries) => (boundaries.state.features);
  
const Layout = () => {
  //Area
  const iniSelArea = '1';  //india
  const [selArea,setSelArea] = useState(iniSelArea);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  
  useEffect(() => {
    const url = 'http://localhost:8000/api/area';
    json(url).then( options =>{
      setAreaDropdownOpt(options);
    }
    )
  }, [])

  //Indicator
  const iniSelIndicator = '12';  //india
  const [selIndicator,setSelIndicator] = useState(iniSelIndicator);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState(null);


  useEffect(() => {
    const url = 'http://localhost:8000/api/indicator';
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    }
    )
  }, [])


    //subgroup
    const iniSelSubgroup = '6';  //All
    const [selSubgroup,setSelSubgroup] = useState(iniSelSubgroup);
    const [subgroupDropdownOpt, setSubgroupDropdownOpt] = useState(null);
  
  
    useEffect(() => {
      const url = `http://localhost:8000/api/subgroup/${selIndicator}`;
      json(url).then( options =>{
        setSubgroupDropdownOpt(options);
      }
      )
    }, [selIndicator])


    //timeperiod
    const iniSelTimeperiod = '21';  //CNNS 2016-2018
    const [selTimeperiod,setSelTimeperiod] = useState(iniSelTimeperiod);
    const [timeperiodDropdownOpt, setTimeperiodDropdownOpt] = useState(null);
  
  
    useEffect(() => {
      const url = `http://localhost:8000/api/timeperiod/${selIndicator}/${selSubgroup}/${selArea}`;
      json(url).then( options =>{
        setTimeperiodDropdownOpt(options);
      }
      )

    }, [selIndicator,selSubgroup,selArea])



    //india data
    const [selIndiaData,setSelIndiaData] = useState(null);
  
    useEffect(() => {
      const url = `http://localhost:8000/api/indiaMap/${selIndicator}/${selSubgroup}/${selTimeperiod}/2`;
      json(url).then( data =>{
        setSelIndiaData(data);
      }
      )

    }, [selIndicator,selSubgroup,selTimeperiod])


    // change selTimeperiod when indicator updated
    useEffect(() => {
    let flag = false;
    if(timeperiodDropdownOpt){
      timeperiodDropdownOpt.forEach(timeperiod => {
        if(timeperiod.value === selTimeperiod){
          flag = true;
        }
      });
      if(!flag) setSelTimeperiod(timeperiodDropdownOpt[0].value)
    }
   
    }, [timeperiodDropdownOpt])

  const boundaries = useData();

  
  if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt){
  	return <pre>Loading...</pre>
  }
 
  let renderMap = renderedMap(boundaries);
  
    return (
      <React.Fragment>
        <div className="grid-container">
          {/* <div className="grid-item">header</div> */}
          <div className="grid-item">
          <Dropdown
          options={areaDropdownOpt}
          value={selArea}
          onChange={({ value }) => setSelArea(value)}
        />
        <Dropdown
          options={indicatorDropdownOpt}
          value={selIndicator}
          onChange={({ value }) => {
            setSelIndicator(value);
          }
          }
        />
        <Dropdown
          options={subgroupDropdownOpt}
          value={selSubgroup}
          onChange={({ value }) => setSelSubgroup(value)}
        />
        <Dropdown
          options={timeperiodDropdownOpt}
          value={selTimeperiod}
          onChange={({ value }) => setSelTimeperiod(value)}
        />

          </div>
          <div className="grid-item" id='map-div'>
            <svg width={width} height={height}>
    	        {/* <Marks data={renderMap} width={width} height={height} onMapClick={setArea}/> */}
              <Map geometry={renderMap} width={width} height={height} data = {selIndiaData} />

            </svg>
          </div>
          {/* <div className="grid-item">footer</div> */}

        </div>
      </React.Fragment>
    );
}

export default Layout;