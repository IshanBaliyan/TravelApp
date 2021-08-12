
import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/register/Register";
import Login from "./components/login/Login";


function App() {
  const myStorage = window.localStorage;

  // Tries to log in as previously logged in user from storage. If not possible, then sets as null and goes to normal page with sign up settings.
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setcurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect(()=>{
    const getPins = async ()=>{
      try{
        const res = await axios.get("http://travel-pin-map-app.herokuapp.com/api/pins");
        setPins(res.data);
      }catch(err){
        console.log(err);
      }
    };
    getPins();
  },[]);

  const handleMarkerClick = (id,lat,long) => {
    setcurrentPlaceId(id);
    // Setting pin to center of screen, so it's "in focus"
    setViewport({...viewport, latitude:lat, longitude:long});
  }

  const handleAddClick = (e)=>{
    const [long,lat] = e.lngLat;
    setNewPlace({
      lat: lat,
      long: long,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }
    try{
      const res = await axios.post("http://travel-pin-map-app.herokuapp.com/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    }catch(err){
      console.log(err);
    }
  };

  const handleLogout = () =>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  } 

  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      // mapboxApiAccessToken={process.env.REACT_APP_MAPBOX} // Previously had token in env file.
      mapboxApiAccessToken={pk.eyJ1IjoiaXNoYW5iIiwiYSI6ImNrcnByZnZrODhyNmQycG1meXA2YTFmZW4ifQ.j4616x9zfLuFsX6FFzj91A}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onDblClick = {handleAddClick}
      // transitionDuration="200"
    >

      {pins.map((p)=>(    
<>
      <Marker 
        latitude={p.lat} 
        longitude={p.long} 

        // Using the follow offsets so that the pin image logo had it's tip as the place we selected
        offsetLeft={-viewport.zoom * 3.5} 
        offsetTop={-viewport.zoom * 7}
      >
        {/* The styling keeps the icon the same size while zooming. */}
        <Room style={{
        fontSize:viewport.zoom * 7, 
        color: p.username === currentUser ? "tomato" : "slateblue", 
        cursor:"pointer"
        }}
        onClick = {()=>handleMarkerClick(p._id,p.lat, p.long)}
        />
      </Marker>

      {/* If the pin currentPlace where they are clicking is the same as an exisitng one, display that pin */}
      {p._id === currentPlaceId && (
      
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={()=>setcurrentPlaceId(null)}
        >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
              {/* Basically just fills/writes the number of stars for the 1-5 rating. */}
              {Array(p.rating).fill(<Star className="star"/>)}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{p.username}</b></span>

            {/* Basically, the "createdAt" property was recorded when info was pushed to the database.
            Then, we npm installed "timeago.js" and used its "format()" method to format the 
            p.createAt from the database into the popup. */}
            <span className="date">{format(p.createdAt)}</span>
          </div>
      </Popup>
      )}
      </>
        ))}
        {/* If they click on a new place without a pin, open this popup for making a pin at that place */}
        {newPlace && (
       <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={()=>setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input 
                placeholder="Enter a title" 
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea 
                placeholder="Enter your review" 
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Pin</button>
            </form>
          </div>

        </Popup>
        )}
        {/* If there is a currentUser, you can only see the logout option, otherwise you can only see login and register buttons */}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>Log out</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
            <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && (<Register setShowRegister={setShowRegister}/>)}
        {showLogin && (
        <Login 
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />)}
    </ReactMapGL>
    </div>
  );
}

export default App;
