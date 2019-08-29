import axios from 'axios';
import { Button, Container, Content, Form, Input, Item, Spinner, Text } from 'native-base';
import qs from 'qs';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { login } from "../redux/actions";
import styles from './styles';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        that.setState({ isLoading: false, error: false });
    }

    onLogin() {
        let that = this;
        let { username, password } = that.state;
        that.setState({ isLoading: true });
        console.log(username, password);
        axios.post('https://api.jotform.com/user/login', qs.stringify({ username, password, 'access': 'full', 'appName': 'ucanyiit' }))
            .then(function (response) {
                console.log(response);
                that.props.login(response.data.content);
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

export default connect(null, { login })(LoginPage);