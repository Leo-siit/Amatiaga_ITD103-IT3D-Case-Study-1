import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sign-in.css";
import logo from "./logo.png";

function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/login", { username, password });
            const { user } = response.data;

            // Redirect based on user type
            if (user && user.usertype === "admin") {
                navigate("/dashboard"); // Use navigate instead of history.push
            } else {
                navigate("/pdashboard"); // Use navigate instead of history.push
            }
        } catch (error) {
            setError("Invalid username or password");
            console.error("Login error:", error);
        }
    };

    useEffect(() => {
        // Load external stylesheets dynamically
        const bootstrapCss = document.createElement("link");
        bootstrapCss.href = "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";
        bootstrapCss.rel = "stylesheet";
        bootstrapCss.id = "bootstrap-css";
        document.head.appendChild(bootstrapCss);
    
        // Load external scripts dynamically with correct order
        const loadScripts = async () => {
            const jqueryJs = document.createElement("script");
            jqueryJs.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js";
            jqueryJs.async = false; // Ensure it is loaded before Bootstrap
            document.body.appendChild(jqueryJs);
    
            jqueryJs.onload = () => {
                const bootstrapJs = document.createElement("script");
                bootstrapJs.src = "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js";
                bootstrapJs.async = false; // Ensure it is loaded after jQuery
                document.body.appendChild(bootstrapJs);
            };
        };
    
        loadScripts();
    
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
            document.head.removeChild(fontAwesomeCss);
            document.body.removeChild(document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"]'));
            document.body.removeChild(document.querySelector('script[src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"]'));
        };
    }, []);    

    return (
        <div>
            <img src={logo} alt="Logo" className="logo" />
            <div className="container">
                <div className="row justify-content-center align-items-center" style={{ height: "135vh" }}>
                    <div className="col-md-4">
                        <div className="card">
                            <article className="card-body">
                                <h4 className="card-title mb-4 mt-1">Sign in</h4>
                                <form onSubmit={handleLogin}>
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
                                        <button type="submit" className="btn btn-primary btn-dark"> Login  </button>
                                    </div>
                                    {error && <div className="text-danger">{error}</div>}
                                </form>
                                <p className="text-center">Don&apos;t have an account? <Link to="/authentication/sign-up">Sign up</Link></p>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
