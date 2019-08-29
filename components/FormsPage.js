import axios from 'axios';
import { Body, Container, Content, Header, Left, List, ListItem, Right, Spinner, Subtitle, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { updateFormDetails } from "../redux/actions";
import styles from './styles';
import Logout from './LogoutButton';

class FormsPage extends Component {

    constructor(props) {
        super(props);
        that.setState({ isLoading: true });
    }

    componentDidMount() {
        let that = this;
        // that.props.user.content.appKey = '8876d82ca5bc5f1ded14347d80c49f4c'; // for testing purposes
        return axios.get('https://api.jotform.com/user/forms', {
            params: {
                apikey: this.props.user.content.appKey
            }
        })
            .then(function (response) {
                that.setState({
                    isLoading: false,
                    forms: response.data.content
                })
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    onListItemPress = (id) => {
        this.props.updateFormDetails(id);
        this.props.navigation.navigate('FormDetails');
    }

    renderRow = (formData) => {
        return (
            <ListItem button onPress={() => { this.onListItemPress(formData.id) }} style={styles.productItem}>
                <Body>
                    <View>
                        <View>
                            <Text style={styles.smallTitleText}>{formData.title}</Text>
                            <Text style={styles.smallSubtitleText}>{formData.url}</Text>
                        </View>
                    </View>
                </Body>
            </ListItem>
        );
    }

    renderWaiting = () => {
        return (
            <Container style={styles.inputItem}>
                <Text style={styles.pleaseText}>Waiting for response...</Text>
                <Spinner />
            </Container>
        );
    }

    renderForms = () => {
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Forms</Title>
                        <Subtitle>Subtitle</Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <List>
                        {
                            this.state.forms && this.state.forms.map(data => {
                                return this.renderRow(data)
                            })
                        }
                    </List>
                </Content>
                <Logout />
            </Container>
        )
    }

    render() {
        console.log(this.props);
        console.log(this.state);
        if (this.state.isLoading) return this.renderWaiting()
        else return this.renderForms()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

export default connect(mapStateToProps, { updateFormDetails })(FormsPage);