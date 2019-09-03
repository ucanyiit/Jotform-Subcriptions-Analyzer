import { Body, Button, Container, Content, Header, Icon, Left, List, ListItem, Right, Subtitle, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { formsRequest, navigateTo } from "../redux/actions";
import Logout from './LogoutButton';
import styles from './styles';
import WaitingPage from './WaitingPage';

class FormsPage extends Component {

    constructor(props) {
        super(props);
        if (!this.props.user.loggedIn) this.props.navigateTo({ navigation: this.props.navigation.navigate, page: 'Login' });
        else this.props.formsRequest();
    }

    renderRow = (form) => {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ navigation: this.props.navigation.navigate, page: 'FormDetails', id: form.id }) }} style={styles.productItem}>
                <Body>
                    <View>
                        <View>
                            <Text style={styles.smallTitleText}>{form.title}</Text>
                            <Text style={styles.smallSubtitleText}>{form.url}</Text>
                        </View>
                    </View>
                </Body>
            </ListItem>
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
                    <Right>
                        <Button transparent>
                            <Icon name='refresh' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <List>
                        {this.props.user.forms && this.props.user.forms.map(data => { return this.renderRow(data) })}
                    </List>
                </Content>
                <Logout />
            </Container>
        )
    }

    render() {
        if (this.props.user.isLoading) return <WaitingPage />
        else return this.renderForms()
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        formsRequest: () => { dispatch(formsRequest()) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsPage);