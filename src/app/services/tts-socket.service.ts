import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class TtsSocketService {
  private socket?: Socket;

  private ensureSocket(): void {
    if (!this.socket) {
      this.socket = io();
    }
  }

  connect(): void {
    this.ensureSocket();
  }

  onResult(handler: any): void {
    this.ensureSocket();
    this.socket!.on('result', handler);
  }

  offResult(): void {
    this.socket?.off('result');
  }

  requestTts(text: string, userId: string, recipeId?: string): void {
    this.ensureSocket();
    this.socket!.emit('request', { text, userId, recipeId });
  }

  disconnect(): void {
    if (!this.socket) return;
    this.socket.off('result');
    this.socket.disconnect();
    this.socket = undefined;
  }
}