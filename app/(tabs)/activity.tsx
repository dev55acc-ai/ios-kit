// ACTIVITY — a windowed ledger. Copy this for any list of records.
import { memo } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { C } from "../../src/theme";
import { useType } from "../../src/type";
import { LedgerRow } from "../../components/ui";
import { EmptyState, ErrorState, InlineSpinner } from "../../components/States";
import { Config } from "../../src/config";

type Record_ = { id: string; ts: string; kind: string; title: string };

const Row = memo(function Row({ item, index, last }: { item: Record_; index: number; last: boolean }) {
  return (
    <Animated.View entering={FadeIn.delay(Math.min(index, 8) * 18).duration(280)}>
      <LedgerRow left={item.ts} right={item.kind} title={item.title} last={last} />
    </Animated.View>
  );
});

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const t = useType();
  const q = useQuery({
    queryKey: ["activity"],
    queryFn: async (): Promise<Record_[]> => [],
    staleTime: 20_000,
  });

  const items = q.data ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 10 }}>
        <Text style={[t.hero, { color: C.txt }]} accessibilityRole="header">
          Activity
        </Text>
      </View>

      {q.isError && <ErrorState onRetry={() => void q.refetch()} />}
      {q.isLoading && <InlineSpinner />}
      {!q.isLoading && !q.isError && items.length === 0 && (
        <EmptyState mark="events" title="Nothing yet" note={`Records from ${Config.appName} will appear here.`} />
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          renderItem={({ item, index }) => <Row item={item} index={index} last={index === items.length - 1} />}
          keyExtractor={(i) => i.id}
          windowSize={11}
          removeClippedSubviews
          initialNumToRender={14}
          maxToRenderPerBatch={14}
          contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => void q.refetch()} tintColor={C.acc} />}
        />
      )}
    </View>
  );
}
