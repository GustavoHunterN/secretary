import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { API_BASE_URL, deleteReceipt, getReceipt, Receipt, updateReceipt } from '@/lib/api';

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const receiptId = Number(id);
  const router = useRouter();
  const theme = useTheme();

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await getReceipt(receiptId);
      setReceipt(r);
      setVendor(r.vendor ?? '');
      setAmount(r.amount ?? '');
      setPurchaseDate(r.purchase_date ?? '');
      setCategory(r.category ?? '');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to load receipt');
    }
  }, [receiptId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement },
  ];

  async function handleSave() {
    setBusy(true);
    try {
      await updateReceipt(receiptId, {
        vendor: vendor || null,
        amount: amount ? Number(amount) : null,
        purchase_date: purchaseDate || null,
        category: category || null,
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to save receipt');
    } finally {
      setBusy(false);
    }
  }

  function handleDelete() {
    Alert.alert('Delete receipt', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await deleteReceipt(receiptId);
            router.back();
          } catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed to delete receipt');
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  }

  if (!receipt) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText style={styles.padded}>Loading…</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Receipt
          </ThemedText>

          {receipt.image_path && (
            <Image
              source={{ uri: `${API_BASE_URL}/${receipt.image_path}` }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <View style={styles.field}>
            <ThemedText type="smallBold">Vendor</ThemedText>
            <TextInput style={inputStyle} value={vendor} onChangeText={setVendor} />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Amount</ThemedText>
            <TextInput
              style={inputStyle}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Date (YYYY-MM-DD)</ThemedText>
            <TextInput style={inputStyle} value={purchaseDate} onChangeText={setPurchaseDate} />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Category</ThemedText>
            <TextInput style={inputStyle} value={category} onChangeText={setCategory} />
          </View>

          <Pressable
            disabled={busy}
            onPress={handleSave}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" themeColor="background">
              Save
            </ThemedText>
          </Pressable>

          <Pressable
            disabled={busy}
            onPress={handleDelete}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" themeColor="background">
              Delete
            </ThemedText>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <ThemedText type="link">Cancel</ThemedText>
          </Pressable>
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
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  padded: {
    padding: Spacing.three,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3c87f7',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
