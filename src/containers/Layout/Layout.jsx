import React,{useState,useEffect} from "react";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';


// import Form from "../../components/Form/Form";
import { Marks } from "../../components/Marks/Marks";
import { Map } from "../../components/Map/Map";
import { useData , useDataDistrict } from '../../containers/UseData'
import { json } from 'd3';
import { TreeSelect } from 'antd';

import "./Layout.css";

const width = "900";
const height = "900";


const renderedMap = (boundaries) => (boundaries.state);


const createHierarchy = (options) =>{
  let india = new Array(); 
  let state = new Array(); 
  let district = {};

  options.forEach(area => {
    let area_id = area.area_id.toString();
    let level = area.area_level;
    let parent_id = area.area_parent_id;
    let area_name = area.area_name;
    let temp = {'value':area_id,'title':area_name};

    if(level === 1){
      india.push(temp);
    }else if(level === 2){
      state.push(temp)
    }else if(level === 3){
      if(parent_id in district){
        district[parent_id].push(temp);
      }else{
        district[parent_id] = [temp];
      }
    }
  })

  //adding subs to state
  for(const i in state){
    let stateInfo = state[i];
    stateInfo['children'] = district[stateInfo.value];
  }

  //adding subs to india
  india[0]['children'] = state;

  return india;
}
const Layout = ({tabId}) => {

  let tab;
    if(tabId === undefined)
    {
      tab =8;
    }
    else{
      tab=tabId;
    }
  //Area
  const iniSelArea = '1';  //india
  const [selArea,setSelArea] = useState(iniSelArea);
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  
  useEffect(() => {
    const url = 'http://localhost:8000/api/area';
    json(url).then( options =>{
      setAreaDropdownOpt(createHierarchy(options));
    }
    )
  }, [])

  //Indicator
  const iniSelIndicator = '12';  
  const [selIndicator,setSelIndicator] = useState(iniSelIndicator);
  const [indicatorDropdownOpt, setIndicatorDropdownOpt] = useState(null);

  useEffect(() => {
    const url = 'http://localhost:8000/api/indicator/'+tab;
    json(url).then( options =>{
      setIndicatorDropdownOpt(options);
    }
    )
  }, [tabId])

   // change selIndicator when indicator updated
   useEffect(() => {
    if(indicatorDropdownOpt){
      setSelIndicator(indicatorDropdownOpt[0].value)
    }
   
    }, [indicatorDropdownOpt])

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
  const Dboundaries=useDataDistrict();

  
const handleClick=()=>{
  setToggleState(!toggleState);
  let text=null;
  if(buttonText==='District')
    text='state';
  else
    text='District';
  changeText(text);
  }
  const [buttonText, setButtonText] = useState("District");
  const changeText = (text) => setButtonText(text);
  const [toggleState,setToggleState] = useState(true)
  if(!boundaries || !areaDropdownOpt || !subgroupDropdownOpt || !indicatorDropdownOpt || !timeperiodDropdownOpt){
  	return <pre>Loading...</pre>
  }
 
  let renderMap=null;

if(toggleState===true)
  renderMap = renderedMap(boundaries);
else
  renderMap = renderedMap(Dboundaries);

    return (
      <React.Fragment>
        <div className="grid-container">
          {/* <div className="grid-item">header</div> */}
          <div className="grid-item">
            
      <TreeSelect
        style={{ width: '20%' }}
        value={selArea}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={areaDropdownOpt}
        // treeDefaultExpandAll
        onChange={ value =>  setSelArea(value) }
      />

      <TreeSelect
        style={{ width: '20%' }}
        value={selIndicator}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={indicatorDropdownOpt}
        onChange={ value => setSelIndicator(value) }
        />

      <TreeSelect
        style={{ width: '20%' }}
        value={selSubgroup}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={subgroupDropdownOpt}
        onChange={ value => setSelSubgroup(value)}
        />

      <TreeSelect
        style={{ width: '20%' }}
        value={selTimeperiod}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={timeperiodDropdownOpt}
        onChange={value => setSelTimeperiod(value) }
        />

          <button onClick={handleClick}> {buttonText} </button>

          </div>
          <div className="grid-item" id='map-div'>
    	        {/* <Marks data={renderMap} width={width} height={height} onMapClick={setArea}/> */}
              <Map geometry={renderMap} width={width} height={height} data = {selIndiaData} />

          </div>
          {/* <div className="grid-item">footer</div> */}

        </div>
      </React.Fragment>
    );
}

export default Layout;