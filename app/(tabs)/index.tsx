// HOME — the kit's reference screen. Copy this structure, not the content.
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { C } from "../../src/theme";
import { useType, HIT } from "../../src/type";
import { useReduceMotion, haptic } from "../../src/a11y";
import { EASE_OUT, useCountUp } from "../../src/motion";
import { Glass, Num, Stat } from "../../components/ui";
import { Skeleton, ErrorState, EmptyState } from "../../components/States";
import { Mark } from "../../components/Mark";
import { Config } from "../../src/config";

// One focal element: the mark. Everything else supports it.
function FocalMark() {
  const reduce = useReduceMotion();
  const s = useSharedValue(0.88);
  s.value = reduce ? 1 : withSpring(1, { damping: 14, stiffness: 120, mass: 0.7 });

  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Animated.View
      style={[
        {
          width: 132,
          height: 132,
          borderRadius: 66,
          borderWidth: 1.5,
          borderColor: C.acc,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      accessible
      accessibilityLabel={`${Config.appName} home`}
    >
      <Mark name="pulse" size={44} color={C.acc} />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const t = useType();
  // Swap for your own data layer. Kept as a shape reference.
  const q = useQuery({
    queryKey: ["demo"],
    queryFn: async () => ({ a: 1284, b: 37 }),
    staleTime: 30_000,
  });

  if (q.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, gap: 16, paddingTop: 40 }}>
        <Skeleton height={132} width={132} style={{ borderRadius: 66 }} />
        <Skeleton height={28} width={180} />
        <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
          <Skeleton height={92} width="48%" />
          <Skeleton height={92} width="48%" />
        </View>
      </View>
    );
  }

  if (q.isError) return <ErrorState onRetry={() => void q.refetch()} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, paddingBottom: 140 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={C.acc} />}
      >
        <View style={{ alignItems: "center", gap: 18, paddingVertical: 12 }}>
          <FocalMark />
          <Animated.Text style={[t.wordmark, { fontSize: 30, color: C.txt }]} accessibilityRole="header">
            {Config.appName}
          </Animated.Text>
          <Animated.Text style={[t.caption, { color: C.dim, textAlign: "center", maxWidth: 260 }]}>
            {Config.tagline}
          </Animated.Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 28 }}>
          <Stat value={q.data?.a ?? 0} label={Config.statA} hot />
          <Stat value={q.data?.b ?? 0} label={Config.statB} />
        </View>

        <Animated.View entering={FadeIn.delay(120).duration(320)} style={{ marginTop: 28 }}>
          <Text style={[t.label, { color: C.dim2 }]} accessibilityRole="header">
            {Config.sectionTitle}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(180).duration(360)}>
          <Glass style={{ marginTop: 12, padding: 20 }}>
            <Text style={[t.body, { color: C.dim }]}>
              Replace this with real content. Every surface in the kit is a hairline glass panel;
              every size comes from the Dynamic Type scale; every animation already honours
              reduce-motion and returns a haptic.
            </Text>
          </Glass>
        </Animated.View>

        <View style={{ marginTop: 20, minHeight: HIT }} />
      </ScrollView>
    </View>
  );
}
