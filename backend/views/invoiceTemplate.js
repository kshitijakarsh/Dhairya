export const generateInvoiceHTML = (user, gym, membership) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-box { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; }
            h2 { text-align: center; }
            .info { margin-bottom: 20px; }
            .info p { margin: 5px 0; }
            .total { font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h2>Gym Membership Invoice</h2>
            <div class="info">
              <p><strong>User:</strong> ${user.name}</p>
              <p><strong>Gym:</strong> ${gym.name}</p>
              <p><strong>Address:</strong> ${gym.address}</p>
              <p><strong>Membership Type:</strong> ${membership.membershipType}</p>
              <p class="total"><strong>Charges:</strong> ₹${membership.charges}</p>
            </div>
            <p>Thank you for choosing ${gym.name}!</p>
          </div>
        </body>
      </html>
    `;
  };

  
export default generateInvoiceHTML