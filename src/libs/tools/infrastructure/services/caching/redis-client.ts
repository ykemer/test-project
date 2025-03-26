import {createClient} from 'redis';

// Configuration with reconnect strategy
const redisClient = createClient({
  url: process.env.REDIS_URL!,
  socket: {
    reconnectStrategy: retries => {
      if (retries > 10) {
        console.log('Max reconnection attempts reached, giving up');
        return new Error('Max reconnection attempts reached');
      }
      // Exponential backoff with max 3 second delay
      return Math.min(retries * 100, 3000);
    },
  },
});

// Better event handling
redisClient.on('error', err => {
  console.error('Redis Client Error', err);
});

redisClient.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('end', () => {
  console.log('Redis connection closed');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    throw err; // Rethrow to allow calling code to handle the error
  }
};

export {connectRedis, redisClient};
