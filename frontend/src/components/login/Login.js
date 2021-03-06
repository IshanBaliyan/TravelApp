import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css"

export default function Login({ setShowLogin,myStorage,setCurrentUser }) {
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) => {
        // prevent default stops it from refreshing the page
        e.preventDefault();
        const user = {
            username:usernameRef.current.value,
            password:passwordRef.current.value,
        };

        try{

            // Before adding in the heroku url below, it was originally set as "/users/login"
            const res = await axios.post("https://travel-pin-map-app.herokuapp.com/api/users/login", user);

            // Set local storage for username
            myStorage.setItem("user", res.data.username);

            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false);

        }catch(err){
            setError(true);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room/>
                TravelPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={usernameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
                {error && <span className="failure">Something went wrong.</span>}
            </form>
            <Cancel className="loginCancel" onClick={() => setShowLogin(false)}/>
        </div>
    );
}