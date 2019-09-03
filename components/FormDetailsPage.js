import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Text, Title } from 'native-base';
import React from 'react';
import { connect } from "react-redux";
import { formDetailsRequest } from "../redux/actions";
import styles from './styles';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        if (typeof (this.props.user.form) === "string") this.props.formDetailsRequest(this.props.user.form, this.props.user.content.appKey);
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
        if (this.props.user.isLoading) return this.renderWaiting();
        else return this.renderDetails();
    }
}

const mapStateToProps = state => {
    const user = state.user;
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        formDetailsRequest: (id, apikey) => { dispatch(formDetailsRequest(id, apikey)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormDetailsPage);
