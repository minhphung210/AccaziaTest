import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';

const buttonList = [
  require('./icon/user.png'),
  require('./icon/calendar.png'),
  require('./icon/place.png'),
  require('./icon/call.png'),
  require('./icon/lock.png'),
];

const Button = ({icon, iconStyle, onPress, index}) => (
  <TouchableOpacity onPress={() => onPress(index)} style={{padding: 10}}>
    <Image source={icon} style={[{height: 24, width: 24}, iconStyle]} />
  </TouchableOpacity>
);

class Card extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      indexShow: 0,
      title: '',
      description: '',
    };
  }

  async componentDidMount() {
    const {card} = this.props;
    if (card < 3) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    const {onLoadDone} = this.props;
    const res = await axios.get('https://randomuser.me/api/0.4/?randomapi');
    const user = res.data.results[0].user;
    const name =
      lodash.get(user, 'name.first') + ' ' + lodash.get(user, 'name.last');
    onLoadDone(user);
    this.setState({
      user: user,
      title: user.gender,
      description: name,
    });
  };

  buttonPress = (index) => {
    const {user} = this.state;
    const name =
      lodash.get(user, 'name.first') + ' ' + lodash.get(user, 'name.last');
    const dob = moment(user.dob).format('DD MMM YYYY'); //parse integer
    console.log(dob);
    switch (index) {
      case 0:
        this.setState({
          title: user.gender,
          description: name,
          indexShow: index,
        });
        break;
      case 1:
        this.setState({
          title: 'Date off Birth',
          description: dob.toString(),
          indexShow: index,
        });
        break;
      case 2:
        this.setState({
          title: 'My Address is',
          description: user.location.street + ', ' + user.location.city,
          indexShow: index,
        });
        break;
      case 3:
        this.setState({
          title: 'My Phone is',
          description: user.phone,
          indexShow: index,
        });
        break;
      case 4:
        this.setState({
          title: '',
          description: '',
          indexShow: index,
        });
      default:
    }
  };

  renderListInforBtn = () =>
    buttonList.map((item, index) => (
      <Button
        key={index}
        icon={item}
        index={index}
        iconStyle={{
          tintColor: index === this.state.indexShow ? 'green' : 'grey',
        }}
        onPress={this.buttonPress}
      />
    ));

  render() {
    const {card} = this.props;
    const {user, title, description} = this.state;
    const name = lodash.get(user, 'name.last');
    const avatar = lodash.get(user, 'picture');

    return (
      <View style={styles.card}>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderColor: '#E8E8E8',
          }}>
          <View
            style={{
              bottom: -60,
              height: 200,
              width: 200,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              backgroundColor: 'white',
              borderColor: '#E8E8E8',
            }}>
            <Image
              source={{uri: avatar}}
              style={{
                height: 190,
                width: 190,
                borderRadius: 95,
              }}
            />
          </View>
        </View>
        <View
          style={{flex: 2, justifyContent: 'flex-end', alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: 'grey', fontWeight: '500'}}>
            {title}
          </Text>
          <Text style={{fontSize: 20, marginTop: 15, fontWeight: '500'}}>
            {description}
          </Text>
          <View style={{flexDirection: 'row', marginVertical: 50}}>
            {this.renderListInforBtn()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default Card;
