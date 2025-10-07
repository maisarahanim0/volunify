import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { ArrowLeft, Navigation, MapPin, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Download, Share, Clock, Calendar, Award, Star, Users, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

export default function AttendanceTracking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract event data from params or use defaults
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
    latitude: parseFloat(params.latitude as string) || 3.1390,
    longitude: parseFloat(params.longitude as string) || 101.6869,
  };

  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isAtLocation, setIsAtLocation] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      setLocationError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission is required for attendance tracking.');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setUserLocation(location);
      checkIfAtEventLocation(location);
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to get your current location. Please try again.');
      setIsLoading(false);
    }
  };

  const checkIfAtEventLocation = (location: Location.LocationObject) => {
    if (!location) return;

    const distance = getDistanceFromLatLonInKm(
      location.coords.latitude,
      location.coords.longitude,
      eventData.latitude,
      eventData.longitude
    );

    // Consider user "at location" if within 100 meters (0.1 km)
    setIsAtLocation(distance < 0.1);
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleMarkAttendance = () => {
    playButtonSound();
    if (isAtLocation) {
      setAttendanceMarked(true);
      Alert.alert(
        'Attendance Marked! 🎉',
        `Congratulations! You've successfully checked in to "${eventData.title}". You've earned ${eventData.points} volunteer points!`,
        [{ text: 'Awesome!' }]
      );
    }
  };

  const handleDownloadCertificate = () => {
    playButtonSound();
    Alert.alert(
      'Certificate Generated! 📜',
      `Your volunteer certificate for "${eventData.title}" has been generated and will be sent to your email within 24 hours. You can also download it directly from your profile.`,
      [
        { text: 'View Profile', onPress: () => router.push('/(tabs)/profile') },
        { text: 'OK' }
      ]
    );
  };

  const handleShareAchievement = () => {
    playButtonSound();
    Alert.alert(
      'Share Your Impact! 🌟',
      `Share your volunteer achievement from "${eventData.title}" with friends and inspire others to make a difference!`,
      [
        { text: 'Share', onPress: () => console.log('Sharing achievement...') },
        { text: 'Later', style: 'cancel' }
      ]
    );
  };

  const handleBackPress = () => {
    playButtonSound();
    router.back();
  };

  const handleRefreshLocation = () => {
    playButtonSound();
    getCurrentLocation();
  };

  const handleRetryLocation = () => {
    playButtonSound();
    getCurrentLocation();
  };

  const renderLocationStatus = () => {
    if (isLoading) {
      return (
        <View style={styles.statusCard}>
          <View style={styles.loadingContainer}>
            <Navigation color="#6366F1" size={32} />
            <Text style={styles.loadingTitle}>Getting Your Location...</Text>
            <Text style={styles.loadingText}>
              Please ensure location services are enabled and try to be outdoors for better accuracy.
            </Text>
          </View>
        </View>
      );
    }

    if (locationError) {
      return (
        <View style={styles.statusCard}>
          <View style={styles.errorContainer}>
            <AlertCircle color="#EF4444" size={32} />
            <Text style={styles.errorTitle}>Location Error</Text>
            <Text style={styles.errorText}>{locationError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetryLocation}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (isAtLocation) {
      return (
        <View style={styles.statusCard}>
          <View style={styles.successContainer}>
            <CheckCircle color="#10B981" size={48} />
            <Text style={styles.successTitle}>You're at the Event Location! ✅</Text>
            <Text style={styles.successText}>
              Great! You're within the check-in radius. You can now mark your attendance.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.statusCard}>
        <View style={styles.warningContainer}>
          <AlertCircle color="#F59E0B" size={32} />
          <Text style={styles.warningTitle}>Not at Event Location</Text>
          <Text style={styles.warningText}>
            You're not currently at the event location. Please move closer to the venue to check in.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshLocation}>
            <Navigation color="#6366F1" size={16} />
            <Text style={styles.refreshButtonText}>Refresh Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAttendanceSuccess = () => (
    <View style={styles.successSection}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.successGradient}
      >
        <Award color="#FFFFFF" size={64} />
        <Text style={styles.successSectionTitle}>Attendance Confirmed! 🎉</Text>
        <Text style={styles.successSectionText}>
          Thank you for your volunteer service! Your contribution makes a real difference in the community.
        </Text>
      </LinearGradient>

      <View style={styles.rewardsCard}>
        <Text style={styles.rewardsTitle}>You've Earned:</Text>
        <View style={styles.rewardsList}>
          <View style={styles.rewardItem}>
            <Star color="#F59E0B" size={24} />
            <Text style={styles.rewardText}>{eventData.points} Volunteer Points</Text>
          </View>
          <View style={styles.rewardItem}>
            <Award color="#6366F1" size={24} />
            <Text style={styles.rewardText}>Completion Certificate</Text>
          </View>
          <View style={styles.rewardItem}>
            <Heart color="#EC4899" size={24} />
            <Text style={styles.rewardText}>Community Impact Badge</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.certificateButton} onPress={handleDownloadCertificate}>
          <Download color="#FFFFFF" size={20} />
          <Text style={styles.certificateButtonText}>Download Certificate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShareAchievement}>
          <Share color="#6366F1" size={20} />
          <Text style={styles.shareButtonText}>Share Achievement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Attendance Check-In</Text>
            <Text style={styles.headerSubtitle}>
              Please ensure you're at the event location to mark attendance
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventIcon}>
              <Users color="#6366F1" size={24} />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{eventData.title}</Text>
              <Text style={styles.eventOrg}>{eventData.organization}</Text>
            </View>
          </View>
          
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

        {!attendanceMarked ? (
          <>
            {renderLocationStatus()}
            
            {isAtLocation && !attendanceMarked && (
              <TouchableOpacity style={styles.attendanceButton} onPress={handleMarkAttendance}>
                <CheckCircle color="#FFFFFF" size={24} />
                <Text style={styles.attendanceButtonText}>Mark Attendance</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          renderAttendanceSuccess()
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you're having trouble with location detection, make sure:
          </Text>
          <View style={styles.helpList}>
            <Text style={styles.helpItem}>• Location services are enabled</Text>
            <Text style={styles.helpItem}>• You're outdoors or near windows</Text>
            <Text style={styles.helpItem}>• You're within 100 meters of the venue</Text>
          </View>
          <Text style={styles.contactText}>
            Contact event organizer: {eventData.organization}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  successContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#10B981',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  warningContainer: {
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#F59E0B',
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  attendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    gap: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  attendanceButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  successSection: {
    marginBottom: 24,
  },
  successGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  successSectionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSectionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
  },
  rewardsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardsList: {
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  rewardText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  actionButtons: {
    gap: 12,
  },
  certificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  certificateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  helpSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  helpList: {
    marginBottom: 16,
  },
  helpItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
});