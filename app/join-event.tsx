import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Users, Heart, MapPin, Calendar, Clock, CircleCheck as CheckCircle, Share, Download, Navigation } from 'lucide-react-native';

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  experience: string;
  dietaryRequirements: string;
  accessibilityNeeds: string;
  donationAmount: string;
  customDonation: string;
}

// Sound feedback function for accessibility
const playButtonSound = () => {
  if (Platform.OS === 'web') {
    // Web audio feedback
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio feedback not available');
    }
  }
  // Note: For native platforms, you would use expo-av or similar
};

export default function JoinEvent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  
  // Extract event data from params
  const eventData = {
    id: params.eventId as string || '1',
    title: params.eventTitle as string || 'Volunteer Event',
    organization: params.organization as string || 'Community Organization',
    date: params.date as string || 'Today',
    time: params.time as string || '2:00 PM',
    duration: params.duration as string || '2 hours',
    address: params.address as string || 'Event Location',
    description: params.description as string || 'Help make a difference in your community.',
    points: parseInt(params.points as string) || 50,
    requirements: params.requirements ? JSON.parse(params.requirements as string) : [],
    contactPhone: params.contactPhone as string || '',
    latitude: parseFloat(params.latitude as string) || 3.1390,
    longitude: parseFloat(params.longitude as string) || 101.6869,
  };
  
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    experience: '',
    dietaryRequirements: '',
    accessibilityNeeds: '',
    donationAmount: '',
    customDonation: '',
  });

  const [errors, setErrors] = useState<Partial<RegistrationData>>({});

  const validateForm = () => {
    const newErrors: Partial<RegistrationData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    playButtonSound();
    if (validateForm()) {
      setStep('confirmation');
    }
  };

  const handleAddToCalendar = () => {
    playButtonSound();
    Alert.alert(
      'Add to Calendar',
      'Event details will be added to your calendar.',
      [{ text: 'OK' }]
    );
  };

  const handleShareEvent = () => {
    playButtonSound();
    Alert.alert(
      'Share Event',
      'Share this volunteer opportunity with friends and family!',
      [{ text: 'Share' }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleDone = () => {
    playButtonSound();
    // Navigate to attendance tracking page with event data
    router.push({
      pathname: '/attendance',
      params: {
        eventId: eventData.id,
        eventTitle: eventData.title,
        organization: eventData.organization,
        date: eventData.date,
        time: eventData.time,
        duration: eventData.duration,
        address: eventData.address,
        description: eventData.description,
        points: eventData.points.toString(),
        latitude: eventData.latitude.toString(),
        longitude: eventData.longitude.toString(),
      }
    });
  };

  const handleBackPress = () => {
    playButtonSound();
    router.back();
  };

  const renderFormStep = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Your Registration</Text>
          <Text style={styles.headerSubtitle}>
            Please fill in your details to confirm your participation
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.eventSummary}>
          <Text style={styles.eventTitle}>{eventData.title}</Text>
          <Text style={styles.eventOrg}>{eventData.organization}</Text>
          <View style={styles.eventDetails}>
            <View style={styles.eventDetailRow}>
              <Calendar color="#64748B" size={16} />
              <Text style={styles.eventDetailText}>{eventData.date}</Text>
            </View>
            <View style={styles.eventDetailRow}>
              <Clock color="#64748B" size={16} />
              <Text style={styles.eventDetailText}>{eventData.time} ({eventData.duration})</Text>
            </View>
            <View style={styles.eventDetailRow}>
              <MapPin color="#64748B" size={16} />
              <Text style={styles.eventDetailText}>{eventData.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
              <User color="#64748B" size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              />
            </View>
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Mail color="#64748B" size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
              <Phone color="#64748B" size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="+60 123-456789"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Emergency Contact Name *</Text>
            <View style={[styles.inputContainer, errors.emergencyContactName && styles.inputError]}>
              <Users color="#64748B" size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter emergency contact's full name"
                value={formData.emergencyContactName}
                onChangeText={(text) => setFormData({ ...formData, emergencyContactName: text })}
              />
            </View>
            {errors.emergencyContactName && <Text style={styles.errorText}>{errors.emergencyContactName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Emergency Contact Phone *</Text>
            <View style={[styles.inputContainer, errors.emergencyContactPhone && styles.inputError]}>
              <Phone color="#64748B" size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="+60 123-456789"
                value={formData.emergencyContactPhone}
                onChangeText={(text) => setFormData({ ...formData, emergencyContactPhone: text })}
                keyboardType="phone-pad"
              />
            </View>
            {errors.emergencyContactPhone && <Text style={styles.errorText}>{errors.emergencyContactPhone}</Text>}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information (Optional)</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relevant Experience</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Share any previous volunteering experience"
              value={formData.experience}
              onChangeText={(text) => setFormData({ ...formData, experience: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dietary Requirements</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Let us know if you have any dietary restrictions"
              value={formData.dietaryRequirements}
              onChangeText={(text) => setFormData({ ...formData, dietaryRequirements: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Accessibility Needs</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Specify any accessibility accommodations you need"
              value={formData.accessibilityNeeds}
              onChangeText={(text) => setFormData({ ...formData, accessibilityNeeds: text })}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Support This Cause (Optional)</Text>
          <Text style={styles.sectionSubtitle}>Would you like to make a donation?</Text>
          
          <View style={styles.donationOptions}>
            {['10', '25', '50', '100'].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.donationButton,
                  formData.donationAmount === amount && styles.selectedDonation
                ]}
                onPress={() => {
                  playButtonSound();
                  setFormData({ ...formData, donationAmount: amount, customDonation: '' });
                }}
              >
                <Text style={[
                  styles.donationButtonText,
                  formData.donationAmount === amount && styles.selectedDonationText
                ]}>
                  RM{amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customDonationContainer}>
            <Text style={styles.inputLabel}>Other Amount (RM)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter custom amount"
              value={formData.customDonation}
              onChangeText={(text) => setFormData({ ...formData, customDonation: text, donationAmount: '' })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Complete Registration</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderConfirmationStep = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <CheckCircle color="#FFFFFF" size={48} />
          <Text style={styles.headerTitle}>Registration Successful!</Text>
          <Text style={styles.headerSubtitle}>
            You've successfully joined the volunteer event
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.confirmationCard}>
          <View style={styles.eventIcon}>
            <Heart color="#EC4899" size={32} />
          </View>
          
          <Text style={styles.confirmationEventTitle}>{eventData.title}</Text>
          <Text style={styles.confirmationEventOrg}>Organised by {eventData.organization}</Text>
          
          <View style={styles.confirmationDetails}>
            <View style={styles.confirmationRow}>
              <Calendar color="#64748B" size={20} />
              <Text style={styles.confirmationText}>Date: {eventData.date}</Text>
            </View>
            <View style={styles.confirmationRow}>
              <Clock color="#64748B" size={20} />
              <Text style={styles.confirmationText}>Time: {eventData.time}</Text>
            </View>
            <View style={styles.confirmationRow}>
              <Clock color="#64748B" size={20} />
              <Text style={styles.confirmationText}>Duration: {eventData.duration}</Text>
            </View>
            <View style={styles.confirmationRow}>
              <MapPin color="#64748B" size={20} />
              <Text style={styles.confirmationText}>Location: {eventData.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.registrationDetails}>
          <Text style={styles.sectionTitle}>Your Registration Details</Text>
          <View style={styles.detailsGrid}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{formData.fullName}</Text>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{formData.email}</Text>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{formData.phone}</Text>
            {(formData.donationAmount || formData.customDonation) && (
              <>
                <Text style={styles.detailLabel}>Donation:</Text>
                <Text style={styles.detailValue}>
                  RM{formData.donationAmount || formData.customDonation}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar}>
            <Calendar color="#3B82F6" size={20} />
            <Text style={styles.actionButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShareEvent}>
            <Share color="#3B82F6" size={20} />
            <Text style={styles.actionButtonText}>Share This Event</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.sectionTitle}>What's Next?</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <CheckCircle color="#10B981" size={16} />
              <Text style={styles.stepText}>You'll receive a confirmation email shortly.</Text>
            </View>
            <View style={styles.stepItem}>
              <Phone color="#10B981" size={16} />
              <Text style={styles.stepText}>The organiser will contact you before the event.</Text>
            </View>
            <View style={styles.stepItem}>
              <Clock color="#10B981" size={16} />
              <Text style={styles.stepText}>Please arrive at least 15 minutes early.</Text>
            </View>
            <View style={styles.stepItem}>
              <Navigation color="#10B981" size={16} />
              <Text style={styles.stepText}>Use the attendance check-in on event day.</Text>
            </View>
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.helpText}>Contact the organiser:</Text>
          <Text style={styles.contactInfo}>{eventData.organization} – {eventData.contactPhone || '+60 198-765432'}</Text>
        </View>

        <TouchableOpacity 
          style={styles.doneButton} 
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done - Go to Attendance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {step === 'form' && renderFormStep()}
      {step === 'confirmation' && renderConfirmationStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: -20,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: -15,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  eventOrg: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    marginLeft: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  donationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  donationButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedDonation: {
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  donationButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  selectedDonationText: {
    color: '#FFFFFF',
  },
  customDonationContainer: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  // Confirmation Step Styles
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: -15,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FDF2F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationEventTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmationEventOrg: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationDetails: {
    width: '100%',
    gap: 12,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    marginLeft: 12,
  },
  registrationDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsGrid: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  nextSteps: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    flex: 1,
    lineHeight: 20,
  },
  helpSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  doneButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});