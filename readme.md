# Movie Ticket Booking

A full-stack web application for browsing movies, booking tickets, and managing shows and bookings with an admin dashboard. Built with React (frontend) and Node.js/Express (backend), integrated with Clerk for authentication, Stripe for payments, and MongoDB for data storage.

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
