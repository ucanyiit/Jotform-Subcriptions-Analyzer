import { Body, Button, Container, Content, Header, Icon, Left, Right, Spinner, Text, Title } from 'native-base';
import React from 'react';
import { connect } from "react-redux";
import styles from './styles';

class FormDetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
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

export default connect(mapStateToProps)(FormDetailsPage);
