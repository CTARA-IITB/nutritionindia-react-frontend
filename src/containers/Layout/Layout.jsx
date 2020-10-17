import React,{useState} from "react";
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';


// import Form from "../../components/Form/Form";
import { Marks } from "../../components/Marks/Marks";
import { useData } from '../../containers/UseData'

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
  
  const boundaries = useData(area);
  if(!boundaries){
  	return <pre>Loading...</pre>
  }
  let renderMap = renderedMap(boundaries,area);
  
  
  const options = [
    'one', 'two', 'three'
  ];
  const defaultOption = options[0];

    return (
      <React.Fragment>
        <div className="grid-container">
          {/* <div className="grid-item">header</div> */}
          <div className="grid-item">
          <Dropdown options={options}  value={defaultOption} placeholder="Select an option" />
          <Dropdown options={options}  value={defaultOption} placeholder="Select an option" />

            
          </div>
          <div className="grid-item">
     
          <svg width={width} height={height}>
    	<Marks data={renderMap} width={width} height={height} onMapClick={setArea}/>
    </svg>
          </div>
          {/* <div className="grid-item">footer</div> */}

        </div>
      </React.Fragment>
    );
}

export default Layout;