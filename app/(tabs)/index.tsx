import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Region, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Filter,
  List,
  Search,
  Ear,
  Eye,
  Brain,
  Accessibility,
  Music,
  Sparkles,
  Clock,
  Users,
  Star,
  X,
  Calendar,
  Navigation,
  Phone,
  MessageCircle,
  Heart,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Event {
  id: string;
  title: string;
  organization: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  category: 'hearing' | 'visual' | 'cognitive' | 'mobility' | 'sensory' | 'general';
  urgency: 'low' | 'medium' | 'high';
  date: string;
  time: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  distance: string;
  description: string;
  points: number;
  contactPhone?: string;
  requirements?: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Sign Language Cafe Session',
    organization: 'Malaysian Association of the Deaf',
    location: {
      latitude: 4.3807,
      longitude: 100.9735,
      address: 'Universiti Teknologi PETRONAS (UTP)',
    },
    category: 'hearing',
    urgency: 'high',
    date: 'Today',
    time: '2:00 PM',
    duration: '3 hours',
    participants: 8,
    maxParticipants: 12,
    distance: '1.2 km',
    description: 'Help facilitate communication at our weekly deaf community cafe. We need volunteers who can assist with basic sign language or help bridge communication between deaf and hearing customers.',
    points: 50,
    contactPhone: '+60 12-345 6789',
    requirements: ['Basic sign language helpful', 'Patient and friendly attitude', 'Available for 3 hours'],
  },
  {
    id: '2',
    title: 'Guided Grocery Shopping',
    organization: 'Vision Aid Foundation',
    location: {
      latitude: 3.1420,
      longitude: 101.6850,
      address: 'KLCC Suria Mall',
    },
    category: 'visual',
    urgency: 'medium',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: '2 hours',
    participants: 3,
    maxParticipants: 6,
    distance: '0.8 km',
    description: 'Assist visually impaired individuals with grocery shopping. Help them navigate the store, read labels, and ensure they get everything they need safely.',
    points: 40,
    contactPhone: '+60 12-987 6543',
    requirements: ['Good communication skills', 'Patience and empathy', 'Familiar with grocery stores'],
  },
  {
    id: '3',
    title: 'Autism Support Playgroup',
    organization: 'Autism Spectrum Malaysia',
    location: {
      latitude: 3.1350,
      longitude: 101.6900,
      address: 'Ampang Community Center',
    },
    category: 'cognitive',
    urgency: 'low',
    date: 'Saturday',
    time: '9:00 AM',
    duration: '4 hours',
    participants: 15,
    maxParticipants: 20,
    distance: '2.1 km',
    description: 'Support children with autism in structured play activities. Help create a safe, inclusive environment where children can develop social skills through guided play.',
    points: 60,
    contactPhone: '+60 12-456 7890',
    requirements: ['Experience with children preferred', 'Calm and patient demeanor', 'Available for full morning'],
  },
  {
    id: '4',
    title: 'Wheelchair Accessibility Check',
    organization: 'Malaysian Disability Council',
    location: {
      latitude: 3.1380,
      longitude: 101.6820,
      address: 'Pavilion KL Shopping Mall',
    },
    category: 'mobility',
    urgency: 'medium',
    date: 'This Weekend',
    time: '11:00 AM',
    duration: '3 hours',
    participants: 5,
    maxParticipants: 8,
    distance: '1.5 km',
    description: 'Help assess wheelchair accessibility in public spaces. Document barriers and suggest improvements to make locations more inclusive.',
    points: 70,
    contactPhone: '+60 12-234 5678',
    requirements: ['Detail-oriented', 'Basic smartphone skills', 'Physical ability to walk around'],
  },
];

const categoryIcons = {
  hearing: Ear,
  visual: Eye,
  cognitive: Brain,
  mobility: Accessibility,
  sensory: Music,
  general: Sparkles,
};

const urgencyColors = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

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

export default function Dashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [region, setRegion] = useState<Region>({
    latitude: 3.1390,
    longitude: 101.6869,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    // Filter events based on search query
    if (searchQuery.trim() === '') {
      setFilteredEvents(mockEvents);
    } else {
      const filtered = mockEvents.filter(event =>
        event.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery]);

  const handleMarkerPress = (event: Event) => {
    playButtonSound();
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleJoinEvent = (event: Event) => {
    playButtonSound();
    setShowEventModal(false);
    // Navigate to join-event page with event data
    router.push({
      pathname: '/join-event',
      params: {
        eventId: event.id,
        eventTitle: event.title,
        organization: event.organization,
        date: event.date,
        time: event.time,
        duration: event.duration,
        address: event.location.address,
        description: event.description,
        points: event.points.toString(),
        requirements: JSON.stringify(event.requirements || []),
        contactPhone: event.contactPhone || '',
        latitude: event.location.latitude.toString(),
        longitude: event.location.longitude.toString(),
      }
    });
  };

  const handleGetDirections = (event: Event) => {
    playButtonSound();
    const url = Platform.select({
      ios: `maps:0,0?q=${event.location.latitude},${event.location.longitude}`,
      android: `geo:0,0?q=${event.location.latitude},${event.location.longitude}`,
      web: `https://www.google.com/maps/search/?api=1&query=${event.location.latitude},${event.location.longitude}`,
    });
    
    if (url) {
      Alert.alert('Directions', 'Opening maps app for directions...');
    }
  };

  const handleContactOrganizer = (event: Event) => {
    playButtonSound();
    if (event.contactPhone) {
      Alert.alert(
        'Contact Organizer',
        `Call ${event.organization}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => Alert.alert('Calling', `Calling ${event.contactPhone}...`) },
        ]
      );
    }
  };

  const handleViewModeChange = (mode: 'map' | 'list') => {
    playButtonSound();
    setViewMode(mode);
  };

  const handleCloseModal = () => {
    playButtonSound();
    setShowEventModal(false);
  };

  const renderEventModal = () => {
    if (!selectedEvent) return null;

    const IconComponent = categoryIcons[selectedEvent.category];
    const spotsLeft = selectedEvent.maxParticipants - selectedEvent.participants;
    const progressPercentage = (selectedEvent.participants / selectedEvent.maxParticipants) * 100;

    return (
      <Modal
        visible={showEventModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <View style={[styles.modalCategoryIcon, { backgroundColor: urgencyColors[selectedEvent.urgency] + '20' }]}>
                <IconComponent color={urgencyColors[selectedEvent.urgency]} size={24} />
              </View>
              <View style={styles.modalTitleInfo}>
                <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                <Text style={styles.modalOrganization}>{selectedEvent.organization}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <X color="#64748B" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.urgencyBanner, { backgroundColor: urgencyColors[selectedEvent.urgency] }]}>
              <Text style={styles.urgencyBannerText}>
                {selectedEvent.urgency.toUpperCase()} PRIORITY
              </Text>
              <Text style={styles.urgencyBannerSubtext}>
                {spotsLeft} spots remaining
              </Text>
            </View>

            <View style={styles.eventDetailsSection}>
              <View style={styles.detailRow}>
                <Calendar color="#64748B" size={20} />
                <Text style={styles.detailText}>{selectedEvent.date}, {selectedEvent.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock color="#64748B" size={20} />
                <Text style={styles.detailText}>Duration: {selectedEvent.duration}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin color="#64748B" size={20} />
                <Text style={styles.detailText}>{selectedEvent.location.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Navigation color="#64748B" size={20} />
                <Text style={styles.detailText}>{selectedEvent.distance} away</Text>
              </View>
              <View style={styles.detailRow}>
                <Star color="#F59E0B" size={20} />
                <Text style={styles.detailText}>{selectedEvent.points} volunteer points</Text>
              </View>
            </View>

            <View style={styles.participantsSection}>
              <View style={styles.participantsHeader}>
                <Users color="#64748B" size={20} />
                <Text style={styles.participantsTitle}>
                  {selectedEvent.participants}/{selectedEvent.maxParticipants} Volunteers
                </Text>
              </View>
              <View style={styles.participantsProgress}>
                <View style={styles.participantsProgressBar}>
                  <View 
                    style={[
                      styles.participantsProgressFill, 
                      { width: `${progressPercentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.spotsLeftText}>
                  {spotsLeft} spots left
                </Text>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>About This Event</Text>
              <Text style={styles.descriptionText}>{selectedEvent.description}</Text>
            </View>

            {selectedEvent.requirements && (
              <View style={styles.requirementsSection}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                {selectedEvent.requirements.map((requirement, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <View style={styles.requirementBullet} />
                    <Text style={styles.requirementText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleGetDirections(selectedEvent)}
            >
              <Navigation color="#6366F1" size={20} />
              <Text style={styles.secondaryButtonText}>Directions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleContactOrganizer(selectedEvent)}
            >
              <Phone color="#6366F1" size={20} />
              <Text style={styles.secondaryButtonText}>Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.primaryButton, spotsLeft === 0 && styles.disabledButton]}
              onPress={() => handleJoinEvent(selectedEvent)}
              disabled={spotsLeft === 0}
            >
              <Heart color="#FFFFFF" size={20} />
              <Text style={styles.primaryButtonText}>
                {spotsLeft === 0 ? 'Event Full' : 'Join Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const renderEventCard = (event: Event) => {
    const IconComponent = categoryIcons[event.category];
    
    return (
      <TouchableOpacity 
        key={event.id} 
        style={styles.eventCard}
        onPress={() => handleMarkerPress(event)}
      >
        <View style={styles.eventHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: urgencyColors[event.urgency] + '20' }]}>
            <IconComponent color={urgencyColors[event.urgency]} size={20} />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventOrg}>{event.organization}</Text>
          </View>
          <View style={styles.urgencyBadge}>
            <View style={[styles.urgencyDot, { backgroundColor: urgencyColors[event.urgency] }]} />
          </View>
        </View>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventMeta}>
            <MapPin color="#64748B" size={14} />
            <Text style={styles.eventDistance}>{event.distance}</Text>
            <Clock color="#64748B" size={14} />
            <Text style={styles.eventDate}>{event.date}, {event.time}</Text>
          </View>
          
          <View style={styles.participantBar}>
            <View style={styles.participantInfo}>
              <Users color="#64748B" size={14} />
              <Text style={styles.participantText}>
                {event.participants}/{event.maxParticipants} volunteers
              </Text>
            </View>
            <View style={styles.pointsInfo}>
              <Star color="#F59E0B" size={14} />
              <Text style={styles.pointsText}>{event.points} pts</Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(event.participants / event.maxParticipants) * 100}%` }
              ]} 
            />
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
        
        <TouchableOpacity 
          style={[styles.joinButton, event.participants >= event.maxParticipants && styles.joinButtonDisabled]}
          onPress={() => handleJoinEvent(event)}
          disabled={event.participants >= event.maxParticipants}
        >
          <Text style={[styles.joinButtonText, event.participants >= event.maxParticipants && styles.joinButtonTextDisabled]}>
            {event.participants >= event.maxParticipants ? 'Event Full' : 'Join Event'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderCustomMarker = (event: Event) => {
    const IconComponent = categoryIcons[event.category];
    
    return (
      <Marker
        key={event.id}
        coordinate={event.location}
        onPress={() => handleMarkerPress(event)}
      >
        <View style={[
          styles.markerContainer, 
          { borderColor: urgencyColors[event.urgency] },
          event.urgency === 'high' && styles.urgentMarker
        ]}>
          <IconComponent color={urgencyColors[event.urgency]} size={16} />
          {event.urgency === 'high' && (
            <View style={styles.urgentPulse} />
          )}
        </View>
        <Callout tooltip>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>{event.title}</Text>
            <Text style={styles.calloutSubtitle}>{event.organization}</Text>
            <Text style={styles.calloutDetails}>
              {event.date}, {event.time} • {event.distance}
            </Text>
            <View style={styles.calloutFooter}>
              <Text style={styles.calloutSpots}>
                {event.maxParticipants - event.participants} spots left
              </Text>
              <Text style={styles.calloutPoints}>{event.points} pts</Text>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.username}>Ready to make a difference?</Text>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={() => playButtonSound()}>
            <Search color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Search color="#64748B" size={20} />
            <TextInput
              placeholder="Search events, locations..."
              placeholderTextColor="#64748B"
              style={styles.searchText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.activeToggle]}
            onPress={() => handleViewModeChange('map')}
          >
            <MapPin color={viewMode === 'map' ? '#FFFFFF' : '#94A3B8'} size={16} />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.activeToggleText]}>
              Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => handleViewModeChange('list')}
          >
            <List color={viewMode === 'list' ? '#FFFFFF' : '#94A3B8'} size={16} />
            <Text style={[styles.toggleText, viewMode === 'list' && styles.activeToggleText]}>
              List
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <View style={styles.mapPlaceholder}>
              <MapPin color="#64748B" size={48} />
              <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Tap on icons to view event details and join
              </Text>
              <View style={styles.webEventsList}>
                {filteredEvents.map((event) => {
                  const IconComponent = categoryIcons[event.category];
                  return (
                    <TouchableOpacity
                      key={event.id}
                      style={[styles.webEventItem, { borderLeftColor: urgencyColors[event.urgency] }]}
                      onPress={() => handleMarkerPress(event)}
                    >
                      <View style={[styles.webEventIcon, { backgroundColor: urgencyColors[event.urgency] + '20' }]}>
                        <IconComponent color={urgencyColors[event.urgency]} size={16} />
                      </View>
                      <View style={styles.webEventInfo}>
                        <Text style={styles.webEventTitle}>{event.title}</Text>
                        <Text style={styles.webEventDetails}>
                          {event.distance} • {event.date}, {event.time}
                        </Text>
                      </View>
                      <Text style={styles.webEventPoints}>{event.points} pts</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <MapView
              style={styles.map}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {filteredEvents.map(renderCustomMarker)}
            </MapView>
          )}
          
          <TouchableOpacity style={styles.filterButton} onPress={() => playButtonSound()}>
            <Filter color="#64748B" size={20} />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>
              {searchQuery ? `Search Results (${filteredEvents.length})` : 'Events Near You'}
            </Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => playButtonSound()}>
              <Filter color="#64748B" size={20} />
            </TouchableOpacity>
          </View>
          
          {filteredEvents.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Search color="#94A3B8" size={48} />
              <Text style={styles.noResultsTitle}>No events found</Text>
              <Text style={styles.noResultsText}>
                Try searching for a different location or check back later for new events.
              </Text>
            </View>
          ) : (
            filteredEvents.map(renderEventCard)
          )}
        </ScrollView>
      )}

      {renderEventModal()}
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
  },
  username: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 2,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Inter-Medium',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#475569',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 20,
  },
  webEventsList: {
    width: '100%',
    maxWidth: 400,
  },
  webEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  webEventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  webEventInfo: {
    flex: 1,
  },
  webEventTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  webEventDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  webEventPoints: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  urgentMarker: {
    shadowColor: '#EF4444',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  urgentPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    opacity: 0.3,
    zIndex: -1,
  },
  calloutContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    minWidth: 200,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  calloutDetails: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 8,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutSpots: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  calloutPoints: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  filterButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  eventsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  eventOrg: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  urgencyBadge: {
    alignItems: 'center',
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
    marginRight: 12,
  },
  eventDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  participantBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginLeft: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  joinButtonTextDisabled: {
    color: '#FFFFFF',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalCategoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitleInfo: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 2,
  },
  modalOrganization: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  urgencyBanner: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  urgencyBannerText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  urgencyBannerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  eventDetailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    marginLeft: 12,
  },
  participantsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginLeft: 8,
  },
  participantsProgress: {
    marginTop: 8,
  },
  participantsProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  participantsProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  spotsLeftText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'right',
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 24,
  },
  requirementsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginTop: 8,
    marginRight: 12,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
    marginLeft: 6,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
});