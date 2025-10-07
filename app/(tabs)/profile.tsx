import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Award, Clock, Heart, MapPin, Bell, Globe, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit2, Star, TrendingUp, Users, Calendar, Target, Gift, Medal, Zap, ChevronRight, Camera, Mail, Phone, ShoppingBag, Coffee, Book, Shirt, Headphones, Smartphone, Check } from 'lucide-react-native';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  color: string;
}

interface VolunteerStats {
  totalEvents: number;
  totalHours: number;
  totalDonations: number;
  currentStreak: number;
  level: number;
  points: number;
  nextLevelPoints: number;
}

interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'physical' | 'digital' | 'experience';
  icon: React.ReactNode;
  image: string;
  claimed: boolean;
  inStock: boolean;
  estimatedDelivery?: string;
}

const mockBadges: Badge[] = [
  {
    id: '1',
    title: 'First Timer',
    description: 'Completed your first volunteer event',
    icon: '🌟',
    earned: true,
    color: '#F59E0B',
  },
  {
    id: '2',
    title: 'Sign Language Helper',
    description: 'Helped 5 deaf community events',
    icon: '🤟',
    earned: true,
    color: '#EF4444',
  },
  {
    id: '3',
    title: 'Vision Aid Champion',
    description: 'Assisted 10 visually impaired individuals',
    icon: '👁️',
    earned: false,
    progress: 7,
    maxProgress: 10,
    color: '#3B82F6',
  },
  {
    id: '4',
    title: 'Generous Donor',
    description: 'Donated over RM 500 to causes',
    icon: '💝',
    earned: true,
    color: '#EC4899',
  },
  {
    id: '5',
    title: 'Streak Master',
    description: 'Volunteered 30 days in a row',
    icon: '🔥',
    earned: false,
    progress: 18,
    maxProgress: 30,
    color: '#EF4444',
  },
];

const mockStats: VolunteerStats = {
  totalEvents: 47,
  totalHours: 156,
  totalDonations: 850,
  currentStreak: 18,
  level: 7,
  points: 2340,
  nextLevelPoints: 2500,
};

const mockRewards: RewardItem[] = [
  {
    id: '1',
    title: 'Eco-Friendly Tote Bag',
    description: 'Sustainable canvas tote bag with Volunify logo',
    pointsCost: 500,
    category: 'physical',
    icon: <ShoppingBag color="#10B981" size={24} />,
    image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimed: false,
    inStock: true,
    estimatedDelivery: '5-7 business days',
  },
  {
    id: '2',
    title: 'Volunteer Certificate',
    description: 'Official recognition certificate for your contributions',
    pointsCost: 200,
    category: 'digital',
    icon: <Award color="#F59E0B" size={24} />,
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimed: true,
    inStock: true,
  },
  {
    id: '3',
    title: 'Coffee Shop Voucher',
    description: 'RM 20 voucher for local inclusive coffee shops',
    pointsCost: 800,
    category: 'experience',
    icon: <Coffee color="#8B4513" size={24} />,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimed: false,
    inStock: true,
  },
  {
    id: '4',
    title: 'Accessibility Guide Book',
    description: 'Comprehensive guide to making spaces more accessible',
    pointsCost: 300,
    category: 'physical',
    icon: <Book color="#3B82F6" size={24} />,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimed: false,
    inStock: true,
    estimatedDelivery: '3-5 business days',
  },
  {
    id: '5',
    title: 'Volunify T-Shirt',
    description: 'Premium cotton t-shirt with inspirational message',
    pointsCost: 600,
    category: 'physical',
    icon: <Shirt color="#EC4899" size={24} />,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimed: false,
    inStock: false,
  },
  {
    id: '6',
    title: 'Noise-Cancelling Headphones',
    description: 'Perfect for sensory-sensitive volunteers',
    pointsCost: 2000,
    category: 'physical',
    icon: <Headphones color="#6366F1" size={24} />,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    claimed: false,
    inStock: true,
    estimatedDelivery: '7-10 business days',
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Sarah Chen');
  const [email, setEmail] = useState('sarah.chen@email.com');
  const [phone, setPhone] = useState('+60 12-345 6789');
  const [bio, setBio] = useState('Passionate about making Malaysia more inclusive for everyone! 🇲🇾');
  
  // Settings states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Bahasa Malaysia', 'Thai', 'Vietnamese', 'Indonesian'];

  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const handleClaimReward = (reward: RewardItem) => {
    if (mockStats.points < reward.pointsCost) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.pointsCost - mockStats.points} more points to claim this reward.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (!reward.inStock) {
      Alert.alert(
        'Out of Stock',
        'This reward is currently out of stock. Please check back later.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Claim Reward',
      `Are you sure you want to claim "${reward.title}" for ${reward.pointsCost} points?${
        reward.estimatedDelivery ? `\n\nEstimated delivery: ${reward.estimatedDelivery}` : ''
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: () => {
            Alert.alert(
              'Reward Claimed!',
              `You've successfully claimed "${reward.title}"!\n\n${
                reward.category === 'digital'
                  ? 'Your digital reward will be sent to your email within 24 hours.'
                  : reward.category === 'physical'
                  ? 'You will receive shipping details via email shortly.'
                  : 'You will receive your voucher code via email within 1 hour.'
              }`,
              [{ text: 'Great!' }]
            );
          },
        },
      ]
    );
  };

  const renderBadge = (badge: Badge) => (
    <TouchableOpacity key={badge.id} style={[styles.badgeCard, !badge.earned && styles.lockedBadge]}>
      <View style={styles.badgeHeader}>
        <Text style={styles.badgeIcon}>{badge.icon}</Text>
        <View style={styles.badgeInfo}>
          <Text style={[styles.badgeTitle, !badge.earned && styles.lockedText]}>
            {badge.title}
          </Text>
          <Text style={[styles.badgeDescription, !badge.earned && styles.lockedText]}>
            {badge.description}
          </Text>
        </View>
        {badge.earned && (
          <View style={[styles.earnedBadge, { backgroundColor: badge.color }]}>
            <Award color="#FFFFFF" size={16} />
          </View>
        )}
      </View>
      
      {!badge.earned && badge.progress && badge.maxProgress && (
        <View style={styles.badgeProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(badge.progress / badge.maxProgress) * 100}%`, backgroundColor: badge.color }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {badge.progress}/{badge.maxProgress}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderStatCard = (icon: React.ReactNode, title: string, value: string, subtitle?: string) => (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderRewardItem = ({ item: reward }: { item: RewardItem }) => {
    const canAfford = mockStats.points >= reward.pointsCost;
    const isAvailable = reward.inStock && !reward.claimed;

    return (
      <View style={[styles.rewardCard, !isAvailable && styles.unavailableReward]}>
        <View style={styles.rewardImageContainer}>
          <View style={styles.rewardImage}>
            {reward.icon}
          </View>
          {reward.claimed && (
            <View style={styles.claimedBadge}>
              <Check color="#FFFFFF" size={12} />
            </View>
          )}
          {!reward.inStock && !reward.claimed && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
        
        <View style={styles.rewardContent}>
          <Text style={[styles.rewardTitle, !isAvailable && styles.unavailableText]}>
            {reward.title}
          </Text>
          <Text style={[styles.rewardDescription, !isAvailable && styles.unavailableText]}>
            {reward.description}
          </Text>
          
          <View style={styles.rewardFooter}>
            <View style={styles.rewardPoints}>
              <Star color="#F59E0B" size={16} />
              <Text style={[styles.rewardPointsText, !canAfford && styles.insufficientPoints]}>
                {reward.pointsCost} points
              </Text>
            </View>
            
            {reward.estimatedDelivery && (
              <Text style={styles.deliveryText}>{reward.estimatedDelivery}</Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.claimButton,
              reward.claimed && styles.claimedButton,
              !canAfford && styles.disabledClaimButton,
              !reward.inStock && styles.outOfStockButton,
            ]}
            onPress={() => handleClaimReward(reward)}
            disabled={reward.claimed || !canAfford || !reward.inStock}
          >
            <Text style={[
              styles.claimButtonText,
              reward.claimed && styles.claimedButtonText,
              (!canAfford || !reward.inStock) && styles.disabledClaimButtonText,
            ]}>
              {reward.claimed ? 'Claimed' : !reward.inStock ? 'Out of Stock' : !canAfford ? 'Need More Points' : 'Claim Reward'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    value?: string,
    hasToggle?: boolean,
    toggleValue?: boolean,
    onToggle?: (value: boolean) => void,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={hasToggle}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {hasToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
            thumbColor={toggleValue ? '#FFFFFF' : '#FFFFFF'}
          />
        ) : (
          <View style={styles.settingValue}>
            {value && <Text style={styles.settingValueText}>{value}</Text>}
            <ChevronRight color="#94A3B8" size={16} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {isEditing && (
        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>Edit Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            <Calendar color="#3B82F6" size={24} />,
            'Events Joined',
            mockStats.totalEvents.toString()
          )}
          {renderStatCard(
            <Clock color="#10B981" size={24} />,
            'Hours Volunteered',
            mockStats.totalHours.toString()
          )}
          {renderStatCard(
            <Heart color="#EC4899" size={24} />,
            'Donated',
            `RM ${mockStats.totalDonations}`
          )}
          {renderStatCard(
            <Zap color="#F59E0B" size={24} />,
            'Current Streak',
            `${mockStats.currentStreak} days`
          )}
        </View>
      </View>

      <View style={styles.badgesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.badgesContainer}>
            {mockBadges.map(renderBadge)}
          </View>
        </ScrollView>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        {renderSettingItem(
          <Bell color="#6366F1" size={20} />,
          'Push Notifications',
          undefined,
          true,
          pushNotifications,
          setPushNotifications
        )}
        
        {renderSettingItem(
          <Mail color="#6366F1" size={20} />,
          'Email Notifications',
          undefined,
          true,
          emailNotifications,
          setEmailNotifications
        )}
        
        {renderSettingItem(
          <MapPin color="#6366F1" size={20} />,
          'Location Sharing',
          undefined,
          true,
          locationSharing,
          setLocationSharing
        )}
        
        {renderSettingItem(
          <Globe color="#6366F1" size={20} />,
          'Language',
          selectedLanguage,
          false,
          undefined,
          undefined,
          () => Alert.alert('Language', 'Language selection coming soon!')
        )}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        {renderSettingItem(
          <Shield color="#6366F1" size={20} />,
          'Privacy & Security',
          undefined,
          false,
          undefined,
          undefined,
          () => Alert.alert('Privacy', 'Privacy settings coming soon!')
        )}
        
        {renderSettingItem(
          <HelpCircle color="#6366F1" size={20} />,
          'Help & Support',
          undefined,
          false,
          undefined,
          undefined,
          () => Alert.alert('Support', 'Help & support coming soon!')
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#EF4444" size={20} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Volunify v1.0.0</Text>
        <Text style={styles.footerSubtext}>Making Malaysia more inclusive together 🇲🇾</Text>
      </View>
    </ScrollView>
  );

  const renderRewardsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.rewardsHeader}>
        <View style={styles.pointsBalance}>
          <Star color="#F59E0B" size={24} />
          <Text style={styles.pointsBalanceText}>{mockStats.points} Points Available</Text>
        </View>
        <Text style={styles.rewardsSubtitle}>
          Redeem your volunteer points for amazing rewards!
        </Text>
      </View>
      
      <FlatList
        data={mockRewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.rewardsList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color="#6366F1" size={40} />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <View style={styles.levelContainer}>
              <Medal color="#F59E0B" size={16} />
              <Text style={styles.levelText}>Level {mockStats.level} Volunteer</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit2 color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>Progress to Level {mockStats.level + 1}</Text>
            <Text style={styles.pointsValue}>
              {mockStats.points}/{mockStats.nextLevelPoints} points
            </Text>
          </View>
          <View style={styles.levelProgressBar}>
            <View 
              style={[
                styles.levelProgressFill, 
                { width: `${(mockStats.points / mockStats.nextLevelPoints) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
            onPress={() => setActiveTab('overview')}
          >
            <User color={activeTab === 'overview' ? '#6366F1' : '#94A3B8'} size={16} />
            <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.activeTabButtonText]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'rewards' && styles.activeTabButton]}
            onPress={() => setActiveTab('rewards')}
          >
            <Gift color={activeTab === 'rewards' ? '#6366F1' : '#94A3B8'} size={16} />
            <Text style={[styles.tabButtonText, activeTab === 'rewards' && styles.activeTabButtonText]}>
              Rewards
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {activeTab === 'overview' ? renderOverviewTab() : renderRewardsTab()}
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  pointsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  pointsValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContent: {
    flex: 1,
  },
  editSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: -10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  statsSection: {
    marginTop: -10,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  badgesSection: {
    marginBottom: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  badgeCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 16,
  },
  lockedText: {
    color: '#94A3B8',
  },
  earnedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeProgress: {
    marginTop: 8,
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
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'right',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  // Rewards Tab Styles
  rewardsHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: -10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  pointsBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsBalanceText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginLeft: 8,
  },
  rewardsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  rewardsList: {
    paddingBottom: 20,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
  },
  unavailableReward: {
    opacity: 0.7,
  },
  rewardImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  outOfStockText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  unavailableText: {
    color: '#94A3B8',
  },
  rewardFooter: {
    marginBottom: 12,
  },
  rewardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rewardPointsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  insufficientPoints: {
    color: '#EF4444',
  },
  deliveryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  claimButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  claimedButton: {
    backgroundColor: '#10B981',
  },
  disabledClaimButton: {
    backgroundColor: '#E2E8F0',
  },
  outOfStockButton: {
    backgroundColor: '#FEE2E2',
  },
  claimButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  claimedButtonText: {
    color: '#FFFFFF',
  },
  disabledClaimButtonText: {
    color: '#94A3B8',
  },
});