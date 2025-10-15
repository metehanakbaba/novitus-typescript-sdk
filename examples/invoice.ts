import { NovitusClient } from '../src';

async function sendInvoiceWithNonfiscal() {
  // Initialize client
  const client = new NovitusClient({
    host: 'http://192.168.10.174:8888',
  });

  await client.initialize();

  // Create an invoice with nonfiscal section (using API format)
  const invoice: any = {
    info: {
      number: 'FAK/2025/123',
      copy_count: 0,
      date_of_sell: '13.10.2025',
      date_of_payment: '13.10.2025',
      payment_form: 'Gotówka',
      paid: '123.00',
    },
    buyer: {
      name: 'Firma ABC Sp. z o.o.',
      id_type: 'nip',
      id: 'PL1234567890',
      label_type: 'recipient',
      address: [
        'ul. Przykładowa 123',
        '00-001 Warszawa',
        'Polska',
      ],
    },
    recipient: {
      name: 'Jan Kowalski',
      print_info: 'place_for_signature',
    },
    seller: {
      name: 'Sklep Gloria Perfume',
      print_info: 'place_for_signature',
    },
    options: {
      skip_description_value_to_pay: false,
      skip_block_gross_value_in_accounting_tax: false,
      buyer_bold: true,
      seller_bold: true,
      buyer_nip_bold: true,
      seller_nip_bold: false,
      print_label_description_symbol_in_invoice_header: false,
      print_position_number_invoice: true,
      to_pay_label_before_acounting_tax_block: false,
      print_cents_in_words: false,
      dont_print_sell_date_if_equal_create_date: false,
      dont_print_seller_data_in_header: false,
      dont_print_sell_items_description: false,
      enable_payment_form: true,
      dont_print_customer_data: false,
      print_payd_in_cash: false,
      skip_seller_label: false,
      print_invoice_tax_label: true,
    },
    items: [
      {
        article: {
          ptu: 'A',
          name: 'Perfumy Luxury',
          code: {
            print_as: 'barcode',
            value: '5901234567890',
          },
          unit: 'szt.',
          price: '99.00',
          value: '99.00',
          quantity: '1',
        },
      },
      {
        article: {
          ptu: 'B',
          name: 'Krem do twarzy',
          code: {
            print_as: 'text',
            value: 'KREM-001',
          },
          unit: 'szt.',
          price: '24.00',
          value: '24.00',
          quantity: '1',
        },
      },
    ],
    summary: {
      total: '123.00',
      pay_in: '150.00',
      change: '27.00',
    },
    printout_lines: [
      {
        special_line: {
          type: 'underline',
        },
      },
      {
        textline: {
          big: false,
          bold: true,
          text: '=== SEKCJA NIEFISKALNA ===',
          center: true,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        special_line: {
          type: 'underline',
        },
      },
      {
        textline: {
          big: false,
          bold: false,
          text: ' ',
          center: false,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        textline: {
          big: false,
          bold: false,
          text: 'Dodatkowe informacje:',
          center: false,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        textline: {
          big: false,
          bold: false,
          text: 'Dziękujemy za zakup!',
          center: false,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        textline: {
          big: false,
          bold: false,
          text: ' ',
          center: false,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        qrcode: {
          text: 'https://gloria-perfume.pl/invoice/123',
          masked: false,
        },
      },
      {
        textline: {
          big: false,
          bold: false,
          text: ' ',
          center: false,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        special_line: {
          type: 'last_receipt_number',
        },
      },
      {
        textline: {
          big: false,
          bold: false,
          text: ' ',
          center: false,
          invers: false,
          masked: false,
          font_number: 0,
        },
      },
      {
        barcode: {
          text: '5901234567890',
          masked: false,
        },
      },
    ],
    system_info: {
      cashier_name: 'Anna Nowak',
      cash_number: '1',
      system_number: {
        print_as: 'qrcode',
        value: 'SYS2025/10/13',
      },
    },
    device_control: {
      open_drawer: true,
      paper_cut: 'full',
    },
  };

  try {
    // Send invoice with auto-confirm
    const response = await client.sendInvoice(invoice, true);

    console.log('✅ Invoice with nonfiscal section sent successfully!');
    console.log('Request ID:', response.request.id);
    console.log('Status:', response.request.status);
    console.log('Device Status:', response.device.status);
    console.log('\n📄 Invoice includes:');
    console.log('- Fiscal items with barcodes');
    console.log('- Nonfiscal section with:');
    console.log('  * Text lines');
    console.log('  * QR code');
    console.log('  * Barcode');
    console.log('  * Special lines (underline, receipt number)');
  } catch (error) {
    console.error('❌ Error sending invoice:', error);
  }
}

// Run the example
sendInvoiceWithNonfiscal();

