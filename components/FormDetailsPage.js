import moment from 'moment';
import { Body, Button, Card, CardItem, Container, Content, DatePicker, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import React from 'react';
import { connect } from 'react-redux';
import { formDetailsRequest, navigateTo } from '../redux/actions';
import { getAllPaymentsToDateFromSubscriptions, getDateObject, getPaymentText } from '../redux/functions';
import styles from './styles';
import WaitingPage from './WaitingPage';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            currentDateObject: getDateObject(moment(new Date()).format('YYYY-MM-DD'))
        }
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.form) === 'string') this.props.formDetailsRequest(this.props.user.form);
    }

    setDate(newDate) {
        this.setState({ markedDate: newDate, markedDateObject: getDateObject(moment(newDate).format('YYYY-MM-DD')) });
        this.setState({ allPayments: getAllPaymentsToDateFromSubscriptions(this.state.markedDateObject, this.props.user.form.payments) });
    }

    getEarnings() {
        let text;
        if (!this.state.allPayments) return text = <Text style={styles.dateText}>Please select a date</Text>;
        else text = <Text style={styles.dateText}>{this.state.allPayments} {this.props.user.form.payments[0].currency}</Text>;
        return text
    }

    renderHeader() {
        return (
            <Header>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>{this.props.user.form.title}</Title>
                </Body>
                <Right />
            </Header>
        )
    }

    renderDatePickerCard() {
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
                    {this.getEarnings()}
                    <Right />
                </CardItem>
                <CardItem bordered>
                    <Left />
                    <Button style={styles.button} block onPress={() => this.props.navigateTo({ page: 'FormTimeline' })}>
                        <Text>Show Timeline</Text>
                    </Button>
                    <Right />
                </CardItem>
            </Card>
        )
    }

    renderRow(submission) {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                <Body>
                    <Text style={styles.smallTitleText}>{getPaymentText(submission.payment)}</Text>
                    <Text style={styles.smallSubtitleText}>{submission.created_at}</Text>
                </Body>
            </ListItem>
        );
    }

    getTotalEarnings(payments) {
        let total = 0;
        for (payment of payments) total += parseFloat(payment.total);
        return total;
    }

    renderDetailsList() {
        let form = this.props.user.form, paymentType = "";
        if (form.paymentType && form.paymentType == 'subscription') details = (
            <ListItem>
                <Left><Text style={styles.smallTitleTexpt}>Payment Type:</Text></Left>
                <Text style={styles.smallTitleText}>Subscription</Text>
            </ListItem>
        )
        else if (form.paymentType && form.paymentType == 'product') details = (
            <View>
                <ListItem>
                    <Left><Text style={styles.smallTitleTexpt}>Payment Type:</Text></Left>
                    <Text style={styles.smallTitleText}>One Time Payment</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.smallTitleTexpt}>Total Revenue:</Text></Left>
                    <Text style={styles.smallTitleText}>{this.getTotalEarnings(form.payments)}</Text>
                </ListItem>
            </View>
        )

        return (
            <Card style={styles.dateCard}>
                <CardItem bordered style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Details</Text>
                </CardItem>
                <List>
                    <ListItem>
                        <Left><Text style={styles.smallTitleText}>Form: </Text></Left>
                        <Text style={styles.smallTitleText}>{form.title}</Text>
                    </ListItem>
                    <ListItem>
                        <Left><Text style={styles.smallTitleText}>Form ID: </Text></Left>
                        <Text style={styles.smallTitleText}>{form.id}</Text>
                    </ListItem>
                    <ListItem>
                        <Left><Text style={styles.smallTitleText}>Created at:</Text></Left>
                        <Text style={styles.smallTitleText}>{form.created_at}</Text>
                    </ListItem>
                    {form.paymentType && details}
                </List>
            </Card>
        )
    }

    renderSubmissions() {
        if (!this.props.user.form.submissions) return (
            <Card style={styles.dateCard}>
                <CardItem bordered style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Submissions to this form</Text>
                </CardItem>
                <List>
                    <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                        <Body>
                            <Text style={styles.smallTitleText}>No submissions for this form</Text>
                        </Body>
                    </ListItem>
                </List>
            </Card>
        )
        else return (
            <Card style={styles.dateCard}>
                <CardItem bordered style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Submissions to this form</Text>
                </CardItem>
                <List>
                    {this.props.user.form.submissions && this.props.user.form.submissions.map(data => { return this.renderRow(data) })}
                </List>
            </Card>
        )
    }

    render() {
        if (this.props.user.isLoading) return <WaitingPage />
        else return (
            <Container>
                {this.renderHeader()}
                <Content>
                    {this.props.user.form.paymentType == "subscription" && this.renderDatePickerCard()}
                    {this.renderDetailsList()}
                    {this.renderSubmissions()}
                </Content>
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
        formDetailsRequest: id => { dispatch(formDetailsRequest(id)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDetailsPage);
