///notifications
const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();
const axios = require('axios');

// Mpesa credentials
const consumerKey = 'tv1aOkwmYPvHzFzigG6GfJHUAyDkGXTg8P2KuZGKYjoaORUl';
const consumerSecret = '6dybZl1R16NOJBZJVLJn3NjE7QA0E1JITRwFfXfsfj3aOvTnBLnHIXZQpoBlHecX';
const passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // This is the default passkey for sandbox
const shortcode = '174379'; // Default sandbox shortcode
// const callbackUrl = 'https://yourdomain.com/mpesa-callback'; // Replace with your actual callback URL
// const callbackUrl = 'https://2491-41-89-129-11.ngrok-free.app/mpesa-callback';
const callbackUrl = 'https://api.darajambili.herokuapp.com/express-payment';

// https://api.darajambili.herokuapp.com/express-payment
// ngrok http 3000  # or npx ngrok http 3000 if installed locally
// ngrok config add-authtoken 2ujUVykXGVZjDuN8fMbYVmUqVPK_3DFCmsQJQz3ejieqNVUYd

// Helper function to get Mpesa access token

// 🔹 Get M-Pesa Access Token
async function getMpesaAccessToken() {
  try {
      const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const response = await axios.get(
          'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
          {
              headers: {
                  'Authorization': `Basic ${auth}`
              }
          }
      );
      
      console.log('✅ M-Pesa Access Token:', response.data.access_token); // Debugging
      return response.data.access_token;
  } catch (error) {
      console.error('❌ Error getting access token:', error.response?.data || error);
      throw new Error('Failed to get Mpesa access token');
  }
}



// Premium subscription route with Mpesa integration
router.post('/premium-subscription', async (req, res) => {
  const { premium_type, premium_mode, amount, phone } = req.body;
  const userEmail = req.session.email;

  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or user not logged in.' });
  }

  try {
    // await createTransactionsTableIfNotExists();
    const accessToken = await getMpesaAccessToken();
    if (!accessToken) {
        console.error('❌ No access token received');
        return res.status(500).json({ error: 'Failed to obtain access token' });
    }
    console.log('🔹 Using Access Token:', accessToken); // Debugging

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(shortcode + passKey + timestamp).toString('base64');
    const phoneNumber = phone.startsWith('254') ? phone : `254${phone.slice(1)}`;

    const stkPushResponse = await axios.post(
  'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(Number(amount)),  // Ensure it's an integer
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl, 
    AccountReference: 'Beyboss',
    TransactionDesc: `${premium_type} Subscription`
  },
  {
    headers: { 
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }
);




    
    // Store transaction details in the database
    const insertTransactionQuery = `
      INSERT INTO mpesa_transactions 
      (user_email, phone_number, amount, premium_type, payment_mode, transaction_id, merchant_request_id, checkout_request_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await pool.promise().execute(insertTransactionQuery, [
      userEmail,
      phone,
      amount,
      premium_type,
      premium_mode,
      // transactionId,
      stkPushResponse.data.MerchantRequestID,
      stkPushResponse.data.CheckoutRequestID
    ]);
    
    // Update user status temporarily (will be confirmed after payment completion)
    const updateUserQuery = `UPDATE dietmaster_members SET status = ?, payment = ? WHERE email = ?`;
    await pool.promise().execute(updateUserQuery, [premium_type, premium_mode, userEmail]);
    
    return res.status(200).json({ 
      message: 'Payment initiated successfully. Please check your phone to complete the transaction.',
      requestId: stkPushResponse.data.CheckoutRequestID
    });
    
  } catch (error) {
    // console.error('Error processing payment:', error.response?.data || error.message || error);
    console.error('STK Push Error:', JSON.stringify(error.response?.data || error.message || error, null, 2));

    res.status(200).json({ 
      message: 'Payment initiated successfully. Please check your phone to complete the transaction',
      details: error.response?.data?.errorMessage || error.message
    });
  }
});

// Callback URL for Mpesa to send transaction results
router.post('/mpesa-callback', async (req, res) => {
  try {
    const callbackData = req.body;
    const resultCode = callbackData.Body.stkCallback.ResultCode;
    const merchantRequestId = callbackData.Body.stkCallback.MerchantRequestID;
    const checkoutRequestId = callbackData.Body.stkCallback.CheckoutRequestID;
    console.log('M-Pesa Callback Data:', JSON.stringify(req.body, null, 2));

    // Update transaction status
    const updateTransactionQuery = `
      UPDATE mpesa_transactions 
      SET 
        transaction_status = ?, 
        result_code = ?, 
        result_desc = ? 
      WHERE checkout_request_id = ?
    `;
    
    const status = resultCode === 0 ? 'COMPLETED' : 'FAILED';
    const resultDesc = callbackData.Body.stkCallback.ResultDesc;
    
    await pool.promise().execute(updateTransactionQuery, [
      status,
      resultCode.toString(),
      resultDesc,
      checkoutRequestId
    ]);
    
    // If payment was successful, update user's premium status (confirm it)
    if (resultCode === 0) {
      // Get user email from transaction
      const getUserQuery = `SELECT user_email FROM mpesa_transactions WHERE checkout_request_id = ?`;
      const [userRows] = await pool.promise().execute(getUserQuery, [checkoutRequestId]);
      
      if (userRows.length > 0) {
        const userEmail = userRows[0].user_email;
        // Confirm user premium status (if needed)
        // You might want to update additional fields to indicate payment is confirmed
        const confirmUserQuery = `UPDATE dietmaster_members SET payment_confirmed = 1 WHERE email = ?`;
        await pool.promise().execute(confirmUserQuery, [userEmail]);
      }
    }
    
    // Respond to Mpesa
    res.status(200).json({ ResultCode: 0, ResultDesc: "Callback received successfully" });
    
  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({ ResultCode: 1, ResultDesc: "Error processing callback" });
  }
});

// Route to check payment status (for client polling)
router.get('/check-payment-status/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const userEmail = req.session.email;

  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or user not logged in.' });
  }

  try {
    const query = `
      SELECT transaction_status, result_desc 
      FROM mpesa_transactions 
      WHERE checkout_request_id = ? AND user_email = ?
    `;
    
    const [rows] = await pool.promise().execute(query, [requestId, userEmail]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    return res.status(200).json({
      status: rows[0].transaction_status,
      message: rows[0].result_desc
    });
    
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

  

module.exports = router;
