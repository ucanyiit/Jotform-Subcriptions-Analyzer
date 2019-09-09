import moment from 'moment';
import { Body, Button, Card, CardItem, Container, Content, DatePicker, Header, Icon, Left, Right, Text, Title } from 'native-base';
import React from 'react';
import IconAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import { connect } from "react-redux";
import { navigateTo, submissionDetailsRequest } from "../redux/actions";
import { getAllPaymentsToDate, getDateObject } from "../redux/functions";
import styles from './styles';
import WaitingPage from './WaitingPage';

class SubmissionDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            currentDateObject: getDateObject(moment(new Date()).format("YYYY-MM-DD"))
        }
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.submission) === "string") this.props.submissionDetailsRequest(this.props.user.submission);
    }

    setDate(newDate) {
        this.setState({ markedDate: newDate, markedDateObject: getDateObject(moment(newDate).format("YYYY-MM-DD")) });
        this.setState({ allPayments: getAllPaymentsToDate(this.state.markedDateObject, this.props.user.submission.subscription) });
    }

    getPayment() {
        if (!this.state.allPayments) return (<Content><Text>No</Text></Content>)
        else return (
            <Content>
                <Text>{this.state.allPayments}</Text>
            </Content>
        )
    }

    getDateString(date) {
        return `${date.year} ${date.month} ${date.day}`
    }

    renderDetails = () => {
        let submission = this.props.user.submission;
        let content = this.getPayment();
        if (submission.subscription) {
            console.log("hi", this.state);
            return (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Customer name: {submission.subscription.name}</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Card>
                        <Left />
                        <CardItem>
                            <Left>
                                <Text style={styles.smallTitleText}>{submission.subscription.period} subscription: {submission.subscription.price} {submission.subscription.currency}</Text>
                            </Left>
                            <Right />
                        </CardItem>
                        <CardItem cardBody>
                            <Left />
                            <DatePicker
                                defaultDate={this.currentDate}
                                minimumDate={this.currentDate}
                                maximumDate={new Date(2030, 1, 1)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "blue" }}
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={(newDate) => this.setDate(newDate)}
                                disabled={false}
                            />
                            {content}
                            <Right />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Text style={styles.smallSubtitleText}>{submission.subscription.paymentType} with <IconAwesome active name="stripe-s" /></Text>
                            </Left>
                            <Body>
                            </Body>
                            <Right>
                                <Text style={styles.smallSubtitleText}>{this.getDateString(submission.subscription.date)}</Text>
                                <Text style={styles.smallSubtitleText}>{submission.subscription.time}</Text>
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
