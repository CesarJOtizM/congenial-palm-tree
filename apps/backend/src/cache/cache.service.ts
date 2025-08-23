import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting cache for key '${key}':`, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error(`Error setting cache for key '${key}':`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache for key '${key}':`, error);
    }
  }

  async getKeys(pattern: string): Promise<string[]> {
    try {
      const keys = await this.redis.keys(pattern);
      return keys;
    } catch (error) {
      this.logger.error(`Error getting keys for pattern '${pattern}':`, error);
      return [];
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache for key '${key}':`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
    }
  }
}
