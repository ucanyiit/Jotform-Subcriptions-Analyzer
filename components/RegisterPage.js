import axios from 'axios';
import { Button, Container, Form, Input, Item, Spinner, Text } from 'native-base';
import qs from 'qs';
import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';


export default class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: false, error: false };
    }

    onRegister() {
        const that = this;
        const { username, password, email } = that.state;
        that.setState({ isLoading: true });
        axios.post('https://api.jotform.com/user/register', qs.stringify({ username, password, email }))
            .then(function (response) {
                console.log(response);
                that.setState({ isLoading: false, error: false });
                that.props.navigation.navigate('Login');
            })
            .catch(function (error) {
                console.log(error);
                that.setState({ isLoading: false, error: true });
            })
            .then(function () {
                // always executed
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

    renderRegister = () => {
        return (
            <Container>
                <View style={styles.inputItem}>
                    {this.state.error && <Text style={styles.errorText}>Failed to register, please check your inputs.</Text>}
                    {!this.state.error && <Text style={styles.pleaseText}>Register please.</Text>}
                </View>
                <Form>
                    <Item style={styles.inputItem}>
                        <Input placeholder="Username"
                            value={this.state.username}
                            onChangeText={(username) => this.setState({ username })} />
                    </Item>
                    <Item style={styles.inputItem} >
                        <Input placeholder="Password"
                            secureTextEntry={true}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })} />
                    </Item>
                    <Item style={styles.inputItem} >
                        <Input placeholder="E-Mail"
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })} />
                    </Item>
                </Form>
                <Button style={styles.button} onPress={() => this.onRegister()}>
                    <Text>Register</Text>
                </Button>
                <Button style={styles.button} bordered onPress={() => this.props.navigation.navigate('Login')}>
                    <Text>Have an account? Login instead</Text>
                </Button>
            </Container>
        );
    }

    render() {
        console.log(this.state);
        if (this.state.isLoading) return this.renderWaiting()
        else return this.renderRegister()
    }
}