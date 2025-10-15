import { NovitusClient, Receipt, VATRate } from '../src';

async function sendBasicReceipt() {
  // Initialize client
  const client = new NovitusClient({
    host: 'http://localhost:8888',
  });

  // Initialize the client (obtains token automatically)
  await client.initialize();

  // Create a simple receipt
  const receipt: Receipt = {
    items: [
      {
        article: {
          name: 'Tasty Pizza with Extra Cheese',
          ptu: VATRate.B,
          quantity: '2',
          price: '25.00',
          value: '50.00',
        },
      },
      {
        article: {
          name: 'Coca Cola 0.5L',
          ptu: VATRate.B,
          quantity: '1',
          price: '5.00',
          value: '5.00',
        },
      },
    ],
    summary: {
      total: '55.00',
      payIn: '60.00',
      change: '5.00',
    },
    printoutLines: [
      {
        textLine: {
          text: 'Thank you for your purchase!',
          bold: true,
          center: true,
          masked: false,
        },
      },
    ],
  };

  try {
    // Send receipt with auto-confirm
    const response = await client.sendReceipt(receipt, true);

    console.log('Receipt sent successfully!');
    console.log('Request ID:', response.request.id);
    console.log('Status:', response.request.status);
    console.log('Device Status:', response.device.status);
  } catch (error) {
    console.error('Error sending receipt:', error);
  }
}

// Run the example
sendBasicReceipt();


