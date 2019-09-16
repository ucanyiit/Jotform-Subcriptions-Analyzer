import { Button, Text, Content } from 'native-base';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles';
import { logoutRequest } from '../redux/actions';

class LogoutButton extends Component {
    render() {
        return (
            <Button style={styles.redBackground} full onPress={() => this.props.logoutRequest()}>
                <Text>Logout</Text>
            </Button>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logoutRequest: () => { dispatch(logoutRequest()) }
    };
};

export default connect(null, mapDispatchToProps)(LogoutButton);