import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { BloomScreen } from '../../components/BloomScreen';
import { colors } from '../../theme/colors';

export default function SubmitScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [window, setWindow] = useState('');
  const [note, setNote] = useState('');

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
      if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
    } catch (error) {
      Alert.alert('Photo picker unavailable', 'Please check photo permissions and try again.');
    }
  };
  const preview = () => {
    if (!imageUri || !name.trim() || !location.trim()) {
      Alert.alert('A few details are missing', 'Please choose one photo and enter the plant name and location.');
      return;
    }
    Alert.alert('Sighting preview is ready', 'Your form has been checked locally. Nothing was uploaded or saved to the backend.');
  };

  return (
    <BloomScreen title="Submit a sighting" eyebrow="SHARE A MOMENT" subtitle="Help the community learn where plants are blooming.">
      <Text style={styles.section}>Plant photo *</Text>
      <Pressable style={styles.upload} accessibilityRole="button" accessibilityLabel={imageUri ? 'Change selected plant photo' : 'Choose one plant photo'} onPress={pickPhoto}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" /> : <MaterialCommunityIcons name="camera-plus-outline" size={44} color={colors.purple} />}
        <Text style={styles.uploadText}>{imageUri ? 'Change photo' : 'Choose a photo'}</Text>
        <Text style={styles.caption}>One image per sighting · stays on this device in the demo</Text>
      </Pressable>
      <Text style={styles.label}>Plant name *</Text>
      <TextInput mode="outlined" value={name} onChangeText={setName} placeholder="e.g. Cherry Blossom" accessibilityLabel="Plant name" style={styles.input} contentStyle={styles.inputContent} />
      <Text style={styles.label}>Location *</Text>
      <TextInput mode="outlined" value={location} onChangeText={setLocation} placeholder="e.g. Carlton Gardens" accessibilityLabel="Plant location" style={styles.input} contentStyle={styles.inputContent} />
      <Text style={styles.caption}>For now, enter the location yourself. GPS will be added later.</Text>
      <Text style={styles.label}>Blooming window</Text>
      <TextInput mode="outlined" value={window} onChangeText={setWindow} placeholder="e.g. September – November" accessibilityLabel="Blooming window" style={styles.input} contentStyle={styles.inputContent} />
      <Text style={styles.label}>Description</Text>
      <TextInput mode="outlined" multiline numberOfLines={4} value={note} onChangeText={setNote} placeholder="What did you notice?" accessibilityLabel="Plant sighting description" style={styles.input} contentStyle={[styles.inputContent, { minHeight: 120 }]} />
      <View style={styles.notice}><Text style={styles.noticeText}>This is a UI-only demonstration. No sighting will be uploaded, shared or saved.</Text></View>
      <Button mode="contained" contentStyle={{ minHeight: 54 }} style={styles.button} onPress={preview}>Preview sighting</Button>
    </BloomScreen>
  );
}
const styles = StyleSheet.create({
  section: { fontFamily: 'NotoSans_700Bold', fontSize: 19, color: colors.deepPlum },
  upload: { minHeight: 185, backgroundColor: colors.palePurple, borderRadius: 20, borderColor: colors.purple, borderWidth: 1.4, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', padding: 12, gap: 7, overflow: 'hidden' },
  preview: { width: '100%', height: 145, borderRadius: 15 },
  uploadText: { color: colors.purple, fontFamily: 'NotoSans_700Bold', fontSize: 17 },
  caption: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
  label: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 16 },
  input: { backgroundColor: colors.white, marginTop: -8 },
  inputContent: { fontSize: 17 },
  notice: { borderRadius: 14, backgroundColor: colors.paleGreen, padding: 15 },
  noticeText: { color: colors.deepPlum, fontSize: 15, lineHeight: 23 },
  button: { borderRadius: 18 },
});
