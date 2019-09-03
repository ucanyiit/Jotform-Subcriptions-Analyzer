import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Spinner, Subtitle, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { navigateTo, submissonsRequest } from "../redux/actions";
import Logout from './LogoutButton';
import styles from './styles';

class SubmissionsPage extends Component {

    constructor(props) {
        super(props);
        this.props.submissonsRequest(this.props.user.content.appKey);
    }

    renderRow = (submission) => {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ navigation: this.props.navigation.navigate, page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                <Body>
                    <View>
                        <View>
                            <Text style={styles.smallTitleText}>{submission.title}</Text>
                            <Text style={styles.smallSubtitleText}>{submission.id}</Text>
                        </View>
                    </View>
                </Body>
            </ListItem>
        );
    }

    renderWaiting = () => {
        return (
            <Container style={styles.inputItem}>
                <Text style={styles.pleaseText}>Waiting for response...</Text>
                <Spinner />
            </Container>
        );
    }

    renderSubmissions = () => {
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Submissionss</Title>
                        <Subtitle>Subtitle</Subtitle>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='refresh' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List>
                        {this.props.user.submissions && this.props.user.submissions.map(data => { return this.renderRow(data) })}
                    </List>
                </Content>
                <Logout />
            </Container>
        )
    }

    render() {
        if (this.props.user.isLoading) return this.renderWaiting()
        else return this.renderSubmissions()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        submissonsRequest: content => { dispatch(submissonsRequest(content)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsPage);