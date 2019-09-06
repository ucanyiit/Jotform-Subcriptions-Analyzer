import { Body, Button, Card, CardItem, Container, Content, Header, Icon, Left, Right, Text, Title, Thumbnail } from 'native-base';
import { Image } from 'react-native';
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

    getPaymentFromAnswer(answer) {
        for (a in answer) if (a == "1") return JSON.parse(answer[a]);
    }

    getAnswerFromSubmission() {
        let submission = this.props.user.submission;
        if (typeof submission === "string") return false;
        else for (let answerID in submission.answers) if (submission.answers[answerID].paymentType) return submission.answers[answerID].answer
        return false
    }

    renderDetails = () => {
        let submission = this.props.user.submission;
        if (this.getAnswerFromSubmission()) {
            let payment = this.getPaymentFromAnswer(this.getAnswerFromSubmission());
            payment.time = submission.created_at;
            console.log(payment);
            return (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{payment.name}</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Card>
                        <Left />
                        <CardItem>
                            <Left>
                                <Text>{payment.period} {payment.price} {payment.currency}</Text>
                                <Text note>{payment.gateway}</Text>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <Image source={{ uri: 'https://static01.nyt.com/images/2018/11/27/learning/Mothers1LN/Mothers1LN-articleLarge.png' }} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <Icon active name="thumbs-up" />
                                    <Text>12 Likes</Text>
                                </Button>
                            </Left>
                            <Body>
                                <Button transparent>
                                    <Icon active name="chatbubbles" />
                                    <Text>4 Comments</Text>
                                </Button>
                            </Body>
                            <Right>
                                <Text>{payment.time}</Text>
                            </Right>
                        </CardItem>
                        <Right />
                    </Card>
                </Container>
            )
        }
        else return (
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
