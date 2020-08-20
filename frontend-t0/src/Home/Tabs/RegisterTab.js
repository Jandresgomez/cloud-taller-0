import React from 'react';

class Register extends React.Component {
    render() {
        return (
            <form className="form-signin">
                <h2 className="form-signin-heading">Register with us!</h2>
                <input className="form-control" placeholder="Username"></input>
                <input className="form-control" type="password" placeholder="Password"></input>
                <h4 style={{margin: "1em"}}>Other information</h4>
                <input className="form-control" type="email" placeholder="Email"></input>
                <input className="form-control" placeholder="First name"></input>
                <input className="form-control" placeholder="Last name"></input>
                <button className="btn btn-lg btn-primary btn-block" style={{margin: "1em"}} type="submit">Sign up</button>
            </form>
        )
    }
}

export default Register;

