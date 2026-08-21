import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export const useMapAnimations = () => {
  const searchFocusAnim = useRef(new Animated.Value(0)).current;
  const discoveryAnim = useRef(new Animated.Value(1)).current;
  const [discoveryVisible, setDiscoveryVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(discoveryAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setDiscoveryVisible(false);
      });
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [discoveryAnim]);

  const handleSearchFocus = useCallback(() => {
    Animated.timing(searchFocusAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [searchFocusAnim]);

  const handleSearchBlur = useCallback(() => {
    Animated.timing(searchFocusAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [searchFocusAnim]);

  return {
    searchFocusAnim,
    discoveryAnim,
    discoveryVisible,
    handleSearchFocus,
    handleSearchBlur,
  };
};
