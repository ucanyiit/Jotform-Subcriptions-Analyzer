import { Body, Button, Card, CardItem, Container, Content, Header, Icon, Left, Right, Text, Title } from 'native-base';
import React from 'react';
import { Image } from 'react-native';
import IconAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import { connect } from "react-redux";
import { navigateTo, submissionDetailsRequest } from "../redux/actions";
import styles from './styles';
import WaitingPage from './WaitingPage';

class SubmissionDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.submission) === "string") this.props.submissionDetailsRequest(this.props.user.submission);
    }

    renderDetails = () => {
        let submission = this.props.user.submission;
        if (submission.payment) {
            console.log(submission.payment);
            return (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Customer name: {submission.payment.name}</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Card>
                        <Left />
                        <CardItem>
                            <Left>
                                <Text style={styles.smallTitleText}>{submission.payment.period} {submission.payment.price} {submission.payment.currency}</Text>
                            </Left>
                            <Right/>
                        </CardItem>
                        <CardItem cardBody>
                            <Image source={{ uri: 'https://static01.nyt.com/images/2018/11/27/learning/Mothers1LN/Mothers1LN-articleLarge.png' }} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text style={styles.smallSubtitleText}>{submission.payment.paymentType} with <IconAwesome active name="stripe-s" /></Text>
                            </Left>
                            <Body>
                            </Body>
                            <Right>
                                <Text style={styles.smallSubtitleText}>{submission.payment.date}</Text>
                                <Text style={styles.smallSubtitleText}>{submission.payment.time}</Text>
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
