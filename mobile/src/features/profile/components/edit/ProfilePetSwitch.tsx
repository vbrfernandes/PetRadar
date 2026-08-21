import React, { useEffect, useRef } from "react";

import { Animated, Pressable } from "react-native";

import { profileEditStyles as styles } from "../../styles/edit/profileEdit.styles";

interface ProfilePetSwitchProps {
  value: boolean;
  onChange: () => void;
}

function ProfilePetSwitch({ value, onChange }: ProfilePetSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 20 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  }, [value, translateX]);

  return (
    <Pressable
      onPress={onChange}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel="Possui pet"
      style={[styles.switchTrack, value && styles.switchTrackActive]}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
}

export default React.memo(ProfilePetSwitch);
