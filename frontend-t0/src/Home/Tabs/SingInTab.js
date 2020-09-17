import React from 'react';
import axios from 'axios';

class SignInTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value    
        });
    }

    handleSubmit(event) {
        event.preventDefault()

        const userData = new FormData();
        userData.set('username', this.state.username);
        userData.set('password', this.state.password);

        axios.post(
            `http://${process.env.REACT_APP_BACKEND_URL}/api/api-auth/`,
            userData,
            { 
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            }
        )
        .then(res => {
            this.props.signInCompletion(res.data.auth_token)
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <form className="form-signin" onSubmit={(event) => this.handleSubmit(event)}>
                <h2 className="form-signin-heading">Sign in</h2>
                <input className="form-control" name="username" value={this.state.username} onChange={(event) => this.handleChange(event)} placeholder="Username"></input>
                <input className="form-control" name="password" value={this.state.password} onChange={(event) => this.handleChange(event)} type="password" placeholder="Password"></input>
                <button className="btn btn-lg btn-primary btn-block" style={{margin: "1em"}} type="submit">Sign in</button>
            </form>
        )
    }
}

export default SignInTab;