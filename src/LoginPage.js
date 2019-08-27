import axios from 'axios';
import { Button, Container, Content, Form, Input, Item, Spinner, Text } from 'native-base';
import qs from 'qs';
import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false }
    }

    onLogin() {
        let that = this;
        let { username, password } = that.state;
        that.setState({ isLoading: true });
        console.log(username, password);
        axios.post('https://api.jotform.com/user/login', qs.stringify({ username, password, 'access': 'full', 'appName': 'ucanyiit' }))
            .then(function (response) {
                console.log(response);
                that.setState({ isLoading: false, error: false, response: response });
            })
            .catch(function (error) {
                console.log(error);
                that.setState({ isLoading: false, error: true });
            })
            .then(function () {

            });
    }

    onLogout() {
        let that = this;
        that.setState({ isLoading: true });
        axios.get('https://api.jotform.com/user/logout')
            .then(function (response) {
                console.log(response);
                that.setState({ isLoading: false, error: false });
            })
            .catch(function (error) {
                console.log(error);
                that.setState({ isLoading: false, error: true });
            })
            .then(function () {

            });
    }

    renderWaiting = () => {
        return (
            <Container style={styles.inputItem}>
                <Text style={styles.pleaseText}>Waiting for response...</Text>
                <Spinner />
            </Container>
        );
    }

    renderLogin = () => {
        return (
            <Container>
                <Content>
                    <View style={styles.inputItem}>
                        {this.state.error && <Text style={styles.errorText}>Failed to login, please check your inputs.</Text>}
                        {!this.state.error && <Text style={styles.pleaseText}>Login please.</Text>}
                    </View>
                    <Form>
                        <Item style={styles.inputItem}>
                            <Input placeholder="Username"
                                value={this.state.username}
                                onChangeText={(username) => this.setState({ username })} />
                        </Item>
                        <Item style={styles.inputItem}>
                            <Input placeholder="Password"
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })} />
                        </Item>
                    </Form>
                    <Button style={styles.button} block onPress={() => this.onLogin()}>
                        <Text>Login</Text>
                    </Button>
                    <Button style={styles.button} block bordered onPress={() => this.props.navigation.navigate('Register')}>
                        <Text>Don't have an acoount? Register instead</Text>
                    </Button>
                    <Button style={styles.button} danger block bordered onPress={() => this.onLogout()}>
                        <Text>Logout?</Text>
                    </Button>
                </Content>
            </Container>
        )
    }

    render() {
        console.log(this.state);
        if (this.state.isLoading) return this.renderWaiting()
        else return this.renderLogin()
    }
}