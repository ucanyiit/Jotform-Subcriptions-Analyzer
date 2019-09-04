import { Button, Container, Content, Form, Input, Item, Text } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { loadNavigation, loginRequest, navigateTo, noLogin } from "../redux/actions";
import styles from './styles';
import WaitingPage from './WaitingPage';

class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        if (!this.props.nav) this.props.loadNavigation(this.props.navigation);
        this.props.noLogin({ apikey: "8876d82ca5bc5f1ded14347d80c49f4c" });
        if (this.props.user.loggedIn) this.props.navigateTo({ page: 'Forms' });
    }

    renderLogin = () => {
        return (
            <Container>
                <Content>
                    <View style={styles.inputItem}>
                        {this.props.user.error && <Text style={styles.errorText}>Failed to login, please check your inputs.</Text>}
                        {!this.props.user.error && <Text style={styles.pleaseText}>Login please.</Text>}
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
                    <Button style={styles.button} block onPress={() => this.props.loginRequest({ username: this.state.username, password: this.state.password })}>
                        <Text>Login</Text>
                    </Button>
                    <Button style={styles.button} block bordered onPress={() => this.props.navigateTo({ page: 'Register' })}>
                        <Text>Don't have an acoount? Register instead</Text>
                    </Button>
                </Content>
            </Container>
        )
    }

    render() {
        if (this.props.user.isLoading) return <WaitingPage />
        else return this.renderLogin()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        loadNavigation: content => { dispatch(loadNavigation(content)) },
        loginRequest: credentials => { dispatch(loginRequest(credentials)) },
        navigateTo: content => { dispatch(navigateTo(content)) },
        noLogin: content => { dispatch(noLogin(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);