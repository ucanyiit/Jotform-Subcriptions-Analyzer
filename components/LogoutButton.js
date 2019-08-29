import axios from 'axios';
import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { connect } from "react-redux";
import { logout } from "../redux/actions";
import styles from './styles';

class LogoutButton extends Component {
    constructor(props) {
        super(props);
    }

    onLogout() {
        let that = this;
        axios.get('https://api.jotform.com/user/logout')
            .then(function (response) {
                console.log(response);
                that.props.logout();
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {

            });
    }

    render() {
        return (
            <Button style={styles.button} danger block bordered onPress={() => this.onLogout()}>
                <Text>Logout</Text>
            </Button>
        )
    }
}

export default connect(null, { logout })(LogoutButton);