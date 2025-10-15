import { NovitusClient, Receipt, VATRate, PaymentMethod } from '../src';

async function sendAdvancedReceipt() {
  const client = new NovitusClient({
    host: 'http://localhost:8888',
  });

  await client.initialize();

  // Create a receipt with multiple payment methods and buyer info
  const receipt: Receipt = {
    items: [
      {
        article: {
          name: 'Premium Headphones',
          ptu: VATRate.A,
          quantity: '1',
          price: '299.99',
          value: '299.99',
          unit: 'szt',
          code: '1234567890123',
        },
      },
      {
        article: {
          name: 'USB Cable',
          ptu: VATRate.A,
          quantity: '2',
          price: '15.00',
          value: '30.00',
          discountMarkup: '-5.00',
        },
      },
    ],
    payments: [
      {
        cash: {
          value: '200.00',
        },
      },
      {
        card: {
          name: PaymentMethod.Card,
          value: '129.99',
        },
      },
    ],
    summary: {
      total: '329.99',
      payIn: '329.99',
      discountMarkup: '-5.00',
    },
    buyer: {
      name: 'John Doe',
      nip: '1234567890',
      address: ['ul. Example 1', '00-001 Warsaw'],
    },
    printoutLines: [
      {
        textLine: {
          text: '═══════════════════════════',
          center: true,
          masked: false,
        },
      },
      {
        textLine: {
          text: 'THANK YOU FOR YOUR PURCHASE',
          bold: true,
          center: true,
          masked: false,
        },
      },
      {
        textLine: {
          text: 'Visit us again!',
          center: true,
          masked: false,
        },
      },
    ],
    systemInfo: {
      cashierName: 'Alice Smith',
      cashNumber: 'CASH-01',
      systemNumber: 'POS-123',
    },
    deviceControl: {
      openDrawer: true,
      feedAfterPrintout: true,
      paperCut: 'full',
    },
  };

  try {
    const response = await client.sendReceipt(receipt, true);

    console.log('Advanced receipt sent successfully!');
    console.log('Request ID:', response.request.id);
    console.log('Status:', response.request.status);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
sendAdvancedReceipt();



