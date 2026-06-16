# YelpCamp

YelpCamp is a full-stack campground discovery app built with Express, MongoDB, EJS, and Bootstrap. Users can browse campground listings on an interactive map, create an account, add campgrounds with photos, leave reviews, and manage the content they own.

This project was built as a classic server-rendered JavaScript web app and includes authentication, authorization, image uploads, geocoding, validation, flash messages, and production-oriented security middleware.

## Features

- Campground index with Mapbox clustering and popup previews
- Campground detail pages with image galleries, location maps, and map style switching
- User registration, login, logout, and session persistence with Passport
- Authenticated campground creation, editing, and deletion
- Cloudinary-backed image uploads through Multer
- Review creation and deletion with author-only permissions
- Server-side validation with Joi and HTML sanitization
- Flash messages for success and error feedback
- MongoDB-backed session storage
- Helmet content security policy and Mongo query sanitization

## Tech Stack

- Node.js and Express
- MongoDB, Mongoose, and MongoDB-backed sessions
- EJS with EJS Mate layouts
- Passport, Passport Local, and Passport Local Mongoose
- Cloudinary, Multer, and Multer Storage Cloudinary
- Mapbox Geocoding API and Mapbox GL JS
- Bootstrap 5
- Joi and sanitize-html
- Helmet and express-mongo-sanitize

## Getting Started

### Prerequisites

- Node.js 16.x
- npm 8.x
- MongoDB, either local or hosted
- Cloudinary account
- Mapbox access token

The original project metadata pins:

```json
{
  "node": "16.15.0",
  "npm": "8.5.5"
}
```

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/SinanSenkul/YelpCamp.git
cd YelpCamp
npm install
```

Create a `.env` file in the project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
MAPBOX_TOKEN=your_mapbox_access_token
DB_URL=your_mongodb_connection_string
LOCAL_URL=mongodb://localhost:27017/yelpcamp
SECRET=your_session_secret
```

`DB_URL` is used for a hosted database. If it is not provided, the app falls back to `LOCAL_URL`.

Start the app:

```bash
npm start
```

By default, the server runs on:

```text
http://localhost:3005
```

You can override the port with:

```bash
PORT=3000 npm start
```

On Windows PowerShell:

```powershell
$env:PORT=3000
npm start
```

## Seeding Data

The project includes a seeding script in `seeds/index.js` that creates sample campgrounds from the city data in `seeds/cities.js`.

Before running it, make sure MongoDB is available and that your Mapbox configuration is valid. Then run:

```bash
node seeds/index.js
```

The seed script clears existing campgrounds before creating sample data.

## Project Structure

```text
.
|-- app.js                  # Express app setup, middleware, sessions, routes
|-- cloudinary/             # Cloudinary and upload storage configuration
|-- controllers/            # Route handler logic
|-- models/                 # Mongoose models
|-- public/                 # Client-side scripts and styles
|-- routes/                 # Express routers
|-- seeds/                  # Sample data and database seeding script
|-- utils/                  # Async/error helpers
|-- views/                  # EJS templates, layouts, and partials
|-- validSchema.js          # Joi validation schemas
`-- Procfile                # Deployment process declaration
```

## Core Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/campgrounds` | List all campgrounds |
| `GET` | `/campgrounds/new` | Show the new campground form |
| `POST` | `/campgrounds` | Create a campground |
| `GET` | `/campgrounds/:id` | Show one campground |
| `GET` | `/campgrounds/:id/edit` | Show the edit form |
| `PATCH` | `/campgrounds/:id` | Update a campground |
| `DELETE` | `/campgrounds/:id` | Delete a campground |
| `POST` | `/campgrounds/:id/review` | Add a review |
| `DELETE` | `/campgrounds/:id/review/:reviewId` | Delete a review |
| `GET` | `/register` | Show registration form |
| `POST` | `/register` | Create a user |
| `GET` | `/login` | Show login form |
| `POST` | `/login` | Log in |
| `GET` | `/logout` | Log out |

## Notes

- This is a server-rendered Express app, not a single-page application.
- Images are uploaded to Cloudinary and stored on campground documents as URL/filename pairs.
- Map coordinates are generated from campground city and state values with Mapbox geocoding.
- Campground and review edits are protected so only the original author can modify or delete their own content.
- The app uses method override so HTML forms can trigger `PATCH` and `DELETE` routes.

## License

ISC
