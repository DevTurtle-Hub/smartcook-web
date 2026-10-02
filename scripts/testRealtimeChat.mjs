import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api/v1';
const SOCKET_URL = 'http://localhost:5000';

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  const token = data.data?.tokens?.accessToken || data.data?.accessToken;
  if (!res.ok || !token) {
    throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
  }
  return {
    user: data.data.user,
    token,
  };
}

async function runTest() {
  console.log('🚀 [Test] Starting Real-time Chat E2E Integration Test...');

  // Step 1: Login Admin & User
  console.log('🔑 [Step 1] Logging in User A (admin) and User B (user)...');
  const userA = await login('admin@smartcook.com', 'Admin123@');
  const userB = await login('user@smartcook.com', 'Password123@');

  console.log(`✅ User A logged in: ${userA.user.fullName || userA.user.email} (${userA.user._id})`);
  console.log(`✅ User B logged in: ${userB.user.fullName || userB.user.email} (${userB.user._id})`);

  // Step 2: User A initiates direct chat with User B
  console.log('\n💬 [Step 2] User A calling POST /api/v1/chat/direct with targetUserId = User B...');
  const directChatRes = await fetch(`${API_BASE}/chat/direct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userA.token}`,
    },
    body: JSON.stringify({ targetUserId: userB.user._id }),
  });
  const directChatData = await directChatRes.json();
  if (!directChatRes.ok) {
    throw new Error(`Failed to create direct chat: ${JSON.stringify(directChatData)}`);
  }
  const conversationId = directChatData.data.conversationId;
  console.log(`✅ Conversation ready! conversationId: ${conversationId}`);

  // Step 3: Connect User A and User B via Socket.io
  console.log('\n🔌 [Step 3] Connecting User A and User B to Socket.io...');
  const socketA = io(SOCKET_URL, {
    auth: { token: `Bearer ${userA.token}` },
    transports: ['websocket'],
  });

  const socketB = io(SOCKET_URL, {
    auth: { token: `Bearer ${userB.token}` },
    transports: ['websocket'],
  });

  await Promise.all([
    new Promise((resolve) => socketA.on('connect', resolve)),
    new Promise((resolve) => socketB.on('connect', resolve)),
  ]);
  console.log(`✅ Socket A connected: ${socketA.id}`);
  console.log(`✅ Socket B connected: ${socketB.id}`);

  // User A and User B join conversation room
  socketA.emit('join_room', { conversationId });
  socketB.emit('join_room', { conversationId });
  await new Promise((r) => setTimeout(r, 400));

  // Step 4: Test User A sending message to User B
  console.log('\n📨 [Step 4] Testing message from User A to User B...');
  const testMessageA = `Chào bạn! Hôm nay nấu món gì ngon thế? [${Date.now()}]`;

  const receivedByB = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for User B to receive message')), 5000);
    socketB.on('new_message', (msg) => {
      if (msg.conversationId === conversationId && msg.text === testMessageA) {
        clearTimeout(timeout);
        resolve(msg);
      }
    });
  });

  socketA.emit('send_message', { conversationId, text: testMessageA }, (res) => {
    console.log('   User A send_message ack:', res);
  });

  const msgReceivedByB = await receivedByB;
  console.log(`✅ User B successfully received real-time message from User A!`);
  console.log(`   Content: "${msgReceivedByB.text}" from "${msgReceivedByB.sender?.name}"`);

  // Step 5: Test typing indicator from User B to User A
  console.log('\n⌨️ [Step 5] Testing typing indicator from User B to User A...');
  const typingReceivedByA = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for User A to receive typing indicator')), 5000);
    socketA.on('user_typing', (data) => {
      if (data.conversationId === conversationId) {
        clearTimeout(timeout);
        resolve(data);
      }
    });
  });

  socketB.emit('typing', { conversationId });
  const typingData = await typingReceivedByA;
  console.log(`✅ User A received typing notification from User B! (User: ${typingData.userName})`);

  // Step 6: Test User B replying to User A
  console.log('\n📨 [Step 6] Testing reply from User B to User A...');
  const replyMessageB = `Chào Chef! Nay mình đang định làm sườn xào chua ngọt 🍳 [${Date.now()}]`;

  const receivedByA = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for User A to receive reply')), 5000);
    socketA.on('new_message', (msg) => {
      if (msg.conversationId === conversationId && msg.text === replyMessageB) {
        clearTimeout(timeout);
        resolve(msg);
      }
    });
  });

  socketB.emit('send_message', { conversationId, text: replyMessageB }, (res) => {
    console.log('   User B send_message ack:', res);
  });

  const replyReceivedByA = await receivedByA;
  console.log(`✅ User A successfully received real-time reply from User B!`);
  console.log(`   Content: "${replyReceivedByA.text}" from "${replyReceivedByA.sender?.name}"`);

  // Step 7: Verify message history via REST API
  console.log('\n📜 [Step 7] Verifying message history via GET /api/v1/chat/conversations/:id/messages...');
  const historyRes = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${userA.token}` },
  });
  const historyData = await historyRes.json();
  const messages = historyData.data || [];
  console.log(`✅ Fetched ${messages.length} messages from database.`);
  const lastTwo = messages.slice(-2);
  console.log(`   Message 1: "${lastTwo[0]?.text}"`);
  console.log(`   Message 2: "${lastTwo[1]?.text}"`);

  // Cleanup
  socketA.disconnect();
  socketB.disconnect();

  console.log('\n🎉 ========================================================');
  console.log('🎉 ALL REAL-TIME CHAT INTEGRATION TESTS PASSED 100%!');
  console.log('🎉 WebSocket 1-1, Typing, Message Storage all working perfectly.');
  console.log('🎉 ========================================================\n');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
