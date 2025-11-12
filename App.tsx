import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// Reusable input field with a label + icon
function InputField(props: {
  label: string;
  placeholder: string;
  icon: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const { label, placeholder, icon, secureTextEntry, value, onChangeText } = props;

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
        />
      </View>
    </View>
  );
}

// ---------- MAIN APP ----------
export default function App() {
  // state for fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  // state for UI feedback
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'

  const handleSignup = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // clear old message
    setStatusMessage('');
    setStatusType('');

    if (!trimmedEmail || !fullName.trim()) {
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
        'Password must be at least 8 characters long and include both letters and numbers.'
      );
      return;
    }

    try {
      console.log('➡️ Sending signup request...');

      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await response.json();
      console.log('⬅️ Response status:', response.status);
      console.log('⬅️ Response body:', data);

      if (!response.ok) {
        setStatusType('error');
        setStatusMessage(data.message || 'Signup failed. Something went wrong.');
        return;
      }

      setStatusType('success');
      setStatusMessage(data.message || 'Account created!');

      setFullName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Network error:', error);
      setStatusType('error');
      setStatusMessage('Could not connect to the server.');
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

        {/* Header with logo + title + dots */}
        <View style={styles.headerRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoHeart}>♡</Text>
          </View>

          <View style={styles.headerTextCol}>
            <Text style={styles.joinTitle}>Join FurNest</Text>
            <View style={styles.membersRow}>
              <View style={styles.memberDot} />
              <View style={[styles.memberDot, styles.memberDotDark]} />
              <Text style={styles.membersText}>Your trusted pet adoption companion</Text>
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
        {statusMessage ? (
          <Text
            style={[
              styles.statusMessage,
              statusType === 'error' ? styles.statusError : styles.statusSuccess,
            ]}
          >
            {statusMessage}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },

  // back row
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 18,
    marginRight: 4,
    color: '#4A4A4A',
  },
  backText: {
    fontSize: 14,
    color: '#4A4A4A',
  },

  // header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B10B1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoHeart: {
    fontSize: 22,
    color: 'white',
  },
  headerTextCol: {
    flexDirection: 'column',
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5E7EB',
    marginRight: 4,
  },
  memberDotDark: {
    backgroundColor: '#9CA3AF',
  },
  membersText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 24,
  },

  form: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
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
  passwordHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  primaryButton: {
    backgroundColor: '#9B0016',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  statusMessage: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  statusError: {
    color: '#B91C1C',
  },
  statusSuccess: {
    color: '#047857',
  },
});