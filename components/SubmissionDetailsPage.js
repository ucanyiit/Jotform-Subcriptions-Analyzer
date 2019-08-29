import axios from 'axios';
import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Text, Title } from 'native-base';
import React from 'react';
import styles from './styles';
import { connect } from "react-redux";


class SubmissionDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        that.setState({ isLoading: true });
    }

    componentDidMount() {
        let that = this;
        console.log(that.props.user.submissionID);
        // that.props.user.content.appKey = '8876d82ca5bc5f1ded14347d80c49f4c'; // for testing purposes
        return axios.get(`https://api.jotform.com/submission/${that.props.user.submissionID}`, {
            params: {
                apiKey: this.props.user.content.appKey
            }
        })
            .then(function (response) {
                that.setState({
                    isLoading: false,
                    submission: response.data.content
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    renderWaiting = () => {
        return (
            <Container style={styles.inputItem}>
                <Text style={styles.pleaseText}>Waiting for response...</Text>
                <Spinner />
            </Container>
        );
    }

    renderDetails = () => {
        console.log(this.state.submission);
        let submission = this.state.submission;
        console.log(submission)
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={ () => this.props.navigation.goBack()}>
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
        console.log(this.state);
        if (this.state.isLoading) return this.renderWaiting()
        else if (this.props.user.submissionID!=this.state.submission.id) {
            this.setState({
                isLoading: true
            });
            return this.renderWaiting();
        }
        else return this.renderDetails()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

export default connect(mapStateToProps)(SubmissionDetailsPage);
