const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({});

const ORDERS_TABLE = process.env.ORDERS_TABLE;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

// Generate order number
function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `NMH-${timestamp}-${random}`;
}

// Generate email HTML
function generateEmailHTML(orderNumber, customer, items, total) {
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">${item.price.toFixed(2)}€</td>
      <td style="padding: 15px; border-bottom: 1px solid #e0e0e0; text-align: right; font-weight: 500;">${(item.price * item.quantity).toFixed(2)}€</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafaf8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 10px rgba(139, 157, 131, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #8b9d83 0%, #6b7d63 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px;">NATUREMAMA HERITAGE</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;">La force de la nature pour votre bien-être</p>
                </td>
              </tr>

              <!-- Success Message -->
              <tr>
                <td style="padding: 40px; text-align: center;">
                  <div style="width: 60px; height: 60px; background-color: #8b9d83; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                    <span style="color: white; font-size: 30px;">✓</span>
                  </div>
                  <h2 style="color: #6b7d63; margin: 0 0 10px 0; font-size: 24px; font-weight: 300;">Commande confirmée !</h2>
                  <p style="color: #6b6b6b; margin: 0; font-size: 16px;">Merci pour votre confiance</p>
                </td>
              </tr>

              <!-- Order Info -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ed; border-radius: 4px; padding: 20px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 10px 0; color: #6b6b6b; font-size: 14px;"><strong>Numéro de commande:</strong> ${orderNumber}</p>
                        <p style="margin: 0; color: #6b6b6b; font-size: 14px;"><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Customer Info -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <h3 style="color: #6b7d63; margin: 0 0 15px 0; font-size: 18px; font-weight: 400;">Informations de livraison</h3>
                  <p style="margin: 0; color: #6b6b6b; line-height: 1.6;">
                    ${customer.fullName}<br>
                    ${customer.street}<br>
                    ${customer.postalCode} ${customer.city}<br>
                    ${customer.phone}<br>
                    ${customer.email}
                  </p>
                </td>
              </tr>

              <!-- Order Items -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <h3 style="color: #6b7d63; margin: 0 0 15px 0; font-size: 18px; font-weight: 400;">Détails de la commande</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #f5f3ed;">
                        <th style="padding: 15px; text-align: left; color: #6b7d63; font-weight: 500; font-size: 14px;">Produit</th>
                        <th style="padding: 15px; text-align: center; color: #6b7d63; font-weight: 500; font-size: 14px;">Qté</th>
                        <th style="padding: 15px; text-align: right; color: #6b7d63; font-weight: 500; font-size: 14px;">Prix unit.</th>
                        <th style="padding: 15px; text-align: right; color: #6b7d63; font-weight: 500; font-size: 14px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHTML}
                      <tr>
                        <td colspan="3" style="padding: 20px 15px; text-align: right; font-weight: 500; color: #6b7d63; font-size: 16px; border-top: 2px solid #8b9d83;">Total</td>
                        <td style="padding: 20px 15px; text-align: right; font-weight: 500; color: #8b7355; font-size: 18px; border-top: 2px solid #8b9d83;">${total.toFixed(2)}€</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f3ed; padding: 30px 40px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #6b6b6b; font-size: 14px;">🌿 Merci de choisir NatureMama Heritage</p>
                  <p style="margin: 0; color: #8b7355; font-size: 12px;">1% de notre CA reversé à la préservation de la biodiversité</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px; text-align: center; background-color: #6b7d63;">
                  <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px;">
                    © 2026 NatureMama Heritage. Tous droits réservés.<br>
                    Compléments alimentaires naturels • Fabriqués en France • Certifiés Bio
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { customer, items, total } = body;

    // Validate input
    if (!customer || !items || !total) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Generate order number
    const orderNumber = generateOrderNumber();
    const orderDate = new Date().toISOString();

    // Save to DynamoDB
    const orderItem = {
      orderNumber,
      customer,
      items,
      total,
      orderDate,
      status: 'confirmed'
    };

    await docClient.send(new PutCommand({
      TableName: ORDERS_TABLE,
      Item: orderItem
    }));

    // Send confirmation email
    const emailHTML = generateEmailHTML(orderNumber, customer, items, total);

    const emailParams = {
      Source: SENDER_EMAIL,
      Destination: {
        ToAddresses: [customer.email]
      },
      Message: {
        Subject: {
          Data: `Confirmation de commande ${orderNumber} - NatureMama Heritage`,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: emailHTML,
            Charset: 'UTF-8'
          }
        }
      }
    };

    await sesClient.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderNumber,
        message: 'Order placed successfully'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
