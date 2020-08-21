import React from 'react';
import axios from 'axios';

class Register extends React.Component {
    constructor(props) {
        super(props);
        let userToCreate = {
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        }
        this.state = {
            userToCreate: userToCreate
        }
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        var userToCreate = this.state.userToCreate;
        userToCreate[name] = value;

        this.setState({
            userToCreate: userToCreate
        });
    }

    submitUserToCreate(event) {
        event.preventDefault()

        var errorlog = "";
        Object.keys(this.state.userToCreate).map((key) => {
            if (this.state.userToCreate[key] === "") {
                errorlog = `${errorlog}\n${`The field ${key} cannot be empty.`}`
            }
        });

        if (errorlog !== "") {
            window.alert(errorlog);
            return;
        }


        const userData = new FormData();
        Object.keys(this.state.userToCreate).map((key) => {
            userData.set(key, this.state.userToCreate[key]);
        });

        axios.post(
            `http://172.24.98.138/api/create-user/`,
            userData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
            .then(res => {
                console.log(res);
                this.loginNewUser();
            })
            .catch(error => {
                console.log(error.response);
                if (error.response) {
                    var error_log = "Could not register user"
                    Object.keys(error.response.data).map((key) => {
                        error.response.data[key].forEach(val => {
                            error_log = `${error_log}\n${val}`
                        })

                    })
                    window.alert(error_log)
                }
            });
    }

    loginNewUser() {
        const userData = new FormData();
        userData.set('username', this.state.userToCreate.username);
        userData.set('password', this.state.userToCreate.password);

        axios.post(
            `http://172.24.98.138/api/api-auth/`,
            userData,
            { 
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            }
        )
        .then(res => {
            this.props.registerCompletion(res.data.auth_token)
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <form className="form-signin" onSubmit={(event) => this.submitUserToCreate(event)}>
                <h2 className="form-signin-heading">Register with us!</h2>
                <input className="form-control" placeholder="Username" name="username" value={this.state.userToCreate['username']} onChange={(event) => this.handleChange(event)}></input>
                <input className="form-control" type="password" placeholder="Password" name="password" value={this.state.userToCreate['password']} onChange={(event) => this.handleChange(event)}></input>
                <h4 style={{ margin: "1em" }}>Other information</h4>
                <input className="form-control" type="email" placeholder="Email" name="email" value={this.state.userToCreate['email']} onChange={(event) => this.handleChange(event)}></input>
                <input className="form-control" placeholder="First name" name="first_name" value={this.state.userToCreate['first_name']} onChange={(event) => this.handleChange(event)}></input>
                <input className="form-control" placeholder="Last name" name="last_name" value={this.state.userToCreate['last_name']} onChange={(event) => this.handleChange(event)}></input>
                <button className="btn btn-lg btn-primary btn-block" style={{ margin: "1em" }} type="submit">Sign up</button>
            </form>
        )
    }
}

export default Register;

