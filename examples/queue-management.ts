import { NovitusClient } from '../src';

async function manageQueue() {
  // Initialize client
  const client = new NovitusClient({
    host: 'http://localhost:8888',
  });

  await client.initialize();

  try {
    // Get queue status
    console.log('Getting queue status...');
    const queueStatus = await client.getQueueStatus();
    console.log('Requests in queue:', queueStatus.requestsInQueue);

    // If queue has items, you can delete them
    if (queueStatus.requestsInQueue > 0) {
      console.log('\nDeleting queue...');
      const deleteResponse = await client.deleteQueue();
      console.log('Queue deletion status:', deleteResponse.status);

      // Check queue status again
      const newQueueStatus = await client.getQueueStatus();
      console.log('Requests in queue after deletion:', newQueueStatus.requestsInQueue);
    }
  } catch (error) {
    console.error('Error managing queue:', error);
  }
}

// Run the example
manageQueue();



