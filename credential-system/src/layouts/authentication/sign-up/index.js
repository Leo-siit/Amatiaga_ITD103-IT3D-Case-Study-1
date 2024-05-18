import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sign-up.css";
import logo from "./logo.png";

function Signup() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUserType] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!name || !email || !username || !password || !usertype) {
            setError("Please fill in all fields");
            return;
        }
        
        try {
            const response = await axios.post("http://localhost:3001/signup", { name, email, username, password, usertype });
            navigate("/login");
        } catch (error) {
            setError("Error signing up");
            console.error("Signup error:", error);
        }
    };

    useEffect(() => {
        // Load external stylesheets dynamically
        const bootstrapCss = document.createElement("link");
        bootstrapCss.href = "//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";
        bootstrapCss.rel = "stylesheet";
        bootstrapCss.id = "bootstrap-css";
        document.head.appendChild(bootstrapCss);

        // Load external scripts dynamically
        const bootstrapJs = document.createElement("script");
        bootstrapJs.src = "//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js";
        document.body.appendChild(bootstrapJs);

        const jqueryJs = document.createElement("script");
        jqueryJs.src = "//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
        document.body.appendChild(jqueryJs);

        // Optionally, load Font Awesome CSS dynamically
        const fontAwesomeCss = document.createElement("link");
        fontAwesomeCss.href = "https://use.fontawesome.com/releases/v5.0.8/css/all.css";
        fontAwesomeCss.rel = "stylesheet";
        document.head.appendChild(fontAwesomeCss);

        // Set background color for the entire page
        document.body.style.backgroundColor = "#070b0c"; // Replace with your desired color

        return () => {
            // Clean up the dynamically loaded resources on component unmount
            document.head.removeChild(bootstrapCss);
            document.body.removeChild(bootstrapJs);
            document.body.removeChild(jqueryJs);
            document.head.removeChild(fontAwesomeCss);
        };
    }, []);

    return (
        <div>
            <img src={logo} alt="Logo" className="logo" />
            <div className="container">
                <div className="row justify-content-center align-items-center" style={{ height: "178vh" }}>
                    <div className="col-md-4">
                        <div className="card">
                            <article className="card-body">
                                <h4 className="card-title mb-4 mt-1">Sign up</h4>
                                <form onSubmit={handleSignup}>
                                    <div className="form-group">
                                        <label>Your name</label>
                                        <input 
                                            className="form-control" 
                                            placeholder="Name" 
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Your email</label>
                                        <input 
                                            className="form-control" 
                                            placeholder="Email" 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Your username</label>
                                        <input 
                                            className="form-control" 
                                            placeholder="Username" 
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Your password</label>
                                        <input 
                                            className="form-control" 
                                            placeholder="******" 
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                    <label>User type</label>
                                        <div className="form-check form-check-inline">
                                            <input 
                                                className="form-check-input ml-2" 
                                                type="radio" 
                                                name="usertype" 
                                                id="student" 
                                                value="student" 
                                                onChange={(e) => setUserType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="student">Student</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="usertype" 
                                                id="alumni" 
                                                value="alumni" 
                                                onChange={(e) => setUserType(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="alumni">Alumni</label>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary btn-dark"> Sign up  </button>
                                    </div>
                                    {error && <div className="text-danger">{error}</div>}
                                </form>
                                <p className="text-center">Already have an account? <Link to="/authentication/sign-in">Login</Link></p>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
