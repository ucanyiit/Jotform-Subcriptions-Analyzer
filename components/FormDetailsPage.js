import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title } from 'native-base';
import React from 'react';
import { connect } from "react-redux";
import { formDetailsRequest, navigateTo } from "../redux/actions";
import WaitingPage from './WaitingPage';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        if (!this.props.user.loggedIn) this.props.navigateTo({ page: 'Login' });
        else if (typeof (this.props.user.form) === "string") this.props.formDetailsRequest(this.props.user.form);
    }

    renderDetails = () => {
        let form = this.props.user.form;
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
                            <Text note>{form.url}</Text>
                        </Button>
                    </Left>
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
