import { NovitusClient } from '../src';

async function sendNFPrintout() {
  // Initialize client
  const client = new NovitusClient({
    host: 'http://192.168.10.174:8888',
  });

  await client.initialize();

  // Create a non-fiscal printout (API expects 'textline' lowercase)
  const printout: any = {
    lines: [
      {
        textline: {
          text: '=== FISKAL OLMAYAN YAZDIRMA ===',
          bold: true,
          center: true,
          masked: false,
        },
      },
      {
        textline: {
          text: ' ',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Magaza: Gloria Perfume',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Tarih: 2025-10-13',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Saat: 14:30:00',
          masked: false,
        },
      },
      {
        textline: {
          text: ' ',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Siparis No: #12345',
          bold: true,
          masked: false,
        },
      },
      {
        textline: {
          text: ' ',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Test Mesaji:',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Bu bir fiskal olmayan test!',
          masked: false,
        },
      },
      {
        textline: {
          text: ' ',
          masked: false,
        },
      },
      {
        textline: {
          text: 'Tesekkur ederiz!',
          center: true,
          masked: false,
        },
      },
    ],
  };

  try {
    // Send non-fiscal printout with auto-confirm
    const response = await client.sendNFPrintout(printout, true);

    console.log('Printout sent successfully!');
    console.log('Request ID:', response.request.id);
    console.log('Status:', response.request.status);
    console.log('Device Status:', response.device.status);
  } catch (error) {
    console.error('Error sending printout:', error);
  }
}

// Run the example
sendNFPrintout();

