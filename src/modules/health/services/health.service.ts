import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  public constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @HealthCheck()
  public checkDbHealth() {
    return this.health.check([async () => this.mongoose.pingCheck('mongoose')]);
  }
}
