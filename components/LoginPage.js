import { Button, Container, Content, Form, Input, Item, Text } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { loadNavigation, loginRequest, navigateTo } from '../redux/actions';
import styles from './styles';
import WaitingPage from './WaitingPage';

class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        if (!this.props.nav) this.props.loadNavigation(this.props.navigation);
        if (this.props.user.loggedIn) this.props.navigateTo({ page: 'Submissions' });
    }

    renderLogin = () => {
        return (
            <Container style={styles.darkBackground}>
                <Content style={styles.marginedContent}>
                    <Content style={styles.inputItem}>
                        {this.props.user.error && <Text style={styles.red20Text}>Failed to login, please check your inputs.</Text>}
                        {!this.props.user.error && <Text style={styles.whitest20Text}>Login please.</Text>}
                    </Content>
                    <Form style={styles.marginedTop12}>
                        <Item style={styles.marginedContent2}>
                            <Input style={styles.input}
                                placeholderTextColor='#CCCAAF'
                                placeholder='Username'
                                value={this.state.username}
                                onChangeText={(username) => this.setState({ username })} />
                        </Item>
                        <Item style={styles.marginedContent2}>
                            <Input style={styles.input}
                                placeholderTextColor='#CCCAAF'
                                placeholder='Password'
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })} />
                        </Item>
                    </Form>
                    <Content style={styles.marginedTop12}>
                        <Button style={styles.button} block onPress={() => this.props.loginRequest({ username: this.state.username, password: this.state.password })}>
                            <Text>Login</Text>
                        </Button>
                        <Button style={styles.button} block onPress={() => this.props.navigateTo({ page: 'Register' })}>
                            <Text>Don't have an acoount? Register instead</Text>
                        </Button>
                    </Content>
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
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);