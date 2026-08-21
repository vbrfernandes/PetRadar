import React, { useRef } from 'react';

import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import { theme } from '../../../theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.action,
    borderRadius: theme.radius.button,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.buttonGlow,
  },

  text: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

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
