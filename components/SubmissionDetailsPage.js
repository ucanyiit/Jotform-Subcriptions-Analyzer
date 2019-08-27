import axios from 'axios';
import { Container, Spinner, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class SubmissionDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        let that = this;
        return axios.get('https://api.jotform.com/user/submission', {
            params: {
                apikey: "8876d82ca5bc5f1ded14347d80c49f4c",
                id: ""
            }
        })
            .then(function (response) {
                that.setState({
                    isLoading: false,
                    submissions: response.data.content
                })
            })
            .catch(function (error) {
                console.log(error);
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
        else return this.renderDetails()
    }
}
