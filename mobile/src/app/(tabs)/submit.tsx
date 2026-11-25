import { useRef, useState, type ComponentProps } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { BloomButton } from '../../components/BloomButton';
import { BloomFilterChip } from '../../components/BloomFilterChip';
import { BloomLogo } from '../../components/BloomLogo';
import { BloomScreen } from '../../components/BloomScreen';
import { ControlSize, Radii, Spacing } from '../../constants/theme';
import { colors } from '../../theme/colors';
import { displayTypography } from '../../theme/typography';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;
type Month = (typeof months)[number];
type WindowEnd = 'start' | 'end';
const cameraAvailable = Platform.OS === 'android' || Platform.OS === 'ios';

function describeWindow(start: Month | null, end: Month | null) {
  if (!start || !end) return start || end ? 'Flowering window incomplete' : 'Flowering window unknown';
  if (start === end) return start;
  return `${start} – ${end}${months.indexOf(end) < months.indexOf(start) ? ' (ends next year)' : ''}`;
}

function MonthSelector({ label, value, expanded, invalid, onToggle, onSelect }: {
  label: string;
  value: Month | null;
  expanded: boolean;
  invalid: boolean;
  onToggle: () => void;
  onSelect: (value: Month | null) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.monthLabel}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ?? 'Not sure'}`}
        accessibilityState={{ expanded }}
        onPress={onToggle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.monthTrigger, invalid && styles.invalidTrigger, focused && styles.focusedTrigger]}
      >
        <Text style={styles.monthValue}>{value ?? 'Not sure'}</Text>
        <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.leafGreen} aria-hidden />
      </Pressable>
      {expanded && (
        <View style={styles.monthChoices}>
          {[null, ...months].map((month) => (
            <BloomFilterChip
              key={month ?? 'unknown'}
              label={month ?? 'Not sure'}
              selected={value === month}
              onPress={() => onSelect(month)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

type FieldProps = {
  label: string;
  help?: string;
  errorMessage?: string;
  required?: boolean;
} & Pick<ComponentProps<typeof TextInput>, 'value' | 'onChangeText' | 'placeholder' | 'multiline' | 'numberOfLines'>;

function Field({ label, help, errorMessage, required, multiline, ...input }: FieldProps) {
  const visibleLabel = required ? `${label} *` : `${label} (optional)`;
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{visibleLabel}</Text>
      <TextInput
        {...input}
        mode="outlined"
        multiline={multiline}
        accessibilityLabel={required ? `${label}, required` : visibleLabel}
        error={Boolean(errorMessage)}
        outlineStyle={styles.outline}
        outlineColor={colors.border}
        activeOutlineColor={colors.purple}
        style={styles.input}
        contentStyle={[styles.inputContent, multiline && styles.multiline]}
      />
      {help && <Text style={styles.caption}>{help}</Text>}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

export default function SubmitScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startMonth, setStartMonth] = useState<Month | null>(null);
  const [endMonth, setEndMonth] = useState<Month | null>(null);
  const [openMonthSelector, setOpenMonthSelector] = useState<WindowEnd | null>(null);
  const [note, setNote] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [picking, setPicking] = useState(false);
  const pickerOpen = useRef(false);
  const [attempted, setAttempted] = useState(false);
  const [feedback, setFeedback] = useState<'missing' | 'ready' | null>(null);
  const missingPhoto = !imageUri;
  const missingName = !name.trim();
  const missingLocation = !location.trim();
  const incompleteWindow = (startMonth === null) !== (endMonth === null);
  const windowSummary = describeWindow(startMonth, endMonth);

  const pickPhoto = async (source: 'gallery' | 'camera') => {
    if (pickerOpen.current || (source === 'camera' && !cameraAvailable)) return;
    pickerOpen.current = true;
    setPicking(true);
    setPhotoError('');
    try {
      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setPhotoError(permission.canAskAgain
            ? 'Camera permission was denied. Try again or choose a photo from your library.'
            : 'Camera access is off. Enable it in device settings or choose a photo from your library.');
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsMultipleSelection: false };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setFeedback(null);
      }
    } catch {
      setPhotoError(source === 'camera'
        ? 'Could not open the camera. Try again or choose a photo from your library.'
        : 'Could not open the photo library. Check photo access and try again.');
    } finally {
      pickerOpen.current = false;
      setPicking(false);
    }
  };

  const removePhoto = () => {
    setImageUri(null);
    setPhotoError('');
    setFeedback(null);
  };

  const preview = () => {
    Keyboard.dismiss();
    setAttempted(true);
    setFeedback(missingPhoto || missingName || missingLocation || incompleteWindow ? 'missing' : 'ready');
  };

  const toggleMonth = (end: WindowEnd) => {
    Keyboard.dismiss();
    setOpenMonthSelector(openMonthSelector === end ? null : end);
  };

  const selectMonth = (end: WindowEnd, month: Month | null) => {
    if (end === 'start') setStartMonth(month);
    else setEndMonth(month);
    setOpenMonthSelector(null);
    setFeedback(null);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} enabled={Platform.OS === 'ios'} behavior="padding">
      <BloomScreen
        botanical
        contentContainerStyle={styles.content}
        header={
          <View style={styles.header}>
            <BloomLogo />
            <Text accessibilityRole="header" style={displayTypography.screenHeading}>New sighting</Text>
            <Text style={styles.body}>Add one clear photo and describe what you saw. A rough flowering window is enough.</Text>
          </View>
        }
      >
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Plant photo *</Text>
            <View style={styles.photoPanel}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" accessibilityLabel="Selected plant photograph" />
              ) : (
                <MaterialCommunityIcons name="camera-plus-outline" size={40} color={colors.leafGreen} aria-hidden />
              )}
              <Text style={styles.caption}>One image. Flower close-ups work best.</Text>
              <BloomButton
                variant="secondary"
                label={imageUri ? 'Replace photo' : 'Choose a photo'}
                accessibilityLabel={imageUri ? 'Replace plant photo' : 'Choose one plant photo, required'}
                disabled={picking}
                width="100%"
                onPress={() => pickPhoto('gallery')}
              />
              {cameraAvailable && (
                <BloomButton variant="secondary" label="Take a photo" width="100%" disabled={picking} onPress={() => pickPhoto('camera')} />
              )}
              {imageUri && (
                <BloomButton variant="secondary" label="Remove photo" width="100%" disabled={picking} onPress={removePhoto} />
              )}
            </View>
            {photoError !== '' && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{photoError}</Text>}
            {attempted && missingPhoto && <Text style={styles.error}>Choose one plant photo.</Text>}
          </View>

          <Field
            label="Plant or tree name"
            required
            value={name}
            onChangeText={(value) => { setName(value); setFeedback(null); }}
            placeholder="e.g. Common Lilac"
            help="If you aren’t sure, enter “Unknown plant”."
            errorMessage={attempted && missingName ? 'Enter a plant name or “Unknown plant”.' : undefined}
          />
          <Field
            label="Location"
            required
            value={location}
            onChangeText={(value) => { setLocation(value); setFeedback(null); }}
            placeholder="Park, suburb or coordinates"
            help="Enter the location where you saw the plant."
            errorMessage={attempted && missingLocation ? 'Enter the sighting location.' : undefined}
          />
          <View style={styles.field}>
            <Text style={styles.label}>Blooming window (optional)</Text>
            <Text style={styles.caption}>Choose both months, or leave both as Not sure. Windows use Southern Hemisphere months.</Text>
            <MonthSelector
              label="Start month"
              value={startMonth}
              expanded={openMonthSelector === 'start'}
              invalid={attempted && incompleteWindow && startMonth === null}
              onToggle={() => toggleMonth('start')}
              onSelect={(month) => selectMonth('start', month)}
            />
            <MonthSelector
              label="End month"
              value={endMonth}
              expanded={openMonthSelector === 'end'}
              invalid={attempted && incompleteWindow && endMonth === null}
              onToggle={() => toggleMonth('end')}
              onSelect={(month) => selectMonth('end', month)}
            />
            <Text accessibilityLiveRegion="polite" style={styles.caption}>{windowSummary}</Text>
            {attempted && incompleteWindow && (
              <Text style={styles.error}>Choose the missing month or set both months to Not sure.</Text>
            )}
          </View>
          <Field
            label="What did you see?"
            value={note}
            onChangeText={(value) => { setNote(value); setFeedback(null); }}
            placeholder="e.g. Buds are opening on the south side"
            multiline
            numberOfLines={4}
          />

          <View style={styles.notice}>
            <Text style={styles.noticeText}>Use a photo you took yourself. A clear flower close-up and accurate location help reviewers.</Text>
          </View>
          <BloomButton label="Preview sighting" width="100%" disabled={picking} onPress={preview} />
          {feedback && (
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={feedback === 'missing' ? styles.error : styles.noticeText}>
              {feedback === 'missing'
                ? 'Check the fields marked above to preview your sighting.'
                : 'Sighting preview is ready. Your details were checked locally. Nothing was saved, uploaded, or sent for review.'}
            </Text>
          )}
          <Text style={styles.caption}>Local preview only. Sending a sighting for community review is not connected in this demo.</Text>
        </View>
      </BloomScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingTop: Spacing.three, paddingBottom: Spacing.five },
  header: { gap: Spacing.twelve },
  body: { color: colors.deepPlum, fontSize: 17, lineHeight: 26 },
  form: { gap: Spacing.four, marginTop: Spacing.four },
  field: { gap: Spacing.two },
  label: { color: colors.leafGreen, fontFamily: 'NotoSans_700Bold', fontSize: 16 },
  monthLabel: { color: colors.deepPlum, fontFamily: 'NotoSans_700Bold', fontSize: 15 },
  monthValue: { flex: 1, minWidth: 0, color: colors.deepPlum, fontSize: 17 },
  monthTrigger: {
    minHeight: ControlSize.minimumTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: colors.white,
    borderRadius: Radii[16],
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  invalidTrigger: { borderColor: colors.pollenText },
  focusedTrigger: { outlineColor: colors.deepPlum, outlineWidth: 2, outlineStyle: 'solid' },
  monthChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  photoPanel: {
    minHeight: 185,
    backgroundColor: colors.palePurple,
    borderRadius: Radii[24],
    borderColor: colors.leafGreen,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
    gap: Spacing.twelve,
  },
  preview: { width: '100%', aspectRatio: 16 / 9, borderRadius: Radii[12], backgroundColor: colors.petalWhite },
  caption: { color: colors.leafGreen, fontSize: 14, lineHeight: 22 },
  error: { color: colors.pollenText, fontFamily: 'NotoSans_700Bold', fontSize: 14, lineHeight: 21 },
  outline: { borderRadius: Radii[16] },
  input: { backgroundColor: colors.white, minHeight: ControlSize.minimumTouch },
  inputContent: { fontSize: 17, fontFamily: 'NotoSans_400Regular' },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  notice: { borderRadius: Radii[20], backgroundColor: colors.paleGreen, padding: Spacing.three },
  noticeText: { color: colors.deepPlum, fontSize: 15, lineHeight: 23 },
});
