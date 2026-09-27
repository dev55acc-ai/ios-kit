// SETTINGS — where the brand tokens and app identity live.
import { View, ScrollView, Text, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { C } from "../../src/theme";
import { useType, HIT } from "../../src/type";
import { haptic, useReduceMotion } from "../../src/a11y";
import { Glass } from "../../components/ui";
import { Mark } from "../../components/Mark";
import { Config } from "../../src/config";

function Row({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  const t = useType();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      style={({ pressed }) => ({
        minHeight: HIT,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={[t.body, { color: C.txt, flex: 1 }]}>{label}</Text>
      {value ? <Text style={[t.caption, { color: C.dim }]}>{value}</Text> : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const t = useType();
  const reduce = useReduceMotion();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 + insets.bottom }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 16 }}>
          <Text style={[t.hero, { color: C.txt }]} accessibilityRole="header">
            Settings
          </Text>
        </View>

        <Animated.View entering={FadeIn.duration(300)} style={{ marginHorizontal: 20 }}>
          <Glass style={{ alignItems: "center", paddingVertical: 24, gap: 10 }}>
            <Mark name="pulse" size={34} color={C.acc} />
            <Text style={[t.bodyStrong, { color: C.txt }]}>{Config.appName}</Text>
            <Text style={[t.caption, { color: C.dim2 }]}>{Config.bundleId}</Text>
          </Glass>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(80).duration(320)} style={{ marginHorizontal: 20, marginTop: 16 }}>
          <Text style={[t.label, { color: C.dim2, marginBottom: 8 }]}>App</Text>
          <Glass>
            <Row label="Version" value="1.0.0 (1)" />
            <Row label="Reduce motion" value={reduce ? "on" : "off"} />
            <Row
              label="Motion Menu library"
              onPress={() => {
                haptic.act();
                void Linking.openURL("https://www.motionmenu.ca");
              }}
            />
          </Glass>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
