# TravelBuddy Feature Implementation Workflow

This document outlines the features implemented during the recent development session, specifically focusing on **Real-time Notifications**, **Connection Management**, and **Private Messaging**.

## 1. Real-time Notifications Information Flow

This feature ensures users receive instant alerts for important events like friend requests and new messages.

### Workflow:
1.  **Trigger Event**: An action occurs on the backend (e.g., `sendFriendRequest` or `sendMessage`).
2.  **Database Creation**: A `Notification` document is created in MongoDB with:
    *   `recipient`: The user who needs to see the alert.
    *   `type`: The category (e.g., 'friend_request', 'message').
    *   `relatedId`: link to the relevant resource (friend request ID or chat ID).
3.  **Real-time Emission (Socket.IO)**:
    *   The backend emits a `newNotification` event to the specific socket room `user:{recipientId}`.
    *   This ensures only the target user receives the alert.
4.  **Frontend Reception**:
    *   `SocketContext.jsx` listens for `newNotification`.
    *   It dispatches an action to Redux (`addNotification`) to update the global state.
    *   It triggers a visible `toast` popup for immediate feedback.
5.  **UI Update**:
    *   **Navbar**: The bell icon updates its unread count badge.
    *   **Notification Page**: The new notification appears at the top of the list.

### Key Files:
*   **Backend**: `model/notification.model.js`, `controller/notification.controller.js`, `socket.js`
*   **Frontend**: `redux/slices/notificationSlice.js`, `context/SocketContext.jsx`, `pages/userPages/NotificationPage.jsx`

---

## 2. Connection Management (Friends)

This feature allows users to manage their social circle within the app.

### Workflow:
1.  **Sending a Request**:
    *   User clicks "Connect" on another user's profile.
    *   Backend creates a `FriendRequest` with status `pending`.
    *   Notification flow (as above) is triggered for the receiver.
2.  **Viewing Connections**:
    *   The **My Connections** page (`/connections`) fetches three lists:
        *   **Friends**: Users with `accepted` status.
        *   **Received**: Incoming requests pending action.
        *   **Sent**: Outgoing requests pending acceptance.
3.  **Accepting a Request**:
    *   User clicks "Accept" on the "Received" tab.
    *   Backend updates the request status to `accepted`.
    *   A notification is sent back to the original sender saying "X accepted your request".
4.  **Messaging**:
    *   Once connected, a "Message" button becomes available on the friend card, linking directly to the Private Chat page.

### Key Files:
*   **Backend**: `model/friendRequest.model.js`, `controller/friendRequest.controller.js`
*   **Frontend**: `redux/slices/friendSlice.js`, `pages/userPages/MyConnections.jsx`

---

## 3. Private Messaging (1-on-1)

This feature enables real-time private conversations between two users.

### Workflow:
1.  **Accessing Chat**:
    *   When navigating to `/private-chat/:userId`, the backend checks if a chat already exists between the two users.
    *   If yes, it returns the chat history. If no, it creates a new `PrivateChat` document.
2.  **Sending a Message**:
    *   User types and hits send.
    *   Frontend emits the message via API to the backend.
3.  **Backend Processing**:
    *   Saves `PrivateMessage` to MongoDB.
    *   Updates the `lastMessage` field of the `PrivateChat` document.
    *   **Broadcast**: Emits `message received` to the specific socket room `private:{chatId}`.
4.  **Real-time Application**:
    *   **If Receiver is in the Chat**: Their client, listening to `private:{chatId}`, instantly appends the new message to the list without refreshing.
    *   **If Receiver is ELSEWHERE**: The backend emits a `newNotification` to their `user:{userId}` room, alerting them of a new message.
5.  **User Interface**:
    *   Bubbles distinguish "My" messages (right aligned, colored) from "Their" messages (left aligned, gray).
    *   Timestamps show when messages were sent.

### Key Files:
*   **Backend**: `model/privateChat.model.js`, `model/privateMessage.model.js`, `controller/privateChat.controller.js`
*   **Frontend**: `redux/slices/privateChatSlice.js`, `pages/Chat/PrivateChatPage.jsx`
