import { Controller, Post, Body, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const user = this.authService.validateCredentials(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      success: true,
      data: {
        token: user.token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      message: 'Login successful',
    };
  }
}