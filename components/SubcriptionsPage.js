import axios from 'axios';
import { Body, Button, Container, Content, Left, ListItem, Right, Text } from 'native-base';
import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from './styles';

export default class SubcriptionsPage extends Component {

    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        let that = this;
        return axios.get('https://api.jotform.com/user/forms', {
            params: {
                apikey: "8876d82ca5bc5f1ded14347d80c49f4c"
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


    render() {
        if (this.state.isLoading) return (
            <Container>
                <Text>
                    Loading...
                </Text>
            </Container>
        )
        else return (
            <Container>
                <Content>
                    <ListItem icon style={styles.productItem}>
                        <Left>
                            <Icon size={32} name="stripe-s" color="#555" />
                        </Left>
                        <Body>
                            <View style={styles.listItemView}>
                                <View style={{ flex: 9, justifyContent: 'center' }}>
                                    <Text style={styles.productText}>
                                        Product 1
                                </Text>
                                    <Text style={styles.nameText}>
                                        Yiğitcan Uçan
                                </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Right style={{ justifyContent: 'center' }}>
                                        <Button onPress={() => this.props.navigation.navigate('Details')}>
                                            <Text style={styles.priceText}>4.99$</Text>
                                        </Button>
                                    </Right>
                                </View>
                            </View>
                        </Body>
                    </ListItem>

                    <ListItem icon style={styles.productItem}>
                        <Left>
                            <Icon size={32} name="paypal" color="#555" />
                        </Left>
                        <Body>
                            <View style={styles.listItemView}>
                                <View style={{ flex: 9, justifyContent: 'center' }}>
                                    <Text style={styles.productText}>
                                        Product 2
                                    </Text>
                                    <Text style={styles.nameText}>
                                        Yiğitcan Uçan
                                    </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Right style={{ justifyContent: 'center' }}>
                                        <Text style={styles.priceText}>12.99$</Text>
                                    </Right>
                                </View>
                            </View>
                        </Body>
                    </ListItem>

                    <ListItem icon style={styles.productItem}>
                        <Left>
                            <Icon size={32} name="paypal" color="#555" />
                        </Left>
                        <Body>
                            <View style={styles.listItemView}>
                                <View style={{ flex: 9, justifyContent: 'center' }}>
                                    <Text style={styles.productText}>
                                        Product 3
                                    </Text>
                                    <Text style={styles.nameText}>
                                        Yiğitcan Uçan
                                    </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Right style={{ justifyContent: 'center' }}>
                                        <Text style={styles.priceText}>6.99$</Text>
                                    </Right>
                                </View>
                            </View>
                        </Body>
                    </ListItem>

                </Content>
            </Container>
        );
    }
}