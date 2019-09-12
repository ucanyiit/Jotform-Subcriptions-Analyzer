import moment from 'moment';
import { Body, Button, Card, CardItem, Container, Content, Header, Icon, Left, Right, Title } from 'native-base';
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
            <Header>
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
            <Container>
                {this.renderHeader()}
                <Content>
                    <Card style={styles.dateCard}>
                        <CardItem>
                            <Timeline
                                options={{
                                    removeClippedSubviews: false
                                }}
                                timeContainerStyle={{ minWidth: 128 }}
                                data={getLastXPaymentsFromSubscriptions(500, this.props.user.form.payments)}
                            />
                        </CardItem>
                    </Card>
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
