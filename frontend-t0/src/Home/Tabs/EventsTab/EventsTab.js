import React from 'react';
import axios from 'axios';

class EventsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            currentEvent: null,
        }
    }

    componentDidMount() {
        axios.get(
            'http://localhost:8080/api/events/',
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${this.props.token}`
                }
            }
        )
            .then(res => {
                this.setState({
                    events: res.data
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    showEvent(event) {
        this.setState({
            currentEvent: event,
            editMode: false,
        })
    }

    closeEvent() {
        this.setState({
            currentEvent: null,
            editMode: false,
        })
    }

    enterEditMode() {
        this.setState({
            editMode: true,
        })
    }

    editModeTab(key) {
        if (this.state.editMode) {
            return (<td><input>{this.state.currentEvent[key]}</input></td>)
        }
    }

    editModeHeader() {
        if (this.state.editMode) {
            return (<th scope="col">New Value</th>)
        }
    }

    render() {

        if (this.state.currentEvent != null) {
            return (
                <div className="container">
                    <div className="container">
                        <ul className="nav nav-pills" style={{ margin: "1em" }}>
                            <h2 style={{ margin: "1em" }}>Event Details</h2>
                            <button className="btn btn-primary" onClick={() => this.enterEditMode()} style={{ margin: "1em" }}>Edit</button>
                            <button className="btn btn-secondary" onClick={() => this.closeEvent()} style={{ margin: "1em" }}>Close</button>
                        </ul>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Item</th>
                                <th scope="col">Value</th>
                                {this.editModeHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(this.state.currentEvent).map((key) => {
                                if (key != "id" && key != "user_id" && key != "created_at" && key != "updated_at") {
                                    return (
                                        <tr>
                                            <td>{key}</td>
                                            <td>{this.state.currentEvent[key]}</td>
                                            {this.editModeTab(key)}
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return (
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Type</th>
                            <th scope="col">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.events.map((event) => {
                            return (
                                <tr>
                                    <td>{event.event_name}</td>
                                    <td>{event.event_category}</td>
                                    <td>{event.event_type}</td>
                                    <td><button className="btn btn-primary" onClick={() => this.showEvent(event)}>Show Details</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )
        }
    }
}

export default EventsTab;
