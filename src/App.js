import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import 'tachyons';
import ParticlesBg from 'particles-bg'
import { useState, useEffect } from 'react';
window.process = {};

const PAT = '6108568d609340738c81ac330d87fd19';
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin")
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''

  })

  const loadUser = (data) => {
  setUser({
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined

  })
}

  // functional equivalent of componentDidMount
  useEffect(() => {
    fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(console.log)
  })

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data?.outputs[0]?.data?.regions[0]?.region_info?.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onButtonSubmit = () => {
    let IMAGE_URL = input;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    setImageUrl(input);
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result && result.code === 10000) {
          console.log("result: ", result)
          fetch("http://localhost:3000/image", {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    id: user.id
                }
            )
          })
            .then(response => response.json())
            .then(count => {
              setUser({
                id: user.id,
                name: user.name,
                email: user.email,
                entries: count,
                joined: user.joined
              })
              console.log(user)
            })
        }
        displayFaceBox(calculateFaceLocation(result))})
      .catch(error => console.log('error', error));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false)
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === 'home'
        ? <div >
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit} />
            <ParticlesBg type="cobweb" bg={true} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
        : (
          route === 'register' 
          ? <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          : <Signin loadUser={loadUser}  onRouteChange={onRouteChange} />
        )

      }
    </div>
  );
}

export default App;
