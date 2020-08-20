import React from 'react';
import SignInTab from './Tabs/SingInTab';
import Register from './Tabs/RegisterTab';
import EventsTab from './Tabs/EventsTab/EventsTab';
import CreateEvent from './Tabs/EventsTab/CreateEvent';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: "SignIn",
            token: "",
        };
    }

    drawCurrentTab() {
        switch (this.state.currentTab) {
            case "SignIn":
                return (<SignInTab signInCompletion={(token) => this.signInCompletion(token)} />)
            case "Register":
                return (<Register registerCompletion={(token) => this.signInCompletion(token)}/>)
            case "Events":
                return (<EventsTab token={this.state.token}/>)
            case "CreateEvent":
                return (<CreateEvent token={this.state.token} goToMyEvents={() => this.changeTab('Events')}/>)
            default:
                return (<SignInTab signInCompletion={(token) => this.signInCompletion(token)} />)
        }
    }

    changeTab(newTab) {
        this.setState({
            currentTab: newTab
        })
    }

    isTabActive(currentTab) {
        if (currentTab === this.state.currentTab) {
            return "active"
        } else {
            return ""
        }
    }

    signInCompletion(newToken) {
        this.setState({
            currentTab: "Events",
            token: newToken,
        })
    }

    signOut() {
        this.setState({
            currentTab: "SignIn",
            token: "",
        })
    }

    renderTabs() {
        if (this.state.token === "") {
            return (
                <ul className="nav nav-tabs nav-fill">
                    <li className="nav-item">
                        <a className={`nav-link ${this.isTabActive("SignIn")}`} onClick={() => this.changeTab("SignIn")}>Sign In</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${this.isTabActive("Register")}`} onClick={() => this.changeTab("Register")}>Register</a>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul className="nav nav-tabs nav-fill">
                    <li className="nav-item">
                        <a className={`nav-link ${this.isTabActive("Events")}`} onClick={() => this.changeTab("Events")}>My Events</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${this.isTabActive("CreateEvent")}`} onClick={() => this.changeTab("CreateEvent")}>Create Event</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link`} onClick={() => this.signOut()}>Sign Out</a>
                    </li>
                </ul>
            );
        }
    }

    render() {
        return (
            <div className="container">
                <div className="container" style={{ margin: "1em" }}>
                    {this.renderTabs()}
                </div>
                {this.drawCurrentTab()}
            </div>
        );
    }
}

export default HomePage;