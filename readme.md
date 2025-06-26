# Movie Ticket Booking

A full-stack web application for browsing movies, booking tickets, and managing shows and bookings with an admin dashboard. Built with React (frontend) and Node.js/Express (backend), integrated with Clerk for authentication, Stripe for payments, and MongoDB for data storage.

---

## Live Demo

Visit the deployed website: [https://ticket-movie-ki-hi.vercel.app/](https://ticket-movie-ki-hi.vercel.app/)

---

## Features

- **User Authentication**: Secure login/signup via Clerk.
- **Browse Movies**: View now-showing movies, details, and trailers.
- **Book Tickets**: Select showtimes, seats, and pay via Stripe.
- **Favorites**: Mark movies as favorites.
- **My Bookings**: View and manage your bookings.
- **Admin Dashboard**: Add/list shows, view bookings, and analytics.
- **Email Notifications**: Receive booking confirmations and reminders.

---

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Clerk, Axios, React Router, Stripe, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose), Clerk, Stripe, Inngest, Nodemailer
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- Clerk account (for authentication)
- Stripe account (for payments)
- SMTP credentials (for email notifications)

### Environment Variables

#### Backend (`backend/.env`)

```
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
TMDB_API_KEY=your_tmdb_api_key
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SENDER_EMAIL=your_sender_email
```

#### Frontend (`frontend/.env`)

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
VITE_BASE_URL=https://your-backend-url/
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
```

### Installation

#### Backend

```sh
cd backend
npm install
npm run start
```

#### Frontend

```sh
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### User Endpoints

| Method | Endpoint                    | Description                       | Auth Required |
| ------ | --------------------------- | --------------------------------- | ------------- |
| GET    | `/api/user/bookings`        | Get current user's bookings       | Yes           |
| POST   | `/api/user/update-favorite` | Add/remove a movie from favorites | Yes           |
| GET    | `/api/user/favorites`       | Get user's favorite movies        | Yes           |

### Show Endpoints

| Method | Endpoint                | Description                            | Auth Required |
| ------ | ----------------------- | -------------------------------------- | ------------- |
| GET    | `/api/show/all`         | Get all upcoming shows (unique movies) | No            |
| GET    | `/api/show/:movieId`    | Get showtimes for a movie              | No            |
| GET    | `/api/show/now-playing` | Get now playing movies (admin only)    | Yes (Admin)   |
| POST   | `/api/show/add`         | Add new shows (admin only)             | Yes (Admin)   |

### Booking Endpoints

| Method | Endpoint                     | Description                                      | Auth Required |
| ------ | ---------------------------- | ------------------------------------------------ | ------------- |
| POST   | `/api/booking/create`        | Create a new booking and get Stripe payment link | Yes           |
| GET    | `/api/booking/seats/:showId` | Get occupied seats for a show                    | No            |

### Admin Endpoints

| Method | Endpoint                  | Description             | Auth Required |
| ------ | ------------------------- | ----------------------- | ------------- |
| GET    | `/api/admin/is-admin`     | Check if user is admin  | Yes (Admin)   |
| GET    | `/api/admin/dashboard`    | Get dashboard analytics | Yes (Admin)   |
| GET    | `/api/admin/all-shows`    | Get all upcoming shows  | Yes (Admin)   |
| GET    | `/api/admin/all-bookings` | Get all bookings        | Yes (Admin)   |

---

## Usage

1. **Register/Login**: Use Clerk authentication to sign up or log in.
2. **Browse Movies**: Explore movies on the home page or movies page.
3. **Book Tickets**: Select a movie, choose a showtime and seats, and proceed to payment.
4. **View Bookings**: Access "My Bookings" from the user menu.
5. **Admin Dashboard**: If you are an admin, access `/admin` for dashboard, show management, and bookings.

---

## Project Structure

- `backend/` - Express API, models, controllers, routes, email, and Inngest functions.
- `frontend/` - React app, components, pages, context, and assets.

---

## How the Project Works

### 1. Admin Workflow

- **Add Shows:**  
  The admin logs into the admin dashboard and can add new movie shows by selecting a movie (from TMDB or existing), specifying one or more dates and times, and setting a ticket price for each show.
- **Show Management:**  
  Each show is stored with its movie reference, show date/time, price, and a record of occupied seats.
- **Dashboard:**  
  The admin dashboard provides analytics, a list of all shows, and all bookings.

### 2. User Workflow

- **Browse Movies:**  
  Users can browse all available movies and see details, including showtimes and trailers.
- **Book Tickets:**  
  Users select a movie, pick a date and time, and then choose their seats from the available options.
- **Seat Selection Logic:**
  - When a user selects seats and proceeds to book, those seats are temporarily locked for that user.
  - The user is redirected to Stripe for payment.
  - If the payment is completed within 10 minutes, the booking is confirmed and the seats are marked as paid.
  - If the payment is not completed within 10 minutes, the booking is cancelled and the seats are released automatically, making them available for other users.
- **My Bookings:**  
  Users can view all their bookings, including payment status and seat numbers. If payment failed or was incomplete, they can retry payment from this section.
- **Favorites:**  
  Users can mark movies as favorites for quick access.

### 3. Email Notifications

- **Booking Confirmation:**  
  After successful payment, users receive a confirmation email with booking details.
- **Reminders:**  
  Users receive reminder emails before their show starts.
- **New Show Notifications:**  
  When a new show is added, all users are notified via email.

### 4. Seat Locking and Release

- When a user initiates a booking, selected seats are locked for up to 10 minutes.
- If payment is not completed in that window, an automated background process (using Inngest) releases the seats and deletes the incomplete booking.
- This ensures fair access and prevents double-booking.

### 5. Security and Roles

- **Authentication:**  
  All users must sign up or log in using Clerk.
- **Admin Access:**  
  Only users with the admin role (set in Clerk) can access admin endpoints and dashboard.
- **API Security:**  
  All sensitive endpoints require authentication and, where appropriate, admin authorization.

### 6. Payments

- **Stripe Integration:**  
  All payments are processed securely via Stripe Checkout.
- **Webhooks:**  
  Stripe webhooks are used to confirm payment and trigger booking confirmation and email notifications.

### 7. Data Storage

- **MongoDB:**  
  All movies, shows, bookings, and user data are stored in MongoDB.
- **External API:**  
  Movie metadata is fetched from TMDB when adding new movies.

---

This flow ensures a smooth experience for both admins and users, with robust handling of seat availability, payments, and notifications.

---

## Deployment

- Both frontend and backend are configured for Vercel deployment.
- See `vercel.json` in each folder for rewrite/build settings.

---

## License

MIT

---

---

## Acknowledgements

- [Clerk](https://clerk.com/)
- [Stripe](https://stripe.com/)
- [TMDB](https://www.themoviedb.org/)
- [Inngest](https://www.inngest.com/)
- [Vercel](https://vercel.com/)
