import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { getSummary, ReceiptSummary } from '@/lib/api';

export default function SummaryScreen() {
  const [summary, setSummary] = useState<ReceiptSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await getSummary());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Summary
          </ThemedText>

          {error && <ThemedText themeColor="textSecondary">{error}</ThemedText>}

          {summary && (
            <>
              <ThemedView type="backgroundElement" style={styles.totalCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  Total spent
                </ThemedText>
                <ThemedText type="subtitle">${summary.total}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {summary.count} receipt{summary.count === 1 ? '' : 's'}
                </ThemedText>
              </ThemedView>

              <ThemedText type="smallBold" style={styles.sectionTitle}>
                By category
              </ThemedText>
              {summary.by_category.length === 0 && (
                <ThemedText themeColor="textSecondary">No data yet.</ThemedText>
              )}
              {summary.by_category.map((row) => (
                <View key={row.category ?? 'uncategorized'} style={styles.categoryRow}>
                  <ThemedText>{row.category ?? 'Uncategorized'}</ThemedText>
                  <ThemedText themeColor="textSecondary">
                    ${row.total} · {row.count}
                  </ThemedText>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingBottom: BottomTabInset,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  totalCard: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  sectionTitle: {
    marginTop: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8884',
  },
});
