import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css"

export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) => {
        // prevent default stops it from refreshing the page
        e.preventDefault();
        const newUser = {
            username:usernameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };

        // Before adding in the heroku url below, it was originally set as "/users/register"
        try{
            await axios.post("https://travel-pin-map-app.herokuapp.com/users/register", newUser);
            setError(false);
            setSuccess(true);

        }catch(err){
            console.log("Did NOT WORK: " + err);
            setError(true);
        }
    };

    return (
        <div className="registerContainer">
            <div className="logo">
                <Room/>
                TravelPin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={usernameRef}/>
                <input type="email" placeholder="email" ref={emailRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="registerBtn">Register</button>
                {success && (
                    <span className="success">Successful. You can login now!</span>
                )}
                {error && <span className="failure">Something went wrong.</span>}
            </form>
            <Cancel className="registerCancel" onClick={() => setShowRegister(false)}/>
        </div>
    );
}