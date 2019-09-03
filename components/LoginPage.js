import { Button, Container, Content, Form, Input, Item, Spinner, Text } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { loginRequest, navigateTo } from "../redux/actions";
import styles from './styles';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
                    <Button style={styles.button} block onPress={() => this.props.loginRequest({ username: this.state.username, password: this.state.password, navigation: this.props.navigation.navigate})}>
                        <Text>Login</Text>
                    </Button>
                    <Button style={styles.button} block bordered onPress={() => this.props.navigateTo({ navigation: this.props.navigation.navigate, page: 'Register' })}>
                        <Text>Don't have an acoount? Register instead</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
    
    render() {
        if (this.props.user.isLoading) return this.renderWaiting()
        else return this.renderLogin()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        loginRequest: credentials => { dispatch(loginRequest(credentials)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);