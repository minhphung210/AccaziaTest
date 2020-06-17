/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  StatusBar,
  AppState,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-community/async-storage';

const fakeData = [1, 2, 3];

console.disableYellowBox = true;

import Card from './Card';

class App extends Component {
  constructor() {
    super();
    this.item1 = null;
    this.item2 = null;
    this.item3 = null;
    this.favorites = [];
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    const value = await AsyncStorage.getItem('favoriteList');
    if (value !== null) {
      this.favorites = JSON.parse(value);
      console.log(this.favorites);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'inactive') {
      AsyncStorage.setItem('favoriteList', JSON.stringify(this.favorites));
    }
  };

  onLoadDone = (e, index) => {
    if (index === 1) {
      this.item1 = e;
    }
    if (index === 2) {
      this.item2 = e;
    }
    if (index === 3) {
      this.item3 = e;
    }
  };

  onSwipeRight = (index) => {
    if (index === 0) {
      this.favorites.push(this.item1);
    }
    if (index === 1) {
      this.favorites.push(this.item2);
    }
    if (index === 2) {
      this.favorites.push(this.item3);
    }
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.container}>
            <Swiper
              infinite
              cards={fakeData}
              renderCard={(card) => (
                <Card
                  card={card}
                  ref={(ref) => (this.CardRef = ref)}
                  onLoadDone={(e) => this.onLoadDone(e, card)}
                />
              )}
              onSwiped={(cardIndex) => {
                this.CardRef.fetchData();
              }}
              onSwipedRight={this.onSwipeRight}
              cardIndex={0}
              backgroundColor={'#4FD0E9'}
              stackSize={3}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent',
  },
});

export default App;
