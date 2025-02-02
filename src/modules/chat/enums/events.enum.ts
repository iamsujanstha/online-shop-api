export enum Events {
  // Connection Events
  JOIN = 'join',
  LEAVE = 'leave',
  USER_JOINED = 'user-joined',
  USER_LEFT = 'user-left',

  // Message Events
  SEND_MESSAGE = 'send-message',
  RECEIVE_MESSAGE = 'receive-message',
  REQUEST_ALL_MESSAGES = 'request-all-messages',
  SEND_ALL_MESSAGES = 'send-all-messages',

  // Chat Events
  CREATE_CHAT = 'create-chat',
  RECEIVE_CHAT = 'receive-chat',
  REQUEST_ALL_CHATS = 'request-all-chats',
  SEND_ALL_CHATS = 'send-all-chats',
  CHAT_ALREADY_EXISTS = 'chat-already-exists',

  // Error Events
  ERROR = 'error',
}
