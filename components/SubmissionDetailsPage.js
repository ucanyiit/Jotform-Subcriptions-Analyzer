import moment from 'moment';
import { Body, Button, Card, CardItem, Container, DatePicker, Header, Icon, Left, List, ListItem, Right, Text, Title } from 'native-base';
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
        let title = 'Submission Details';
        return (
            <Header>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>{title}</Title>
                </Body>
                <Right />
            </Header>
        )
    }

    getEarnings() {
        let text;
        if (!this.state.allPayments) return text = <Text style={styles.dateText}>Please select a date</Text>;
        else text = <Text style={styles.dateText}>{this.state.allPayments} {this.props.user.submission.payment.currency}</Text>;
        return text
    }

    renderDatePickerCard() {
        let earnings = this.getEarnings();
        return (
            <Card style={styles.dateCard}>
                <CardItem bordered style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Calculate earnings to the date</Text>
                </CardItem>
                <CardItem bordered>
                    <Left />
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
                    <Right />
                </CardItem>
                <CardItem bordered>
                    <Left />
                    {earnings}
                    <Right />
                </CardItem>
            </Card>
        )
    }

    getDateString(date) {
        return `${date.year} ${date.month} ${date.day}`
    }

    renderProductRow = (product) => {
        return (
            <ListItem style={styles.productItem}>
                <Left><Text style={styles.smallTitleText}>{product.name} ( {product.price} {product.currency} )</Text></Left>
                <Text style={styles.smallTitleText}>{product.quantity}</Text>
            </ListItem>
        );
    }

    renderProducts = () => {
        return (
            <Card style={styles.dateCard}>
                <CardItem bordered style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Products Sold</Text>
                </CardItem><List>
                    {this.props.user.submission.payment.products.map(data => { return this.renderProductRow(data) })}
                </List>
            </Card>
        )
    }


    renderDetailsList() {
        let submission = this.props.user.submission;
        if (submission.payment && submission.payment.paymentType == 'subscription') {
            let payment = submission.payment;
            return (
                <Card style={styles.dateCard}>
                    <CardItem bordered style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Details</Text>
                    </CardItem>
                    <List>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Submission ID: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.id}</Text>
                        </ListItem>
                        <ListItem button onPress={() => { this.props.navigateTo({ page: 'FormDetails', id: submission.form.id }) }}>
                            <Left><Text style={styles.smallTitleText}>Form: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.form.title}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>{payment.period} payment:</Text></Left>
                            <Text style={styles.smallTitleText}>{payment.price} {payment.currency}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Customer name: </Text></Left>
                            <Text style={styles.smallTitleText}>{payment.name}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Subscription start date: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.created_at}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Payment service: </Text></Left>
                            <IconAwesome active name='stripe-s' />
                        </ListItem>
                    </List>
                </Card>
            )
        }
        else if (submission.payment && submission.payment.paymentType == 'product') {
            let payment = submission.payment;
            return (
                <Card style={styles.dateCard}>
                    <CardItem bordered style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Details</Text>
                    </CardItem>
                    <List>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Submission ID: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.id}</Text>
                        </ListItem>
                        <ListItem button onPress={() => { this.props.navigateTo({ page: 'FormDetails', id: submission.form.id }) }}>
                            <Left><Text style={styles.smallTitleText}>Form: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.form.title}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Total Payment:</Text></Left>
                            <Text style={styles.smallTitleText}>{payment.total} {payment.currency}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Payment date: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.created_at}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Payment service: </Text></Left>
                            <IconAwesome active name='stripe-s' />
                        </ListItem>
                    </List>
                </Card>
            )
        }
        else if (typeof submission != 'string') {
            return (
                <Container>
                    <List>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Submission ID: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.id}</Text>
                        </ListItem>
                        <ListItem>
                            <Left><Text style={styles.smallTitleText}>Form: </Text></Left>
                            <Text style={styles.smallTitleText}>{submission.form.title}</Text>
                        </ListItem>
                    </List>
                    <Card>
                        <CardItem>
                            <Left />
                            <Text style={styles.smallSubtitleText}>There's no additional info about this submission since it's not a payment or subscription</Text>
                            <Right />
                        </CardItem>
                    </Card>
                </Container>
            )
        }
        else return (
            <WaitingPage />
        )

    }

    renderDetails() {
        if (this.props.user.submission.payment && this.props.user.submission.payment.paymentType == 'subscription') return (
            <Container>
                {this.renderDetailsList()}
                {this.renderDatePickerCard()}
            </Container>
        )
        if (this.props.user.submission.payment && this.props.user.submission.payment.paymentType == "product") return (
            <Container>
                {this.renderDetailsList()}
                {this.renderProducts()}
            </Container>
        )
        else return this.renderDetailsList()
    }

    render() {
        return (
            <Container>
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
