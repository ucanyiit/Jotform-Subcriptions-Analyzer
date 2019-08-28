import axios from 'axios';
import { Container, Spinner, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import styles from './styles';


export default class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        let that = this;
        return axios.get('https://api.jotform.com/user/submission', {
            params: {
                apikey: this.props.user.content.apikey,
                id: this.props.user.formID
            }
        })
            .then(function (response) {
                that.setState({
                    isLoading: false,
                    submissions: response.data.content
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
        return (
            <Container>
                <Content>
                    <Text>
                        Form FOrm FORM FOARmA SFORM
                    </Text>
                </Content>
            </Container>
        )
    }

    render() {
        console.log(this.state);
        if (this.state.isLoading) return this.renderWaiting()
        else return this.renderDetails()
    }
}
