import React, { useRef } from 'react';

import {
  Animated,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  animatedCTAStyles as styles,
} from './styles/components.styles';

interface Props {
  title: string;
  onPress: () => void;
  style?: object;
}

export default function AnimatedCTA({
  title,
  onPress,
  style,
}: Props) {
  const scaleAnim = useRef(
    new Animated.Value(1),
  ).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.button,
          style,
          {
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        <Text style={styles.text}>
          {title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}