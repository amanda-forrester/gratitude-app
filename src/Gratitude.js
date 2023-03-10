import React from "react";
import axios from "axios";

export default class Users extends React.Component {

    state = {
        users: []
    }

    componentDidMount() {
        axios.get('http://localhost:3005/users').then(response => {
            this.setState({ users: response.data });
        })
    };

    render() {
        return (
            <div>
                <h1>Users</h1>
                <ul>
                    {this.state.users.map(user => (
                        <li key={user.id}>{user.first_name}</li>
                    ))}
                </ul>
            </div>
        )
    }
};
