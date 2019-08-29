import axios from 'axios';
import { Body, Container, Content, Header, Left, List, ListItem, Right, Spinner, Subtitle, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { updateSubmissionDetails } from "../redux/actions";
import styles from './styles';
import Logout from './LogoutButton';

class SubmissionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    onListItemPress = (id) => {
        console.log(id);
        this.props.updateSubmissionDetails(id);
        this.props.navigation.navigate('SubmissionDetails');
    }

    renderRow = (submissionData) => {
        return (
            <ListItem button onPress={() => { this.onListItemPress(submissionData.id) }} style={styles.productItem}>
                <Body>
                    <View>
                        <View>
                            <Text style={styles.smallTitleText}>{submissionData.title}</Text>
                            <Text style={styles.smallSubtitleText}>{submissionData.id}</Text>
                        </View>
                    </View>
                </Body>
            </ListItem>
        );
    }

    componentDidMount() {
        let that = this;
        // that.props.user.content.appKey = '8876d82ca5bc5f1ded14347d80c49f4c'; // for testing purposes
        return axios.get('https://api.jotform.com/user/submissions', {
            params: {
                apikey: this.props.user.content.appKey
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
                <Header>
                    <Left />
                    <Body>
                        <Title>Submissionss</Title>
                        <Subtitle>Subtitle</Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <List>
                        {
                            this.state.submissions.map(data => {
                                return this.renderRow(data)
                            })
                        }
                    </List>
                </Content>
                <Logout />
            </Container>
        )
    }

    render() {
        console.log(this.state);
        if (this.state.isLoading) return this.renderWaiting()
        else return this.renderLogin()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

export default connect(mapStateToProps, { updateSubmissionDetails })(SubmissionsPage);