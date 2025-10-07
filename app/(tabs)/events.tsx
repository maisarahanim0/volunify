import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Zap,
  Ear,
  Eye,
  Brain,
  Accessibility,
  Music,
  Sparkles,
} from 'lucide-react-native';

interface Event {
  id: string;
  title: string;
  organization: string;
  category: 'hearing' | 'visual' | 'cognitive' | 'mobility' | 'sensory' | 'general';
  urgency: 'low' | 'medium' | 'high';
  date: string;
  time: string;
  duration: string;
  location: string;
  participants: number;
  maxParticipants: number;
  points: number;
  description: string;
  featured: boolean;
  requirements?: string[];
  contactPhone?: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Emergency Sign Language Support',
    organization: 'Malaysian Association of the Deaf',
    category: 'hearing',
    urgency: 'high',
    date: 'Today',
    time: '2:00 PM',
    duration: '3 hours',
    location: 'Universiti Teknologi PETRONAS (UTP)',
    participants: 8,
    maxParticipants: 12,
    points: 100,
    description: 'Urgent need for sign language interpreters for emergency medical appointments.',
    featured: true,
    requirements: ['Basic sign language helpful', 'Patient and friendly attitude', 'Available for 3 hours'],
    contactPhone: '+60 12-345 6789',
  },
  {
    id: '2',
    title: 'Braille Book Preparation',
    organization: 'Vision Aid Foundation',
    category: 'visual',
    urgency: 'medium',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: '2 hours',
    location: 'Petaling Jaya Library',
    participants: 15,
    maxParticipants: 25,
    points: 60,
    description: 'Help transcribe educational materials into Braille for visually impaired students.',
    featured: false,
    requirements: ['Good communication skills', 'Patience and empathy', 'Familiar with reading'],
    contactPhone: '+60 12-987 6543',
  },
  {
    id: '3',
    title: 'Sensory Garden Maintenance',
    organization: 'Autism Spectrum Malaysia',
    category: 'sensory',
    urgency: 'low',
    date: 'This Weekend',
    time: '9:00 AM',
    duration: '4 hours',
    location: 'Taman Tun Dr Ismail',
    participants: 12,
    maxParticipants: 20,
    points: 80,
    description: 'Maintain therapeutic sensory garden for individuals with autism and sensory processing disorders.',
    featured: false,
    requirements: ['Experience with children preferred', 'Calm and patient demeanor', 'Available for full morning'],
    contactPhone: '+60 12-456 7890',
  },
  {
    id: '4',
    title: 'Wheelchair Basketball Coaching',
    organization: 'Malaysian Paralympic Association',
    category: 'mobility',
    urgency: 'medium',
    date: 'Next Week',
    time: '7:00 PM',
    duration: '3 hours',
    location: 'Stadium Malawati',
    participants: 6,
    maxParticipants: 10,
    points: 120,
    description: 'Train young athletes with mobility disabilities in wheelchair basketball techniques.',
    featured: true,
    requirements: ['Detail-oriented', 'Basic smartphone skills', 'Physical ability to walk around'],
    contactPhone: '+60 12-234 5678',
  },
];

const categories = [
  { id: 'all', name: 'All Events', icon: Sparkles, color: '#6366F1' },
  { id: 'hearing', name: 'Hearing', icon: Ear, color: '#EF4444' },
  { id: 'visual', name: 'Visual', icon: Eye, color: '#F59E0B' },
  { id: 'cognitive', name: 'Cognitive', icon: Brain, color: '#8B5CF6' },
  { id: 'mobility', name: 'Mobility', icon: Accessibility, color: '#10B981' },
  { id: 'sensory', name: 'Sensory', icon: Music, color: '#EC4899' },
];

const urgencyColors = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
};

const categoryIcons = {
  hearing: Ear,
  visual: Eye,
  cognitive: Brain,
  mobility: Accessibility,
  sensory: Music,
  general: Sparkles,
};

export default function Events() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredEvents(mockEvents);
    } else {
      setFilteredEvents(mockEvents.filter(event => event.category === categoryId));
    }
  };

  const handleJoinEvent = (event: Event) => {
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
        address: event.location,
        description: event.description,
        points: event.points.toString(),
        requirements: JSON.stringify(event.requirements || []),
        contactPhone: event.contactPhone || '',
      }
    });
  };

  const renderEventCard = ({ item: event }: { item: Event }) => {
    const IconComponent = categoryIcons[event.category];
    
    return (
      <TouchableOpacity style={[styles.eventCard, event.featured && styles.featuredCard]}>
        {event.featured && (
          <View style={styles.featuredBadge}>
            <Zap color="#FFFFFF" size={12} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.eventHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: urgencyColors[event.urgency] + '20' }]}>
            <IconComponent color={urgencyColors[event.urgency]} size={20} />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventOrg}>{event.organization}</Text>
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors[event.urgency] }]}>
            <Text style={styles.urgencyText}>{event.urgency.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Calendar color="#64748B" size={16} />
            <Text style={styles.detailText}>{event.date}, {event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock color="#64748B" size={16} />
            <Text style={styles.detailText}>Duration: {event.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin color="#64748B" size={16} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Users color="#64748B" size={16} />
            <Text style={styles.detailText}>
              {event.participants}/{event.maxParticipants} volunteers
            </Text>
            <View style={styles.pointsContainer}>
              <Star color="#F59E0B" size={16} />
              <Text style={styles.pointsText}>{event.points} points</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(event.participants / event.maxParticipants) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.spotsLeft}>
            {event.maxParticipants - event.participants} spots left
          </Text>
        </View>
        
        <Text style={styles.eventDescription}>{event.description}</Text>
        
        <TouchableOpacity 
          style={[
            styles.joinButton, 
            event.urgency === 'high' && styles.urgentButton,
            event.participants >= event.maxParticipants && styles.joinButtonDisabled
          ]}
          onPress={() => handleJoinEvent(event)}
          disabled={event.participants >= event.maxParticipants}
        >
          <Text style={[
            styles.joinButtonText,
            event.participants >= event.maxParticipants && styles.joinButtonTextDisabled
          ]}>
            {event.participants >= event.maxParticipants 
              ? 'Event Full' 
              : event.urgency === 'high' 
                ? 'Join Now - Urgent!' 
                : 'Join Event'
            }
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Discover Events</Text>
        <Text style={styles.headerSubtitle}>Find meaningful ways to help your community</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Search color="#64748B" size={20} />
            <TextInput
              placeholder="Search events, organizations..."
              placeholderTextColor="#64748B"
              style={styles.searchText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#64748B" size={20} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && { backgroundColor: category.color }
              ]}
              onPress={() => handleCategoryFilter(category.id)}
            >
              <IconComponent 
                color={isSelected ? '#FFFFFF' : category.color} 
                size={16} 
              />
              <Text style={[
                styles.categoryText,
                isSelected && { color: '#FFFFFF' }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.eventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Events' : 
             categories.find(cat => cat.id === selectedCategory)?.name + ' Events'}
          </Text>
          <Text style={styles.eventCount}>{filteredEvents.length} events</Text>
        </View>
        
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
        />
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  eventsSection: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  eventCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  eventsList: {
    paddingBottom: 20,
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
    position: 'relative',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  featuredBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  featuredText: {
    marginLeft: 4,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    flex: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  spotsLeft: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'right',
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
    paddingVertical: 14,
    alignItems: 'center',
  },
  urgentButton: {
    backgroundColor: '#EF4444',
  },
  joinButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  joinButtonTextDisabled: {
    color: '#FFFFFF',
  },
});