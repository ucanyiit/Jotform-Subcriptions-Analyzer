import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title } from 'native-base';
import React from 'react';
import { connect } from "react-redux";
import { submissionDetailsRequest, navigateTo } from "../redux/actions";
import WaitingPage from './WaitingPage';

class SubmissionDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.submission) === "string") this.props.submissionDetailsRequest(this.props.user.submission);
    }

    renderDetails = () => {
        let submission = this.props.user.submission;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{submission.id}</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Body>
                        <Text>
                        //Your text here
                        </Text>

                    </Body>
                    <Left>
                        <Button transparent textStyle={{ color: '#87838B' }}>
                            <Icon name="logo-github" />
                            <Text note>{submission.url}</Text>
                        </Button>
                    </Left>
                </Content>
            </Container>
        )
    }

    render() {
        if (this.props.user.isLoading) return <WaitingPage />
        else return this.renderDetails();
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        submissionDetailsRequest: id => { dispatch(submissionDetailsRequest(id)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionDetailsPage);
