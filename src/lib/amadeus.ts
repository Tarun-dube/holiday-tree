// This file initializes the Amadeus client for making API requests.
// It's best practice to keep this logic in a separate file.

import Amadeus from 'amadeus';;

// Ensure you have AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in your .env file
// The "!" at the end tells TypeScript that we are sure these values will exist.
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

export default amadeus;
