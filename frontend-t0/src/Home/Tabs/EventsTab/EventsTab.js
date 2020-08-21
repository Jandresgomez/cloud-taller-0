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
        this.reloadEvents()
    }

    reloadEvents() {
        axios.get(
            `http://172.24.98.138:8000/api/events/`,
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
            editedEvent: null,
        })
        this.reloadEvents()
    }

    enterEditMode() {
        var editedEvent = Object.assign({}, this.state.currentEvent);
        editedEvent["event_initial_date_dateval"] = this.state.currentEvent["event_initial_date"].split('T')[0]
        editedEvent["event_initial_date_timeval"] = this.state.currentEvent["event_initial_date"].split('T')[1].split(".")[0]
        editedEvent["event_final_date_dateval"] = this.state.currentEvent["event_final_date"].split('T')[0]
        editedEvent["event_final_date_timeval"] = this.state.currentEvent["event_final_date"].split('T')[1].split(".")[0]

        this.setState({
            editMode: true,
            editedEvent: editedEvent,
        })
    }

    exitEditMode() {
        this.setState({
            editMode: false,
            editedEvent: null,
        })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.name !== "thumbnail_source" ? target.value : target.files[0];

        var editedEvent = this.state.editedEvent;
        editedEvent[name] = value;

        this.setState({
            editedEvent: editedEvent
        });
    }

    submitEditedEvent() {
        const eventData = new FormData();
        Object.keys(this.state.editedEvent).map((key) => {
            if (["event_initial_date", "event_final_date"].includes(key)) {
                eventData.append(key, this.state.editedEvent[key + "_dateval"] + "T" + this.state.editedEvent[key + "_timeval"]);
            } else if (!["id", "user_id", "created_at", "updated_at", "thumbnail", "thumbnail_source", "event_initial_date_dateval", "event_final_date_dateval", "event_initial_date_timeval", "event_final_date_timeval"].includes(key)) {
                eventData.append(key, this.state.editedEvent[key]);
            }
        })

        if (this.state.editedEvent.thumbnail_source) {
            eventData.append('thumbnail', this.state.editedEvent.thumbnail_source)
        }

        axios.put(
            `http://172.24.98.138:8000/api/events/${this.state.currentEvent.id}`,
            eventData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${this.props.token}`
                }
            }
        )
            .then(res => {
                console.log(res);
                this.reloadCurrentEvent()
                    .then(() => this.exitEditMode())
            })
            .catch(error => {
                console.log(error);
            });
    }

    showValueRow(key) {
        if (this.state.editMode) {
            if (key === "thumbnail") {
                return (<td>
                    <form>
                        <input className="form-control-file" type="file" name={key + "_source"} onChange={(event) => this.handleChange(event)}></input>
                    </form>
                </td>)
            } else if (key === "event_category") {
                return (<td>
                    <form>
                        <select className="form-control" name={key} value={this.state.editedEvent[key]} onChange={(event) => this.handleChange(event)}>
                            <option value="CONFERENCE">CONFERENCE</option>
                            <option value="SEMINAR">SEMINAR</option>
                            <option value="CONGRESS">CONGRESS</option>
                            <option value="COURSE">COURSE</option>
                        </select>
                    </form>
                </td>)
            } else if (key === "event_type") {
                return (<td>
                    <form>
                        <select className="form-control" name={key} value={this.state.editedEvent[key]} onChange={(event) => this.handleChange(event)}>
                            <option value="VIRTUAL">VIRTUAL</option>
                            <option value="PRESENCIAL">PRESENCIAL</option>
                        </select>
                    </form>
                </td>)
            } else if (key === "event_initial_date" || key === "event_final_date") {
                return (<td>
                    <form className="form-inline">
                        <div className="form-group">
                            <input className="form-control" value={this.state.editedEvent[key + "_dateval"]} name={key + "_dateval"} onChange={(event) => this.handleChange(event)} type="date"></input>
                        </div>
                        <div className="form-group">
                            <input className="form-control" value={this.state.editedEvent[key + "_timeval"]} name={key + "_timeval"} onChange={(event) => this.handleChange(event)} type="time" step="1"></input>
                        </div>
                    </form>
                </td>)
            } else {
                return (<td>
                    <form>
                        <input className="form-control" value={this.state.editedEvent[key]} name={key} onChange={(event) => this.handleChange(event)} ></input>
                    </form>
                </td>)
            }
        } else {
            if (key === "thumbnail") {
                return (<td><img src={`${this.state.currentEvent.thumbnail}`} alt="Thumbnail" style={{ height: "auto", width: "460px" }}></img></td>)
            } else {
                return (<td>{this.state.currentEvent[key]}</td>)
            }
        }
    }

    editModeHeader() {
        if (this.state.editMode) {
            return (<th scope="col">New Value</th>)
        } else {
            return (<th scope="col">Value</th>)
        }
    }

    deleteEvent() {
        var willDelete = window.confirm('Are you sure you want to delete the current event? This action is final and cannot be reversed.')
        if (willDelete) {
            axios.delete(
                `http://172.24.98.138:8000/api/events/${this.state.currentEvent.id}`,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${this.props.token}`
                    }
                }
            )
                .then(res => {
                    console.log(res);
                    this.closeEvent();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    buttonBar() {
        if (this.state.editMode) {
            return (
                <ul className="nav nav-pills" style={{ margin: "1em" }}>
                    <button className="btn btn-success" onClick={() => this.submitEditedEvent()} style={{ margin: "1em" }}>Save</button>
                    <button className="btn btn-secondary" onClick={() => this.exitEditMode()} style={{ margin: "1em" }}>Cancel</button>
                </ul>
            )

        } else {
            return (
                <ul className="nav nav-pills" style={{ margin: "1em" }}>
                    <button className="btn btn-primary" onClick={() => this.enterEditMode()} style={{ margin: "1em" }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => this.deleteEvent()} style={{ margin: "1em" }}>Delete</button>
                    <button className="btn btn-secondary" onClick={() => this.closeEvent()} style={{ margin: "1em" }}>Close</button>
                </ul>
            )
        }
    }

    async reloadCurrentEvent() {
        await axios.get(
            `http://172.24.98.138:8000/api/events/${this.state.currentEvent.id}`,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${this.props.token}`
                }
            }
        )
            .then(res => {
                this.setState({
                    currentEvent: res.data
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        if (this.state.currentEvent !== null) {
            return (
                <div className="container">
                    <div className="container">
                        <ul className="nav">
                            <h2 style={{ margin: "1em" }}>Event Details</h2>
                            {this.buttonBar()}
                        </ul>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Item</th>
                                {this.editModeHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(this.state.currentEvent).map((key) => {
                                if (!["id", "user_id", "created_at", "updated_at", "event_initial_date_dateval", "event_final_date_dateval", "event_initial_date_timeval", "event_final_date_timeval"].includes(key)) {
                                    return (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            {this.showValueRow(key)}
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
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Type</th>
                            <th scope="col">Thumbnail</th>
                            <th scope="col">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.events.map((event) => {
                            return (
                                <tr key={event.id}>
                                    <td>{event.event_name}</td>
                                    <td>{event.event_category}</td>
                                    <td>{event.event_type}</td>
                                    <td><img src={`${event.thumbnail}`} alt="Thumbnail" style={{ height: "40px", width: "auto" }}></img></td>
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
