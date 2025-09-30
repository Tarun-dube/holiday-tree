Next.js, Prisma & Amadeus Booking
System (TypeScript)
This project provides the foundational structure for a flight and hotel booking application. It
uses Next.js for the frontend, TypeScript for type safety, Prisma as the ORM for managing
internal data (like users and bookings), the Amadeus API for real-time travel data, and Tailwind
CSS for styling.
Getting Started
Follow these steps to get your local development environment up and running.
1. Prerequisites
●
●
●
●
Node.js (v18 or later)
A package manager like pnpm, npm, or yarn
PostgreSQL (or another database of your choice)
Amadeus for Developers Account: You will need API credentials. You can sign up for a
free account to get test keys.
2. Initial Setup
1. Create a Next.js TypeScript Project:
npx create-next-app@latest my-booking-app --typescript --tailwind --eslint
cd my-booking-app
2.
Install Dependencies: Install Prisma for the database and the Amadeus SDK for the API.
pnpm install @prisma/client amadeus lucide-react
# As a dev dependency
pnpm install -D prisma
3. Create .env File: Create a file named .env in the root of your project. Add your database
connection string and your Amadeus API keys.
# Example for PostgreSQL
DATABASE
URL=
_
"postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
# Amadeus API Credentials
AMADEUS
CLIENT
ID=
"YOUR
AMADEUS
CLIENT
_
_
_
_
AMADEUS
CLIENT
SECRET=
"YOUR
AMADEUS
ID"
_
CLIENT
_
_
_
_
_
SECRET"
3. Database Setup with Prisma
1.
2.
Initialize Prisma: This creates the prisma directory.
npx prisma init
Now, copy the content of the schema.prisma file I provided into prisma/schema.prisma.
Run Prisma Migration: This command creates the database tables based on your
schema.
npx prisma migrate dev --name init
4. Running the Application
Start the Next.js development server:
pnpm run dev
Open http://localhost:3000 in your browser.
Project Structure
●
●
●
/app: The main directory for your Next.js application (App Router).
○
/page.tsx: The home page component.
○
○
/api: Directory for backend API routes.
/prisma: Contains your Prisma schema and migrations.
/lib: For helper functions, utility files, and API clients.
/amadeus.ts: Initializes the Amadeus API client.
○
/prisma.ts: Initializes the Prisma client.
Next Steps & Roadmap
This foundation is just the beginning. Here is a suggested roadmap:
1.
Integrate Amadeus API for Searches:
○
The provided API route /api/flights/search is a starting point.
○
Crucial: The data from Amadeus is complex. You need to create functions to
transform this data into a simpler format that your UI components can easily display.
○
Build out the hotel search API route to call the Amadeus hotel search endpoints.
○
Implement the form submission on the frontend to call these API routes and display
the results.
2. User Authentication:
○
Implement a full authentication system using a library like NextAuth.js or Clerk.
○
Create sign-up, sign-in, and profile pages.
○
Protect routes like "My Trips"
.
3.
Implement the Booking Flow:
○
Flight/Hotel Selection: After a user searches, they will see a list of results. Allow
4.
them to select one.
○
Booking Confirmation: Before confirming a booking with Amadeus, you may need
to re-verify the price using the flight-offers-pricing endpoint, as prices can change.
○
Create Booking: Use the booking/flight-orders Amadeus endpoint to create the
official booking.
○
Store in Your DB: Once Amadeus confirms the booking, save the relevant details
(including the amadeusBookingId) into your own PostgreSQL database using Prisma.
This creates a permanent record for the user in your system.
"My Trips" Page:
○
Create a page that fetches booking data from your Prisma database for the
logged-in user.
○
Use the stored amadeusBookingId to call the Amadeus booking/flight-orders/{id}
endpoint if you need to retrieve the latest booking details or manage the booking.