import moment from 'moment';
import { Body, Button, Container, Header, Icon, Left, Right, Title, Content } from 'native-base';
import React from 'react';
import Timeline from 'react-native-timeline-flatlist';
import { connect } from 'react-redux';
import { getAllPaymentsToDateFromSubscriptions, getDateObject, getLastXPaymentsFromSubscriptions } from '../redux/functions';
import styles from './styles';
import WaitingPage from './WaitingPage';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            currentDateObject: getDateObject(moment(new Date()).format('YYYY-MM-DD'))
        }
    }


    setDate(newDate) {
        this.setState({ markedDate: newDate, markedDateObject: getDateObject(moment(newDate).format('YYYY-MM-DD')) });
        this.setState({ allPayments: getAllPaymentsToDateFromSubscriptions(this.state.markedDateObject, this.props.user.form.payments) });
    }

    renderHeader() {
        return (
            <Header  androidStatusBarColor='#fa8900' style={styles.orangeBackground}>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>Payments from {this.props.user.form.title}</Title>
                </Body>
                <Right />
            </Header>
        )
    }

    render() {
        if (this.props.user.isLoading) return <WaitingPage />
        else return (
            <Container style={styles.darkBackground}>
                {this.renderHeader()}
                <Content style={styles.timeLineMargin}>
                    <Timeline
                        options={{
                            removeClippedSubviews: false
                        }}
                        lineColor='#fa8900'
                        timeStyle={{ color: '#CEC9AB' }}
                        descriptionStyle={{ color: '#CEC9AB' }}
                        timeContainerStyle={{ minWidth: 128 }}
                        titleStyle={{ color: '#fa8900' }}
                        data={getLastXPaymentsFromSubscriptions(500, this.props.user.form.payments)}
                        style={styles.darkBackground}
                    />
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

export default connect(mapStateToProps)(FormDetailsPage);
