import { Content, Spinner, Text } from 'native-base';
import React, { Component } from 'react';
import styles from './styles';


export default class WaitingPage extends Component {
    render() {
        return (
            <Content style={styles.inputItem}>
                <Text style={styles.pleaseText}>Waiting for response...</Text>
                <Spinner />
            </Content>
        )
    }
}