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

const renderedMap = (boundaries,area) =>{
  if(area === 'india')
  	return boundaries.state.features;
  else{
  	 return boundaries.dist.features.filter(d => d.properties.NAME2_ === area);
  }
}

const Layout = () => {

  const iniArea = 'india';
	const [area,setArea] = useState(iniArea);
  const [selData,setSelData] = useState();
  const [areaDropdownOpt, setAreaDropdownOpt] = useState(null);
  
  const boundaries = useData(area);
  
  useEffect(() => {
    const url = 'http://localhost:8000/api/areaList/';
    json(url).then( options =>{
      setAreaDropdownOpt(options);
    }
    )
  }, [])
  
  if(!boundaries){
  	return <pre>Loading...</pre>
  }

  if(!areaDropdownOpt){
  	return <pre>Loading...</pre>
  }
  let renderMap = renderedMap(boundaries,area);
  
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
          <Dropdown options={areaDropdownOpt}  value={defaultOption} placeholder="Select an option" />
          <Dropdown options={options}  value={defaultOption} placeholder="Select an option" />

            
          </div>
          <div className="grid-item">
     
          <svg width={width} height={height}>
    	<Marks data={renderMap} width={width} height={height} onMapClick={setArea}/>
    </svg>
          <Map/>
          </div>
          {/* <div className="grid-item">footer</div> */}

        </div>
      </React.Fragment>
    );
}

export default Layout;