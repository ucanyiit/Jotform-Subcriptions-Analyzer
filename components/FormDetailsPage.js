import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Picker, Right, Text, Title, View } from 'native-base';
import React from 'react';
import { connect } from "react-redux";
import { formDetailsRequest, navigateTo } from "../redux/actions";
import { getAllPaymentsInNext } from "../redux/functions";
import styles from './styles';
import WaitingPage from './WaitingPage';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selected: "monthly" };
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.form) === "string") this.props.formDetailsRequest(this.props.user.form);
    }

    onValueChange(value: string) {
        this.setState({ selected: value });
    }

    renderGraph = (subscriptions) => {
        for (i in subscriptions) console.log(getAllPaymentsInNext({year: 2019, month:9, day: 9}, { month: 1 }, subscriptions[i]));
        return (
            <View>
                <Text>Hello</Text>
            </View>
        )
    }

    renderRow = submission => {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ page: 'SubmissionDetails', id: submission.id }) }} style={styles.productItem}>
                <Body>
                    <View>
                        <View>
                            <Text style={styles.smallTitleText}>{submission.subscription.period} {submission.subscription.price} {submission.subscription.currency}</Text>
                            <Text style={styles.smallSubtitleText}>{submission.id}</Text>
                        </View>
                    </View>
                </Body>
            </ListItem>
        );
    }

    renderSubmissions = () => {
        return (
            <Content>
                <Text style={styles.submisisonsTitleText}>Payments from this form</Text>
                <List>
                    {this.props.user.form.submissions && this.props.user.form.submissions.map(data => { return this.renderRow(data) })}
                </List>
            </Content>
        )
    }

    renderDetails = () => {
        let form = this.props.user.form;
        let submissions = this.renderSubmissions();
        let graph = this.renderGraph(form.subscriptions);

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{form.title}</Title>
                    </Body>
                    <Right>
                        <Picker
                            mode="dropdown"
                            style={{ color: '#fff', }}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}>
                            <Picker.Item label="Monthly" value="monthly" />
                            <Picker.Item label="Weekly" value="weekly" />
                        </Picker>
                    </Right>
                </Header>
                <Content>
                    {graph}
                    {submissions}
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
        formDetailsRequest: id => { dispatch(formDetailsRequest(id)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDetailsPage);
