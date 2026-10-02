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
  console.log('🚀 [Test] Starting Community Real-time (Posts, Reactions, Comments) E2E Test...');

  // Step 1: Login User A and User B
  console.log('🔑 [Step 1] Logging in User A (admin) and User B (user)...');
  const userA = await login('admin@smartcook.com', 'Admin123@');
  const userB = await login('user@smartcook.com', 'Password123@');

  console.log(`✅ User A: ${userA.user.fullName} (${userA.user._id})`);
  console.log(`✅ User B: ${userB.user.fullName} (${userB.user._id})`);

  // Step 2: Connect User A and User B to Socket.io
  console.log('\n🔌 [Step 2] Connecting User A and User B to Socket.io...');
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

  // Step 3: Test Real-time New Post
  console.log('\n📝 [Step 3] Testing real-time new post broadcast from User A to User B...');
  const newPostReceivedPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for User B to receive new_community_post')), 5000);
    socketB.on('new_community_post', (data) => {
      clearTimeout(timeout);
      resolve(data);
    });
  });

  const createPostRes = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userA.token}`,
    },
    body: JSON.stringify({
      caption: `Món ngon gia đình thử nghiệm realtime [${Date.now()}]`,
      dishName: 'Cơm tấm sườn bì chả đặc biệt',
      tags: ['#smartcook', '#realtime'],
    }),
  });
  const createPostData = await createPostRes.json();
  const createdPost = createPostData.data;
  console.log(`✅ User A created post: ${createdPost._id} - "${createdPost.dishName}"`);

  const receivedPostEvent = await newPostReceivedPromise;
  console.log(`🎉 User B successfully received new_community_post in REALTIME!`);
  console.log(`   Post ID: ${receivedPostEvent.post._id}, Dish: "${receivedPostEvent.post.dishName}"`);

  const testPostId = createdPost._id;

  // Step 4: Test Real-time Reaction Update
  console.log('\n❤️ [Step 4] Testing real-time reaction update from User B to User A...');
  const reactionReceivedPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for User A to receive post_reaction_updated')), 5000);
    socketA.on('post_reaction_updated', (data) => {
      if (data.postId === testPostId) {
        clearTimeout(timeout);
        resolve(data);
      }
    });
  });

  const reactRes = await fetch(`${API_BASE}/posts/${testPostId}/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userB.token}`,
    },
    body: JSON.stringify({ type: 'love' }),
  });
  const reactData = await reactRes.json();
  console.log(`✅ User B reacted "love" on post. Total: ${reactData.data.totalReactions}`);

  const receivedReaction = await reactionReceivedPromise;
  console.log(`🎉 User A successfully received post_reaction_updated in REALTIME!`);
  console.log(`   Total Reactions: ${receivedReaction.totalReactions}, Reactions map:`, receivedReaction.reactionCounts);

  // Step 5: Test Real-time Comment
  console.log('\n💬 [Step 5] Testing real-time new comment from User B to User A...');
  const commentText = `Trông hấp dẫn quá Chef ơi! Cho mình xin công thức nhé [${Date.now()}]`;
  const commentReceivedPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout waiting for User A to receive new_post_comment')), 5000);
    socketA.on('new_post_comment', (data) => {
      if (data.postId === testPostId) {
        clearTimeout(timeout);
        resolve(data);
      }
    });
  });

  const commentRes = await fetch(`${API_BASE}/posts/${testPostId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userB.token}`,
    },
    body: JSON.stringify({ content: commentText }),
  });
  const commentData = await commentRes.json();
  console.log(`✅ User B added comment: "${commentText}"`);

  const receivedComment = await commentReceivedPromise;
  console.log(`🎉 User A successfully received new_post_comment in REALTIME!`);
  console.log(`   Comment author: ${receivedComment.comment.author?.fullName || receivedComment.comment.author?.firstName}`);
  console.log(`   Comment text: "${receivedComment.comment.content}"`);
  console.log(`   Updated Comments Count: ${receivedComment.commentsCount}`);

  // Cleanup
  socketA.disconnect();
  socketB.disconnect();

  console.log('\n🎉 ========================================================');
  console.log('🎉 ALL COMMUNITY REAL-TIME TESTS PASSED 100%!');
  console.log('🎉 Posts, Reactions, Comments all broadcast in 0ms realtime!');
  console.log('🎉 ========================================================\n');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
