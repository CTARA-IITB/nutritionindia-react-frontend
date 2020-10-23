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

  const iniSelArea = '1';  //india
  const [selArea,setSelArea] = useState(iniSelArea);
  
  console.log(selArea);

  const [selData,setSelData] = useState();
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  const boundaries = useData();
  
  useEffect(() => {
    const url = 'http://localhost:8000/api/area';
    json(url).then( options =>{
      setAreaDropdownOpt(options);
    }
    )
  }, [])
  
  if(!boundaries || !areaDropdownOpt){
  	return <pre>Loading...</pre>
  }

  // if(!areaDropdownOpt){
  // 	return <pre>Loading...</pre>
  // }
  let renderMap = renderedMap(boundaries);
  
  const options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two', className: 'myOptionClassName' },
    {
     type: 'group', name: 'group1', items: [
       { value: 'three', label: 'Three', className: 'myOptionClassName' },
       { value: 'four', label: 'Four' }
     ]
    },
    {
     type: 'group', name: 'group2', items: [
       { value: 'five', label: 'Five' },
       { value: 'six', label: 'Six' }
     ]
    }
  ];
  const defaultOption = areaDropdownOpt[0].label;

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

          </div>
          <div className="grid-item" id='map-div'>
     
            <svg width={width} height={height}>
    	        {/* <Marks data={renderMap} width={width} height={height} onMapClick={setArea}/> */}
              <Map data={renderMap} width={width} height={height}/>

            </svg>
          </div>
          {/* <div className="grid-item">footer</div> */}

        </div>
      </React.Fragment>
    );
}

export default Layout;