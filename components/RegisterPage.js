import { Button, Container, Form, Input, Item, Text } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { navigateTo, registerRequest } from "../redux/actions";
import styles from './styles';
import WaitingPage from './WaitingPage';

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.user.loggedIn) this.props.navigateTo({ navigation: this.props.navigation.navigate, page: 'Forms' });
    }

    renderRegister = () => {
        return (
            <Container>
                <View style={styles.inputItem}>
                    {this.props.user.error && <Text style={styles.errorText}>Failed to register, please check your inputs.</Text>}
                    {!this.props.user.error && <Text style={styles.pleaseText}>Register please.</Text>}
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
                <Button style={styles.button} onPress={() => this.props.registerRequest({ username: this.state.username, password: this.state.password, email: this.state.email })}>
                    <Text>Register</Text>
                </Button>
                <Button style={styles.button} bordered onPress={() => this.props.navigateTo({ navigation: this.props.navigation.navigate, page: 'Login' })}>
                    <Text>Have an account? Login instead</Text>
                </Button>
            </Container>
        );
    }

    render() {
        if (this.props.user.isLoading) return <WaitingPage />
        else return this.renderRegister()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        registerRequest: credentials => { dispatch(registerRequest(credentials)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);