import React from 'react';
import axios from 'axios';

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        let eventToCreate = {
            event_name: "",
            event_category: "CONFERENCE",
            event_place: "",
            event_address: "",
            event_initial_date: "",
            event_final_date: "",
            event_initial_date_dateval: "",
            event_initial_date_timeval: "",
            event_final_date_dateval: "",
            event_final_date_timeval: "",
            event_type: "VIRTUAL",
            thumbnail: "",
        }
        this.state = {
            eventToCreate: eventToCreate
        }
    }

    submitEventToCreate() {
        var errorlog = "";
        Object.keys(this.state.eventToCreate).map((key) => {
            if (this.state.eventToCreate[key] === "" && !["event_initial_date", "event_final_date"].includes(key)) {
                errorlog = `${errorlog}\n${`The field ${key} cannot be empty.`}`
            }
        });

        if (errorlog !== "") {
            window.alert(errorlog);
            return;
        }

        const eventData = new FormData();
        Object.keys(this.state.eventToCreate).map((key) => {
            if (!["event_initial_date_dateval", "event_initial_date_timeval", "event_final_date_dateval", "event_final_date_timeval", "event_initial_date", "event_final_date"].includes(key)) {
                eventData.append(key, this.state.eventToCreate[key]);
            } else if (["event_initial_date", "event_final_date"].includes(key)) {
                eventData.append(key, this.state.eventToCreate[key + "_dateval"] + "T" + this.state.eventToCreate[key + "_timeval"]);
            }
        });

        axios.post(
            `http://${process.env.SERVER_URL}/api/events/`,
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
                this.props.goToMyEvents()
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.name !== "thumbnail" ? target.value : target.files[0];

        console.log("handle = " + name)

        var eventToCreate = this.state.eventToCreate;
        eventToCreate[name] = value;

        this.setState({
            eventToCreate: eventToCreate
        });
    }

    showValueRow(key) {
        if (key === "thumbnail") {
            return (<td>
                <form>
                    <input className="form-control-file" type="file" name={key} onChange={(event) => this.handleChange(event)}></input>
                </form>
            </td>)
        } else if (key === "event_category") {
            return (<td>
                <form>
                    <select className="form-control" name={key} value={this.state.eventToCreate[key]} onChange={(event) => this.handleChange(event)}>
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
                    <select className="form-control" name={key} value={this.state.eventToCreate[key]} onChange={(event) => this.handleChange(event)}>
                        <option value="VIRTUAL">VIRTUAL</option>
                        <option value="PRESENCIAL">PRESENCIAL</option>
                    </select>
                </form>
            </td>)
        } else if (key === "event_initial_date" || key === "event_final_date") {
            return (<td>
                <form className="form-inline">
                    <div className="form-group">
                        <input className="form-control" value={this.state.eventToCreate[key + "_dateval"]} name={key + "_dateval"} onChange={(event) => this.handleChange(event)} type="date"></input>
                    </div>
                    <div className="form-group">
                        <input className="form-control" value={this.state.eventToCreate[key + "_timeval"]} name={key + "_timeval"} onChange={(event) => this.handleChange(event)} type="time" step="1"></input>
                    </div>
                </form>
            </td>)
        } else {
            return (<td>
                <form>
                    <input className="form-control" value={this.state.eventToCreate[key]} name={key} onChange={(event) => this.handleChange(event)} ></input>
                </form>
            </td>)
        }
    }

    render() {
        return (
            <div className="container">
                <div className="container">
                    <ul className="nav">
                        <h2 style={{ margin: "1em" }}>New Event</h2>
                        <ul className="nav nav-pills" style={{ margin: "1em" }}>
                            <button className="btn btn-success" onClick={() => this.submitEventToCreate()} style={{ margin: "1em" }}>Create</button>
                        </ul>
                    </ul>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Item</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.eventToCreate).map((key) => {
                            if (!["event_initial_date_dateval", "event_initial_date_timeval", "event_final_date_dateval", "event_final_date_timeval"].includes(key)) {
                                return (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        {this.showValueRow(key)}
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default CreateEvent;