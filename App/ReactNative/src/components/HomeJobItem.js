import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
} from 'react-native';

import {styles} from '../styles/HomeJobItem.style';
import I18n from '../locale-data/i18n';
import UserAvatar from './UserAvatar';

export default class HomeJobItem extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <View style={styles.jobItemContainer}>
        <Image style={styles.mainImg} source={require('../image/sample_job.png')} />
        <Text style={styles.nameText}>{I18n.t('Waitress')}</Text>
        <Text style={styles.priceText}>{I18n.t('Interim')} - 1700€/ M</Text>
        <Text style={styles.addressText}>Bordeaux</Text>
        <Image style={styles.loveImg} source={require('../image/ic_love.png')} />
        <View style={styles.responseView}>
          <Text style={styles.responseCount}>{I18n.t('Apply')}</Text>
        </View>
        <View style={styles.infoView}>
          <Text style={styles.info}>ll y a 2m</Text>
        </View>
        <View style={styles.avatarView}>
          <UserAvatar/>
        </View>
      </View>
    );
  }
}
