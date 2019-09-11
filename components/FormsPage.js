import { Body, Container, Content, Header, Icon, Left, List, ListItem, Picker, Right, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import { formsRequest, navigateTo } from "../redux/actions";
import Logout from './LogoutButton';
import { WaitingPage } from './pages';
import styles from './styles';

class FormsPage extends Component {

    constructor(props) {
        super(props);
        this.state = { selected: "subscription" };
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else this.props.formsRequest(this.state.selected);
    }

    onValueChange(value: string) {
        this.setState({ selected: value });
        this.props.formsRequest(value);
    }

    renderRow = (form) => {
        return (
            <ListItem button onPress={() => { this.props.navigateTo({ page: 'FormDetails', id: form.id }) }} style={styles.productItem}>
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
        return (<List>
            {this.props.user.forms && this.props.user.forms.map(data => { return this.renderRow(data) })}
        </List>)
    }

    render() {
        let content;
        if (this.props.user.isLoading) content = <WaitingPage />
        else content = this.renderForms();
        return (
            <Container>
                <Header>
                    <Left />
                    <Body>
                        <Title>Forms</Title>
                    </Body>
                    <Right>
                        <Picker
                            mode="dropdown"
                            style={{ color: '#fff', }}
                            selectedValue={this.state.selected}
                            onValueChange={this.onValueChange.bind(this)}>
                            <Picker.Item label="All Forms" value="all" />
                            <Picker.Item label="Subscriptions" value="subscription" />
                            <Picker.Item label="One Time Payments" value="product" />
                        </Picker>
                    </Right>
                </Header>
                <Content>
                    {content}
                </Content>
                <Logout />
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
        formsRequest: content => { dispatch(formsRequest(content)) },
        navigateTo: content => { dispatch(navigateTo(content)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsPage);