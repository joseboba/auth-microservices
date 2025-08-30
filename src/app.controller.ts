// NestJS imports
import { Controller, Get } from '@nestjs/common';

// Third-party imports
import { Public } from 'incident-management-commons';

// Custom file imports
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthz')
  @Public()
  getHealthz(): string {
    return this.appService.getHealthz();
  }
}
