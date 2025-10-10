# Real Booking Implementation Guide

This document outlines the implementation of real booking functionality in your flight booking app.

## What's Been Implemented

### 1. Enhanced Database Schema
- Updated `Booking` model with real booking fields:
  - `amadeusBookingId`: Unique booking reference from Amadeus
  - `pnr`: Passenger Name Record
  - `ticketNumbers`: Array of ticket numbers
  - `stripePaymentIntentId`: Stripe payment intent ID
  - `paymentStatus`: Payment status (PENDING, COMPLETED, FAILED, REFUNDED)
  - `currency`: Booking currency
  - `flightDetails`: Complete flight offer details
  - `contactDetails`: Contact information

### 2. Stripe Payment Integration
- **Payment Intent Creation**: `/api/payments/create-intent`
- **Webhook Handler**: `/api/payments/webhook`
- **Stripe Configuration**: `src/lib/stripe.ts`
- Support for multiple currencies and proper amount formatting

### 3. Amadeus Flight Orders API Integration
- **Real Booking API**: `/api/flights/book` now integrates with Amadeus Flight Orders API
- Proper traveler data formatting
- Contact information handling
- Error handling with automatic refunds on booking failures

### 4. Enhanced User Experience
- **Payment Page**: Complete contact details collection and payment processing
- **Confirmation Page**: Detailed booking confirmation with flight details
- **My Bookings Page**: Comprehensive booking history with all details

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Database (already configured)
DATABASE_URL="your-database-url"

# NextAuth.js (already configured)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Amadeus API (already configured)
AMADEUS_CLIENT_ID="your-amadeus-client-id"
AMADEUS_CLIENT_SECRET="your-amadeus-client-secret"

# Stripe (NEW - Required for payments)
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Stripe
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add the keys to your `.env.local` file
4. Set up webhooks in Stripe Dashboard:
   - Endpoint URL: `https://yourdomain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Update Database Schema
```bash
npx prisma db push
```

### 4. Run the Application
```bash
npm run dev
```

## Booking Flow

### 1. Flight Search
- User searches for flights using the existing search functionality
- Results are displayed using Amadeus Flight Offers Search API

### 2. Flight Selection & Pricing
- User selects a flight
- Flight pricing is verified using Amadeus Flight Offers Pricing API
- Price is locked in for a limited time

### 3. Passenger Details
- User enters passenger information
- Data is validated and stored in session

### 4. Payment & Contact Details
- User enters contact information
- Payment intent is created with Stripe
- Payment is processed (in demo mode, simulated)
- Contact details are collected for booking

### 5. Real Booking Creation
- Payment is verified with Stripe
- Booking is created using Amadeus Flight Orders API
- Booking details are stored in your database
- User receives confirmation with PNR and ticket numbers

### 6. Booking Management
- Bookings are displayed in "My Bookings" page
- Full booking history with flight details, passenger info, and contact details
- Status tracking for both booking and payment

## Production Considerations

### 1. Stripe Elements Integration
The current implementation simulates payment processing. For production:

1. Install Stripe Elements:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

2. Create a payment form component with Stripe Elements
3. Replace the simulated payment in `/flights/payment/page.tsx`

### 2. Error Handling
- Implement proper error handling for payment failures
- Add retry mechanisms for Amadeus API calls
- Implement proper logging and monitoring

### 3. Security
- Validate all user inputs
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Secure webhook endpoints

### 4. Testing
- Test with Amadeus sandbox environment
- Test Stripe webhooks using Stripe CLI
- Implement comprehensive error scenarios

## API Endpoints

### Payment Endpoints
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Handle Stripe webhooks

### Booking Endpoints
- `POST /api/flights/book` - Create real flight booking
- `GET /api/bookings` - Get user bookings

## Database Schema Changes

The `Booking` model has been enhanced with:
- Real Amadeus booking references
- Stripe payment tracking
- Complete flight and contact details storage
- Proper status tracking for both booking and payment

## Next Steps

1. **Set up Stripe account and get API keys**
2. **Configure webhooks in Stripe Dashboard**
3. **Test the complete booking flow**
4. **Implement Stripe Elements for production**
5. **Add email notifications for booking confirmations**
6. **Implement booking cancellation functionality**

This implementation provides a solid foundation for real flight bookings with proper payment processing and booking management.
