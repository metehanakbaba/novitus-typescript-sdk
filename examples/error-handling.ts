import {
  NovitusClient,
  Receipt,
  VATRate,
  NovitusValidationError,
  NovitusApiError,
  NovitusNetworkError,
  NovitusAuthError,
} from '../src';

async function handleErrors() {
  const client = new NovitusClient({
    host: 'http://localhost:8888',
  });

  await client.initialize();

  // Example 1: Validation error
  try {
    const invalidReceipt: Receipt = {
      items: [], // Empty items will cause validation error
      summary: {
        total: '0.00',
      },
    };

    await client.sendReceipt(invalidReceipt);
  } catch (error) {
    if (error instanceof NovitusValidationError) {
      console.error('Validation Error:');
      console.error('- Message:', error.message);
      console.error('- Field:', error.field);
    }
  }

  // Example 2: Proper error handling
  const receipt: Receipt = {
    items: [
      {
        article: {
          name: 'Test Product',
          ptu: VATRate.B,
          quantity: '1',
          price: '10.00',
          value: '10.00',
        },
      },
    ],
    summary: {
      total: '10.00',
    },
  };

  try {
    const response = await client.sendReceipt(receipt, true);
    console.log('Success:', response.request.id);
  } catch (error) {
    if (error instanceof NovitusValidationError) {
      console.error('Validation failed:', error.message);
    } else if (error instanceof NovitusApiError) {
      console.error('API Error:');
      console.error('- Status Code:', error.statusCode);
      console.error('- Error Code:', error.errorCode);
      console.error('- Description:', error.errorDescription);
    } else if (error instanceof NovitusNetworkError) {
      console.error('Network Error:', error.message);
    } else if (error instanceof NovitusAuthError) {
      console.error('Authentication Error:', error.message);
    } else {
      console.error('Unknown Error:', error);
    }
  }
}

// Run the example
handleErrors();


