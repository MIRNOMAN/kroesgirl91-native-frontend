import React from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../constants/colors";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  background: ImageSourcePropType;
  onPress?: () => void;
}

export default function ServiceCard({
  title,
  subtitle,
  image,
  background,
  onPress,
}: ServiceCardProps) {
  return (
    <ImageBackground
      source={background}
      style={[styles.container]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingRight: 4,
    paddingLeft: 16,
    paddingTop: 16,
    flex: 1,
    minHeight: 100,
    overflow: "hidden",
  },
  backgroundImage: {
    borderRadius: 16,
  },
  touchable: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  imageContainer: {
    alignSelf: "flex-end",
    marginBottom: 0,
  },
  image: {
    width: 100,
    height: 90,
  },
});
