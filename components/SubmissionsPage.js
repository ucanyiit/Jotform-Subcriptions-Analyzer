import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Subtitle, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { navigateTo, submissonsRequest } from "../redux/actions";
import Logout from './LogoutButton';
import styles from './styles';
import WaitingPage from './WaitingPage';

class SubmissionsPage extends Component {

    constructor(props) {
        super(props);
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else this.props.submissonsRequest();
    }

    renderRow = (submission) => {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
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

    renderSubmissions = () => {
        return (<List>
            {this.props.user.submissions && this.props.user.submissions.map(data => { return this.renderRow(data) })}
        </List>)
    }

    render() {
        let content;
        if (this.props.user.isLoading) content = <WaitingPage />
        else content = this.renderSubmissions();
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Submissions</Title>
                        <Subtitle>Subtitle</Subtitle>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='refresh' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    {content}
                </Content>
                <Logout />
            </Container>
        )
    }

}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        submissonsRequest: () => { dispatch(submissonsRequest()) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsPage);