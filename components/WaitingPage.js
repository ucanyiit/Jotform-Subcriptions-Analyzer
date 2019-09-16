import { Content, Spinner, Text } from 'native-base';
import React, { Component } from 'react';
import styles from './styles';


export default class WaitingPage extends Component {
    render() {
        return (
            <Content style={styles.darkBackground}>
                <Content style={styles.marginedContent}>
                    <Text style={styles.white20Text}>Waiting for response...</Text>
                    <Spinner />
                </Content>
            </Content>
        )
    }
}