import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className="ma4 mt0" style={{display: 'flex', justifyContent: 'center'}} >
      <Tilt className="Tilt br2 shadow-2" options={{ max: 15 }} style={{ height: 150, width: 150}} >
        <img style={{paddingTop: '20px'}} alt='logo' src={brain} />
      </Tilt>

      {/* <Tilt>
        <div style={{ height: '200px', width: '400px', backgroundColor: 'darkgreen' }}>
          <h1>React Parallax Tilt 👀</h1>
        </div>
      </Tilt> */}
    </div>
  );
}

export default Logo;