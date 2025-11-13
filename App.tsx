import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';


 const BASE_URL = 'http://192.168.1.191:5000'; ; // replace with your IP


// If you’re testing on a REAL PHONE, change to your LAN IP, e.g.:
// const BASE_URL = 'http://192.168.1.23:5000';

/* ---------- Reusable input field ---------- */
function InputField({
  label,
  placeholder,
  icon,
  secureTextEntry = false,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  icon: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9AA0A6"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

/* ---------- MAIN APP ---------- */
export default function App() {
  // form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ui feedback
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  const handleSignup = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    setStatusMessage('');
    setStatusType('');

    if (!trimmedName || !trimmedEmail) {
      setStatusType('error');
      setStatusMessage('Please enter your full name and email.');
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setStatusType('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }
    if (!passwordRegex.test(trimmedPassword)) {
      setStatusType('error');
      setStatusMessage(
        'Password must be at least 8 characters and include letters & numbers.'
      );
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          email: trimmedEmail.toLowerCase(),
          password: trimmedPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatusType('error');
        setStatusMessage(data.message || 'Signup failed. Please try again.');
        return;
      }

      setStatusType('success');
      setStatusMessage(data.message || 'Signup successful! Welcome to FurNest 🐾');

      // clear fields
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setStatusType('error');
      setStatusMessage(
        'Could not reach the server. Check BASE_URL and that the backend is running.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back row */}
        <View style={styles.backRow}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </View>

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoHeart}>♡</Text>
          </View>

          <View style={styles.headerTextCol}>
            <Text style={styles.joinTitle}>Join FurNest</Text>
            <View style={styles.membersRow}>
              <View style={styles.memberDot} />
              <View style={[styles.memberDot, styles.memberDotDark]} />
              <Text style={styles.membersText}>
                Your trusted pet adoption companion
              </Text>
            </View>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Create an account to start helping pets find their forever homes
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="John Doe"
            icon="👤"
            value={fullName}
            onChangeText={setFullName}
          />

          <InputField
            label="Email Address"
            placeholder="john@example.com"
            icon="✉️"
            value={email}
            onChangeText={setEmail}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon="🔒"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.passwordHint}>
            Must be at least 8 characters and include letters & numbers
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
          <Text style={styles.primaryButtonText}>Create Account ♡</Text>
        </TouchableOpacity>

        {/* Status message */}
        {!!statusMessage && (
          <Text
            style={[
              styles.statusMessage,
              statusType === 'error' ? styles.statusError : styles.statusSuccess,
            ]}
          >
            {statusMessage}
          </Text>
        )}

        {/* Small debug helper so you know which URL you’re hitting */}
        <Text style={styles.debugUrl}>API: {BASE_URL}/signup</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backArrow: { fontSize: 18, marginRight: 4, color: '#4A4A4A' },
  backText: { fontSize: 14, color: '#4A4A4A' },

  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B10B1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoHeart: { fontSize: 22, color: 'white' },
  headerTextCol: { flexDirection: 'column' },
  joinTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  membersRow: { flexDirection: 'row', alignItems: 'center' },
  memberDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5E7EB',
    marginRight: 4,
  },
  memberDotDark: { backgroundColor: '#9CA3AF' },
  membersText: { fontSize: 12, color: '#6B7280', marginLeft: 4 },

  subtitle: { fontSize: 14, color: '#4B5563', marginBottom: 24 },

  form: { marginBottom: 24 },
  fieldContainer: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 48,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: '#111827' },
  passwordHint: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  primaryButton: {
    backgroundColor: '#9B0016',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  statusMessage: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  statusError: { color: '#B91C1C' },
  statusSuccess: { color: '#047857' },

  debugUrl: { marginTop: 10, fontSize: 11, color: '#6B7280', textAlign: 'center' },
});