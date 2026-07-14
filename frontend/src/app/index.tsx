import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { listReceipts, Receipt } from '@/lib/api';

export default function ReceiptsListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReceipts(await listReceipts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load receipts');
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
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Receipts
          </ThemedText>
          <Pressable
            onPress={() => router.push('/receipt/new')}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" themeColor="background">
              + Add
            </ThemedText>
          </Pressable>
        </View>

        {error && (
          <ThemedText themeColor="textSecondary" style={styles.padded}>
            {error}
          </ThemedText>
        )}

        {!error && !loading && receipts.length === 0 && (
          <ThemedText themeColor="textSecondary" style={styles.padded}>
            No receipts yet. Tap + Add to create one.
          </ThemedText>
        )}

        <FlatList
          data={receipts}
          keyExtractor={(item) => String(item.id)}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/receipt/${item.id}`)}
              style={({ pressed }) => [pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <View style={styles.cardRow}>
                  <ThemedText type="default" style={styles.cardVendor}>
                    {item.vendor ?? 'Unknown vendor'}
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {item.amount ? `$${item.amount}` : '—'}
                  </ThemedText>
                </View>
                <View style={styles.cardRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.purchase_date ?? 'No date'}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.category ?? 'Uncategorized'}
                  </ThemedText>
                </View>
              </ThemedView>
            </Pressable>
          )}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  addButton: {
    backgroundColor: '#3c87f7',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
  padded: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardVendor: {
    fontWeight: '600',
  },
});
