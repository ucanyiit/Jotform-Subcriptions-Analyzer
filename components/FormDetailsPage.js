import moment from 'moment';
import { Body, Button, Card, CardItem, Container, Content, DatePicker, Header, Icon, Left, List, ListItem, Right, Text, Title, View } from 'native-base';
import React from 'react';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { connect } from 'react-redux';
import { formDetailsRequest, navigateTo } from '../redux/actions';
import { getAllPaymentsToDateFromSubscriptions, getDateObject, getPaymentText } from '../redux/functions';
import styles from './styles';
import WaitingPage from './WaitingPage';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentDate: new Date() }
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.form) === 'string') this.props.formDetailsRequest(this.props.user.form);
    }

    setDate(newDate) {
        this.setState({ markedDate: newDate, markedDateObject: getDateObject(moment(newDate).format('YYYY-MM-DD')) });
        this.setState({ allPayments: getAllPaymentsToDateFromSubscriptions(this.state.markedDateObject, this.props.user.form.payments) });
    }

    getEarnings() {
        let text;
        if (!this.state.allPayments) return text = <Text style={styles.white20Text}>Please select a date</Text>;
        else text = <Text style={styles.white20Text}>{this.state.allPayments} {this.props.user.form.payments[0].currency}</Text>;
        return text
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
                    <Title style={styles.white}>{this.props.user.form.title}</Title>
                </Body>
                <Right />
            </Header>
        )
    }

    renderDatePickerCard() {
        return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Calculate earnings to the date</Text>
                </CardItem>
                <List>
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
                    <ListItem>
                        <Left />
                        <Button style={styles.orangeBackground} block onPress={() => this.props.navigateTo({ page: 'FormTimeline' })}>
                            <Text>Show Timeline</Text>
                        </Button>
                    </ListItem>
                </List>
            </Card>
        )
    }

    renderChart() {
        const data = [121, 91, 113, 244, 221, 52, 32, 45, 321, 21, 32, 413]
        return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Last payments</Text>
                </CardItem>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ height: 200, flexDirection: 'row' }}>
                        <YAxis
                            style={{ width: 32 }}
                            data={data}
                            contentInset={{ top: 24, bottom: 12 }}
                            svg={{ fontSize: 10, fill: '#fa8900' }}
                            min={0}
                            numberOfTicks={10}
                            formatLabel={value => value}
                        />
                        <BarChart
                            style={{ flex: 1, marginLeft: 0 }}
                            data={data}
                            svg={{ fill: '#fa8900' }}
                            contentInset={{ top: 24, bottom: 12 }}
                            yMin={0}
                        >
                            <Grid />
                        </BarChart>
                    </View>
                    <XAxis
                        style={{}}
                        data={data}
                        formatLabel={(value, index) => index + 1}
                        contentInset={{ left: 48, right: 16 }}
                        svg={{ fontSize: 10, fill: '#fa8900' }}
                    />
                </View>
            </Card>
        )
    }

    renderRow(submission) {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                <Body>
                    <Text style={styles.listTitleText}>{getPaymentText(submission.payment)}</Text>
                    <Text style={styles.listSubtitleText}>{submission.created_at}</Text>
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
                <Left><Text style={styles.listTitleText}>Payment Type:</Text></Left>
                <Text style={styles.listTitleText}>Subscription</Text>
            </ListItem>
        )
        else if (form.paymentType && form.paymentType == 'product') details = (
            <View>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Payment Type:</Text></Left>
                    <Text style={styles.listTitleText}>One Time Payment</Text>
                </ListItem>
                <ListItem>
                    <Left><Text style={styles.listTitleText}>Total Revenue:</Text></Left>
                    <Text style={styles.listTitleText}>{this.getTotalEarnings(form.payments)}</Text>
                </ListItem>
            </View>
        )

        return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Details</Text>
                </CardItem>
                <List>
                    <ListItem>
                        <Left><Text style={styles.listTitleText}>Form: </Text></Left>
                        <Text style={styles.listTitleText}>{form.title}</Text>
                    </ListItem>
                    <ListItem>
                        <Left><Text style={styles.listTitleText}>Form ID: </Text></Left>
                        <Text style={styles.listTitleText}>{form.id}</Text>
                    </ListItem>
                    <ListItem>
                        <Left><Text style={styles.listTitleText}>Created at:</Text></Left>
                        <Text style={styles.listTitleText}>{form.created_at}</Text>
                    </ListItem>
                    {form.paymentType && details}
                </List>
            </Card>
        )
    }

    renderSubmissions() {
        if (!this.props.user.form.submissions) return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Submissions to this form</Text>
                </CardItem>
                <List>
                    <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                        <Body>
                            <Text style={styles.listTitleText}>No submissions for this form</Text>
                        </Body>
                    </ListItem>
                </List>
            </Card>
        )
        else return (
            <Card transparent style={styles.card}>
                <CardItem style={styles.cardHeader}>
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
            <Container style={styles.darkBackground}>
                {this.renderHeader()}
                <Content>
                    {this.props.user.form.paymentType == "subscription" && this.renderDatePickerCard()}
                    {this.props.user.form.paymentType == "product" && this.renderChart()}
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
