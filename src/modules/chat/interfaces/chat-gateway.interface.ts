import { Socket } from 'socket.io';
import { CreateMessageDto } from '@chat/dto/create-message.dto';
/**
 * IChatGateway interface - provides a contract for the ChatGateway service.
 *
 * This interface defines the methods that should be implemented by the ChatGateway service.
 * It provides a way to ensure that the ChatGateway service adheres to a specific structure.
 */
export interface IChatGateway {
  /**
   * Handles the connection of a user to the chat.
   *
   * @param socket - The socket object representing the user's connection.
   */
  handleConnection(socket: Socket): Promise<void>;

  /**
   * Handles the disconnection of a user from the chat.
   *
   * @param socket - The socket object representing the user's connection.
   */
  handleDisconnect(socket: Socket): Promise<void>;

  /**
   * Handles a user joining a chat.
   *
   * @param socket - The socket object representing the user's connection.
   * @param chatId - The ID of the chat the user is joining.
   */
  handleJoin(socket: Socket, chatId: string): Promise<void>;

  /**
   * Handles a user sending a message.
   *
   * @param message - The message object containing the details of the message.
   */
  handleMessage(message: CreateMessageDto): Promise<void>;

  /**
   * Handles a request for all messages in a chat.
   *
   * @param socket - The socket object representing the user's connection.
   * @param chatId - The ID of the chat the user is requesting messages from.
   */
  requestAllMessages(socket: Socket, chatId: string): Promise<void>;

  /**
   * Sends a list of all chats a user is a part of.
   *
   * @param socket - The socket object representing the user's connection.
   * @param userId - The ID of the user requesting the list of chats.
   */
  requestAllChats(socket: Socket, userId: string): Promise<void>;

  /**
   * Handles a user leaving a chat.
   *
   * @param socket - The socket object representing the user's connection.
   * @param chatId - The ID of the chat the user is leaving.
   */
  handleLeave(socket: Socket, chatId: string): Promise<void>;
}
