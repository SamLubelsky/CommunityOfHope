# WebSocket Events Documentation

This document describes the WebSocket events that the frontend can listen to for real-time updates.

## Connection

Connect to the WebSocket server:

```javascript
const socket = io('http://localhost:3000', {
  withCredentials: true,
})
```

## Chat Events

### `message`

Received when a new chat message is sent.

**Payload:**

```javascript
{
  senderId: string,
  message: string,
  chatId: string
}
```

### `messageReceived`

Echo of sent message back to sender.

**Payload:** Same as `message`

## Help Status Events

### `helpRequestsUpdated`

Received by all connected volunteers when there's any change to help requests. This sends the complete updated list.

**Payload:**

```javascript
{
  helpRequests: [
    {
      id: string,
      mom_id: string,
      volunteer_id?: string,
      description: string,
      emergency: boolean,
      active: boolean,
      placeId?: string,
      placeName?: string,
      volunteer_name?: string,
      mom_name?: string
    }
  ],
  timestamp: string
}
```

### `unclaimedHelpRequestsUpdated`

Received by a specific user when requesting their unclaimed help requests.

**Payload:**

```javascript
{
  helpRequests: [
    {
      id: string,
      mom_id: string,
      volunteer_id?: string,
      description: string,
      emergency: boolean,
      active: boolean,
      placeId?: string,
      placeName?: string,
      volunteer_name?: string,
      mom_name?: string
    }
  ],
  timestamp: string
}
```

### `requestHelpRequestsUpdate`

Client can emit this event to request the current list of help requests.

**Payload:** None required

### `helpStatusUpdate`

Received by a user when their personal help status changes (e.g., when their help request is accepted, deactivated, etc.).

**Payload:**

```javascript
{
  status: 'Accepted' | 'Not Accepted' | 'Requested' | 'Not Requested',
  momName?: string,        // For volunteers: name of the mom they're helping
  volunteerName?: string,  // For moms: name of the volunteer helping them
  helpId?: string,         // For volunteers: ID of the help request
  chatId?: string,         // Chat ID for communication
  description?: string,    // For moms: description of their help request
  timestamp: string
}
```

## Frontend Usage Examples

### Listening for Help Request Updates

```javascript
// Listen for help requests updates (complete list)
socket.on('helpRequestsUpdated', (data) => {
  console.log('Help requests updated:', data)
  // Replace the entire help requests list with the updated data
  updateHelpRequestsList(data.helpRequests)
})

// Listen for unclaimed help requests updates
socket.on('unclaimedHelpRequestsUpdated', (data) => {
  console.log('Unclaimed help requests updated:', data)
  // Update the unclaimed help requests list
  updateUnclaimedHelpRequestsList(data.helpRequests)
})

// Request current help requests
socket.emit('requestHelpRequestsUpdate')

// Listen for personal help status changes
socket.on('helpStatusUpdate', (data) => {
  console.log('Help status updated:', data)
  // Update UI based on the new status
  updateHelpStatus(data)
})
```

### Listening for Chat Messages

```javascript
// Listen for incoming messages
socket.on('message', (data) => {
  console.log('New message:', data)
  // Add message to chat UI
  addMessageToChat(data)
})

// Listen for message confirmation
socket.on('messageReceived', (data) => {
  console.log('Message received confirmation:', data)
  // Mark message as delivered
  markMessageAsDelivered(data)
})
```

### Sending Events

```javascript
// Send a chat message
socket.emit('message', {
  senderId: 'user123',
  message: 'Hello, I need help!',
  chatId: 'chat456',
})

// Request help requests update
socket.emit('requestHelpRequestsUpdate')
```

## Room Management

Volunteers are automatically added to the `volunteerRoom` when they connect. This ensures they receive all help request updates.

Moms are automatically added to the `momRoom` when they connect.

## Error Handling

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error)
  // Handle connection errors
})

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason)
  // Handle disconnection
})
```

## Authentication

The WebSocket connection uses the same session cookies as the HTTP API. Make sure to include credentials in the connection:

```javascript
const socket = io('http://localhost:3000', {
  withCredentials: true,
})
```

This ensures that the WebSocket connection is authenticated and the user's role is properly determined for room assignment.
