import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  CreditCard,
  Shield,
  TrendingUp,
  Users,
  Target,
  Info,
  Star,
  Gift,
} from 'lucide-react-native';

interface Campaign {
  id: string;
  title: string;
  organization: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  category: string;
  urgent: boolean;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Emergency Medical Equipment',
    organization: 'Malaysian Disability Foundation',
    description: 'Funding urgently needed for specialized medical equipment for children with disabilities.',
    goal: 50000,
    raised: 32500,
    donors: 127,
    category: 'Healthcare',
    urgent: true,
  },
  {
    id: '2',
    title: 'Accessible Education Program',
    organization: 'Vision Aid Foundation',
    description: 'Support educational materials and technology for visually impaired students.',
    goal: 25000,
    raised: 18750,
    donors: 89,
    category: 'Education',
    urgent: false,
  },
  {
    id: '3',
    title: 'Sensory Therapy Center',
    organization: 'Autism Spectrum Malaysia',
    description: 'Building a new sensory therapy center for children with autism and sensory processing disorders.',
    goal: 100000,
    raised: 67200,
    donors: 234,
    category: 'Infrastructure',
    urgent: false,
  },
];

const donationAmounts = [20, 50, 100, 200, 500];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return `RM ${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.round((raised / goal) * 100);
  };

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please select or enter a valid donation amount.');
      return;
    }
    
    Alert.alert(
      'Donation Confirmation',
      `You're about to donate ${formatCurrency(amount)}.\n\nProcessing fee: RM 2.30\nTotal: ${formatCurrency(amount + 2.30)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => processDonation(amount) },
      ]
    );
  };

  const processDonation = (amount: number) => {
    // Simulate donation processing
    Alert.alert(
      'Thank You!',
      `Your donation of ${formatCurrency(amount)} has been processed successfully. You'll receive a receipt via email.`,
      [{ text: 'OK' }]
    );
    
    // Reset form
    setSelectedAmount(null);
    setCustomAmount('');
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const progressPercentage = getProgressPercentage(campaign.raised, campaign.goal);
    const isSelected = selectedCampaign === campaign.id;
    
    return (
      <TouchableOpacity
        key={campaign.id}
        style={[styles.campaignCard, isSelected && styles.selectedCampaign]}
        onPress={() => setSelectedCampaign(isSelected ? null : campaign.id)}
      >
        {campaign.urgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENT</Text>
          </View>
        )}
        
        <View style={styles.campaignHeader}>
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignTitle}>{campaign.title}</Text>
            <Text style={styles.campaignOrg}>{campaign.organization}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{campaign.category}</Text>
          </View>
        </View>
        
        <Text style={styles.campaignDescription}>{campaign.description}</Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
            />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.raisedAmount}>{formatCurrency(campaign.raised)}</Text>
            <Text style={styles.goalAmount}>of {formatCurrency(campaign.goal)} goal</Text>
          </View>
          <View style={styles.donorStats}>
            <Users color="#64748B" size={16} />
            <Text style={styles.donorCount}>{campaign.donors} donors</Text>
            <Text style={styles.progressPercent}>{progressPercentage}% funded</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EC4899', '#BE185D']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Heart color="#FFFFFF" size={32} />
          <Text style={styles.headerTitle}>Make a Difference</Text>
          <Text style={styles.headerSubtitle}>
            Your donation creates lasting impact in the disability community
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Shield color="#10B981" size={24} />
            <Text style={styles.infoTitle}>Transparent & Secure</Text>
          </View>
          <Text style={styles.infoText}>
            2% platform fee + RM 0.30 processing fee. 100% of your donation goes to the cause after fees.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Campaigns</Text>
          {mockCampaigns.map(renderCampaignCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Donation Amount</Text>
          
          <View style={styles.amountGrid}>
            {donationAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.selectedAmount
                ]}
                onPress={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
              >
                <Text style={[
                  styles.amountText,
                  selectedAmount === amount && styles.selectedAmountText
                ]}>
                  {formatCurrency(amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
            <TextInput
              style={styles.customAmountInput}
              placeholder="0.00"
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                setSelectedAmount(null);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.feeSummary}>
            <Text style={styles.feeSummaryTitle}>Donation Breakdown</Text>
            
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Your donation:</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(selectedAmount || parseFloat(customAmount) || 0)}
              </Text>
            </View>
            
            <View style={styles.feeRow}>
              <View style={styles.feeWithInfo}>
                <Text style={styles.feeLabel}>Processing fee:</Text>
                <Info color="#64748B" size={16} />
              </View>
              <Text style={styles.feeAmount}>RM 2.30</Text>
            </View>
            
            <View style={[styles.feeRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total charge:</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency((selectedAmount || parseFloat(customAmount) || 0) + 2.30)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.donateButton,
            (!selectedAmount && !customAmount) && styles.donateButtonDisabled
          ]}
          onPress={handleDonate}
          disabled={!selectedAmount && !customAmount}
        >
          <CreditCard color="#FFFFFF" size={20} />
          <Text style={styles.donateButtonText}>Donate Now</Text>
        </TouchableOpacity>

        <View style={styles.impactSection}>
          <Text style={styles.impactTitle}>Your Impact</Text>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <TrendingUp color="#10B981" size={24} />
              <Text style={styles.impactNumber}>RM 2.4M</Text>
              <Text style={styles.impactLabel}>Total raised</Text>
            </View>
            <View style={styles.impactStat}>
              <Users color="#3B82F6" size={24} />
              <Text style={styles.impactNumber}>15,000+</Text>
              <Text style={styles.impactLabel}>Lives impacted</Text>
            </View>
            <View style={styles.impactStat}>
              <Target color="#EC4899" size={24} />
              <Text style={styles.impactNumber}>98%</Text>
              <Text style={styles.impactLabel}>Goal success rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.rewardsSection}>
          <View style={styles.rewardsHeader}>
            <Gift color="#F59E0B" size={24} />
            <Text style={styles.rewardsTitle}>Donation Rewards</Text>
          </View>
          <Text style={styles.rewardsText}>
            Earn volunteer points for every donation! Points can be redeemed for certificates, 
            exclusive events, and recognition badges.
          </Text>
          <View style={styles.rewardsInfo}>
            <Star color="#F59E0B" size={16} />
            <Text style={styles.rewardsPoints}>1 point per RM donated</Text>
          </View>
        </View>
      </ScrollView>
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
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: -15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
  },
  campaignCard: {
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
  selectedCampaign: {
    borderWidth: 2,
    borderColor: '#EC4899',
  },
  urgentBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  campaignOrg: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#475569',
  },
  campaignDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  raisedAmount: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginRight: 8,
  },
  goalAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  donorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donorCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginLeft: 4,
    flex: 1,
  },
  progressPercent: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EC4899',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountButton: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  selectedAmount: {
    borderColor: '#EC4899',
    backgroundColor: '#EC4899',
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  selectedAmountText: {
    color: '#FFFFFF',
  },
  customAmountContainer: {
    marginBottom: 20,
  },
  customAmountLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    marginBottom: 8,
  },
  customAmountInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  feeSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  feeSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginRight: 4,
  },
  feeAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#EC4899',
  },
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 16,
    paddingVertical: 16,
    marginVertical: 20,
  },
  donateButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  donateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  impactSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  impactTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStat: {
    alignItems: 'center',
  },
  impactNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  rewardsSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#92400E',
    marginLeft: 8,
  },
  rewardsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 12,
  },
  rewardsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardsPoints: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 6,
  },
});