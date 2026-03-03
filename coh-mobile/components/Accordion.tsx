import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

export default function Accordion({ title, children }: AccordionProps) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );
    setOpen(!open);
  };

  return (
    <View className="mb-4 w-full">
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between p-4 rounded-2xl bg-gray-200"
        style={({ pressed }: { pressed: boolean }) => ({
          backgroundColor: pressed ? "#d1d5db" : "#e5e7eb",
        })}
      >
        <Text className="text-lg font-semibold">{title}</Text>

        <Feather
          name="chevron-down"
          size={22}
          style={{
            transform: [{ rotate: open ? "180deg" : "0deg" }],
          }}
        />
      </Pressable>

      {open && (
        <View className="mt-2 p-4 bg-gray-100 rounded-2xl">
          {children}
        </View>
      )}
    </View>
  );
}