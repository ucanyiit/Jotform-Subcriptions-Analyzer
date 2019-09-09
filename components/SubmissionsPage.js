import { Body, Container, Content, Header, Left, List, ListItem, Picker, Right, Subtitle, Text, Title } from 'native-base';
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
        this.state = { selected: "subscription" };
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else this.props.submissonsRequest(this.state.selected);
    }

    onValueChange(value: string) {
        this.setState({ selected: value });
        this.props.submissonsRequest(value);
    }

    renderRow = (submission) => {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                <Body>
                    <View>
                        <View>
                            <Text style={styles.smallTitleText}>{submission.form.title}</Text>
                            <Text style={styles.smallSubtitleText}>{submission.subscription.period} {submission.subscription.price} {submission.subscription.currency}</Text>
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
                        <Picker
                            mode="dropdown"
                            style={{ color: '#fff', }}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}>
                            <Picker.Item label="All Forms" value="all" />
                            <Picker.Item label="Subscriptions" value="subscription" />
                            <Picker.Item label="Payments" value="payment" />
                        </Picker>
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
        submissonsRequest: content => { dispatch(submissonsRequest(content)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionsPage);