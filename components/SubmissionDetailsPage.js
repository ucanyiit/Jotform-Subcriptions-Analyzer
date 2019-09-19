import moment from 'moment';
import { Body, Button, Card, CardItem, Container, DatePicker, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import React from 'react';
import IconAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import { connect } from 'react-redux';
import { navigateTo, submissionDetailsRequest } from '../redux/actions';
import { getAllPaymentsToDateFromSubscription, getDateObject } from '../redux/functions';
import styles from './styles';
import WaitingPage from './WaitingPage';

class SubmissionDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            currentDateObject: getDateObject(moment(new Date()).format('YYYY-MM-DD'))
        }
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.submission) === 'string') this.props.submissionDetailsRequest(this.props.user.submission);
    }

    setDate(newDate) {
        this.setState({ markedDate: newDate, markedDateObject: getDateObject(moment(newDate).format('YYYY-MM-DD')) });
        this.setState({ allPayments: getAllPaymentsToDateFromSubscription(this.state.markedDateObject, this.props.user.submission.payment) });
    }

    renderHeader() {
        return (
            <Header androidStatusBarColor='#fa8900' style={styles.orangeBackground}>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title style={styles.white}>Submission Details</Title>
                </Body>
                <Right />
            </Header>
        )
    }

    getEarnings() {
        let text;
        if (!this.state.allPayments) return text = <Text style={styles.white20Text}>Please select a date</Text>;
        else text = <Text style={styles.white20Text}>{this.state.allPayments} {this.props.user.submission.payment.currency}</Text>;
        return text
    }

    renderDatePickerCard() {
        return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Calculate earnings to the date</Text>
                </CardItem>
                <ListItem>
                    <Left>
                        <DatePicker
                            defaultDate={this.currentDate}
                            minimumDate={this.currentDate}
                            maximumDate={new Date(2030, 1, 1)}
                            locale={'en'}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={'fade'}
                            androidMode={'spinner'}
                            placeHolderText='Select date'
                            textStyle={styles.datePicker}
                            placeHolderTextStyle={styles.datePicker}
                            onDateChange={(newDate) => this.setDate(newDate)}
                            disabled={false}
                        />
                    </Left>
                    {this.getEarnings()}
                </ListItem>
            </Card>
        )
    }

    getDateString(date) {
        return `${date.year} ${date.month} ${date.day}`
    }

    renderProductRow = (product) => {
        return (
            <ListItem style={styles.productItem}>
                <Left><Text style={styles.listTitleText}>{product.name} ( {product.price} {product.currency} )</Text></Left>
                <Text style={styles.listTitleText}>{product.quantity}</Text>
            </ListItem>
        );
    }

    renderProducts = () => {
        return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Products Sold</Text>
                </CardItem>
                <List>
                    {this.props.user.submission.payment.products.map(data => { return this.renderProductRow(data) })}
                </List>
            </Card>
        )
    }

    renderSubscriptionDetails(payment) {
        return (
            <View>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>{payment.period} payment:</Text></Left>
                    <Text style={styles.listTitleText}>{payment.price} {payment.currency}</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Customer name: </Text></Left>
                    <Text style={styles.listTitleText}>{payment.info.firstname} {payment.info.lastname}</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Subscription start date: </Text></Left>
                    <Text style={styles.listTitleText}>{submission.created_at}</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Payment service: </Text></Left>
                    <IconAwesome active name='stripe-s' />
                </ListItem>
            </View>
        )
    }

    renderProductDetails(payment) {
        return (
            <View>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Total Payment:</Text></Left>
                    <Text style={styles.listTitleText}>{payment.total} {payment.currency}</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Customer name: </Text></Left>
                    <Text style={styles.listTitleText}>{payment.info.firstname} {payment.info.lastname}</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Payment date: </Text></Left>
                    <Text style={styles.listTitleText}>{submission.created_at}</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Payment service: </Text></Left>
                    <IconAwesome active name='stripe-s' />
                </ListItem>
            </View>
        )
    }

    renderNoAdditionalInfo() {
        return (
            <Card transparent style={styles.card}>
                <CardItem>
                    <Left />
                    <Text style={styles.smallSubtitleText}>There's no additional info about this submission since it's not a payment or subscription</Text>
                    <Right />
                </CardItem>
            </Card>
        )
    }

    renderDetails() {
        let submission = this.props.user.submission, details, additionalInfo;
        if (typeof submission == 'string') return <WaitingPage />

        if (submission.payment && submission.payment.paymentType == 'subscription') {
            additionalInfo = this.renderDatePickerCard();
            details = this.renderSubscriptionDetails(submission.payment);
        }
        else if (submission.payment && submission.payment.paymentType == 'product') {
            additionalInfo = this.renderProducts();
            details = this.renderProductDetails(submission.payment);
        }
        else additionalInfo = this.renderNoAdditionalInfo();

        detailsList = (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Details</Text>
                </CardItem>
                <List>
                    <ListItem>
                        <Left><Text style={styles.listTitleText}>Submission ID: </Text></Left>
                        <Text style={styles.listTitleText}>{submission.id}</Text>
                    </ListItem>
                    <ListItem>
                        <Left><Text style={styles.listTitleText}>Form: </Text></Left>
                        <Text style={styles.listTitleText}>{submission.form.title}</Text>
                    </ListItem>
                    {details}
                </List>
            </Card>
        )

        return (
            <View>
                {additionalInfo}
                {detailsList}
            </View>
        )
    }

    render() {
        return (
            <Container style={styles.darkBackground}>
                {this.renderHeader()}
                {this.renderDetails()}
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
        submissionDetailsRequest: id => { dispatch(submissionDetailsRequest(id)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionDetailsPage);
