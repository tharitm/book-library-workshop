import { Injectable } from '@nestjs/common';
import { UserRole } from './entities/user.entity';

interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  token: string;
}

@Injectable()
export class AuthService {
  private users: AuthUser[] = [
    { id: '1', username: 'admin', role: UserRole.ADMIN, token: 'admin-token-123' },
    { id: '2', username: 'user', role: UserRole.USER, token: 'user-token-456' },
  ];

  validateCredentials(username: string, password: string): AuthUser | null {
    if (username === 'admin' && password === 'admin123') {
      return this.users[0];
    } else if (username === 'user' && password === 'user123') {
      return this.users[1];
    }
    return null;
  }

  validateToken(token: string): AuthUser | null {
    return this.users.find(user => user.token === token) || null;
  }

  generateToken(username: string): string {
    return `${username}-token-${Date.now()}`;
  }
}