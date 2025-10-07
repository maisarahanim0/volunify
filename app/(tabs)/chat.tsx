import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MessageCircle,
  Search,
  Send,
  MoreHorizontal,
  Users,
  Bell,
  Clock,
  CheckCheck,
} from 'lucide-react-native';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  read: boolean;
}

interface Chat {
  id: string;
  name: string;
  type: 'organization' | 'volunteer' | 'group';
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  avatar: string;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Malaysian Association of the Deaf',
    type: 'organization',
    lastMessage: 'Thank you for joining our sign language cafe event!',
    timestamp: '2 min ago',
    unreadCount: 2,
    online: true,
    avatar: '🏢',
  },
  {
    id: '2',
    name: 'Vision Aid Volunteers',
    type: 'group',
    lastMessage: 'Sarah: The grocery shopping session went great today',
    timestamp: '15 min ago',
    unreadCount: 0,
    online: false,
    avatar: '👥',
  },
  {
    id: '3',
    name: 'Dr. Ahmad (Event Coordinator)',
    type: 'volunteer',
    lastMessage: 'Are you available for tomorrow\'s therapy session?',
    timestamp: '1 hour ago',
    unreadCount: 1,
    online: true,
    avatar: '👨‍⚕️',
  },
  {
    id: '4',
    name: 'Autism Support Network',
    type: 'organization',
    lastMessage: 'New training materials are now available in the resource center',
    timestamp: '3 hours ago',
    unreadCount: 0,
    online: false,
    avatar: '🧠',
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hi! Thanks for joining our sign language cafe event today.',
    sender: 'other',
    timestamp: '2:30 PM',
    read: true,
  },
  {
    id: '2',
    text: 'It was my pleasure! The community was so welcoming.',
    sender: 'user',
    timestamp: '2:32 PM',
    read: true,
  },
  {
    id: '3',
    text: 'We really appreciate volunteers like you who are passionate about inclusion.',
    sender: 'other',
    timestamp: '2:35 PM',
    read: true,
  },
  {
    id: '4',
    text: 'Would you be interested in our upcoming Braille workshop next week?',
    sender: 'other',
    timestamp: '2:38 PM',
    read: false,
  },
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, selectedChat === item.id && styles.selectedChat]}
      onPress={() => setSelectedChat(item.id)}
    >
      <View style={styles.chatHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
          {item.online && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatTitleRow}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={styles.chatMessageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.chatMeta}>
        <View style={styles.chatType}>
          {item.type === 'organization' && <Users color="#3B82F6" size={12} />}
          {item.type === 'group' && <MessageCircle color="#10B981" size={12} />}
          {item.type === 'volunteer' && <Bell color="#F59E0B" size={12} />}
          <Text style={[styles.typeText, { color: 
            item.type === 'organization' ? '#3B82F6' : 
            item.type === 'group' ? '#10B981' : '#F59E0B' 
          }]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>{item.timestamp}</Text>
        {item.sender === 'user' && (
          <CheckCheck 
            color={item.read ? '#10B981' : '#94A3B8'} 
            size={14} 
          />
        )}
      </View>
    </View>
  );

  const sendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#6366F1', '#4F46E5']}
          style={styles.chatHeader}
        >
          <View style={styles.chatHeaderContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedChat(null)}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.chatTitleContainer}>
              <Text style={styles.chatHeaderTitle}>Malaysian Association of the Deaf</Text>
              <Text style={styles.chatHeaderSubtitle}>Online now</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <FlatList
          data={mockMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />

        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>
          Connect with organizations and fellow volunteers
        </Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Search color="#64748B" size={20} />
            <TextInput
              placeholder="Search conversations..."
              placeholderTextColor="#64748B"
              style={styles.searchText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.chatsContainer}>
        <View style={styles.chatsHeader}>
          <Text style={styles.chatsTitle}>Recent Conversations</Text>
          <Text style={styles.chatsCount}>{mockChats.length} chats</Text>
        </View>

        <FlatList
          data={mockChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatsList}
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
    marginBottom: 8,
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
  chatsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  chatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chatsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  chatsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  chatsList: {
    paddingBottom: 20,
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedChat: {
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    textAlign: 'center',
    lineHeight: 48,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  chatMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  chatMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  // Chat Screen Styles
  chatHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  chatTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#6366F1',
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#1E293B',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginRight: 4,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
});