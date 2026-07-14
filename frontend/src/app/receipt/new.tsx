import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { createReceipt, uploadReceipt } from '@/lib/api';

export default function NewReceiptScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [category, setCategory] = useState('');
  const [busy, setBusy] = useState(false);

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement },
  ];

  async function handleSave() {
    setBusy(true);
    try {
      await createReceipt({
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

  async function pickAndUpload(source: 'camera' | 'library') {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Enable access to continue.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setBusy(true);
    try {
      await uploadReceipt(asset.uri, asset.fileName ?? 'receipt.jpg', asset.mimeType ?? 'image/jpeg');
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to upload receipt');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            New receipt
          </ThemedText>

          <View style={styles.photoRow}>
            <Pressable
              disabled={busy}
              onPress={() => pickAndUpload('camera')}
              style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold" themeColor="background">
                Take Photo
              </ThemedText>
            </Pressable>
            <Pressable
              disabled={busy}
              onPress={() => pickAndUpload('library')}
              style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold" themeColor="background">
                Choose Photo
              </ThemedText>
            </Pressable>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Uploading a photo runs OCR automatically; you can also fill the form below manually.
          </ThemedText>

          <View style={styles.field}>
            <ThemedText type="smallBold">Vendor</ThemedText>
            <TextInput
              style={inputStyle}
              value={vendor}
              onChangeText={setVendor}
              placeholder="Starbucks"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Amount</ThemedText>
            <TextInput
              style={inputStyle}
              value={amount}
              onChangeText={setAmount}
              placeholder="12.50"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Date (YYYY-MM-DD)</ThemedText>
            <TextInput
              style={inputStyle}
              value={purchaseDate}
              onChangeText={setPurchaseDate}
              placeholder="2026-07-13"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Category</ThemedText>
            <TextInput
              style={inputStyle}
              value={category}
              onChangeText={setCategory}
              placeholder="food"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <Pressable
            disabled={busy}
            onPress={handleSave}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold" themeColor="background">
              Save
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
  photoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#3c87f7',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
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
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
