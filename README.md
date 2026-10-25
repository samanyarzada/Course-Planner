# Course Planner

A web-based course planning application that helps students explore courses, review course details, plan their study schedules, and manage their budgets. Administrators can manage courses and review messages submitted through the contact form.

## Features

- **Course Catalog:** Browse available courses and view course details.
- **Course Filtering:** Find courses using the available filters.
- **Study Planning:** Create a study plan and check for schedule conflicts.
- **Budget Management:** Check study plans against a spending limit.
- **Contact Form:** Submit questions and enquiries.
- **Admin Authentication:** Secure administrator access using JSON Web Tokens (JWT).
- **Course Management:** Add, edit, and delete courses.
- **Message Management:** View and delete submitted messages.
- **Responsive Interface:** Built with React and styled using utility CSS classes.

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- Tailwind CSS utility classes

### Backend
- Node.js
- Express
- JSON Web Tokens (JWT)
- CORS
- JSON files for data storage

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

## Project Structure

```text
Course-Planner/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.local
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── data/
│   │   ├── courses.json
│   │   └── messages.json
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Requirements

Install the following before running the project locally:

- Node.js and npm
- Git (optional, but recommended)

## Installation and Local Development

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd Course-Planner
```

Replace `YOUR_REPOSITORY_URL` with the URL of your Git repository.

### 2. Configure the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```dotenv
PORT=3000
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_admin_password
JWT_SECRET=replace_with_a_long_random_secret
```

Use your own secure values. Never commit the `.env` file to a public repository.

Start the backend:

```bash
npm run dev
```

The backend should be available at:

`http://localhost:3000`

Check the health endpoint:

`http://localhost:3000/api/health`

A successful response looks like:

```json
{
  "status": "ok"
}
```

### 3. Configure the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create or update `frontend/.env.local`:

```dotenv
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in the terminal, usually:

`http://localhost:5173`

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port used by the Express server. Render provides this automatically in production. |
| `ADMIN_USERNAME` | Administrator username. |
| `ADMIN_PASSWORD` | Administrator password. |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend, without a trailing slash or `/api` suffix. |

Example production value:

```dotenv
VITE_API_URL=https://course-planner-1-dmxb.onrender.com
```

Vite environment variables prefixed with `VITE_` are exposed to the frontend. Do not store passwords, JWT secrets, or other private credentials in frontend environment variables.

## API Endpoints

The backend exposes the following endpoints.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| GET | `/api/health` | Check server health | Public |
| POST | `/api/login` | Authenticate an administrator | Public |
| GET | `/api/courses` | Retrieve all courses | Public |
| GET | `/api/courses/:id` | Retrieve a course by ID | Public |
| POST | `/api/courses` | Create a course | Admin |
| PUT | `/api/courses/:id` | Update a course | Admin |
| DELETE | `/api/courses/:id` | Delete a course | Admin |
| POST | `/api/messages` | Submit a contact message | Public |
| GET | `/api/messages` | Retrieve contact messages | Admin |
| DELETE | `/api/messages/:id` | Delete a contact message | Admin |
| POST | `/api/plan/check` | Validate a study plan | Public |

Protected endpoints require a valid JWT in the request header:

```http
Authorization: Bearer YOUR_TOKEN
```

## Deployment

### Deploy the backend to Render

1. Push the project to a Git repository.
2. Create a new Web Service in Render and connect the repository.
3. Set the **Root Directory** to `backend`.
4. Set the build command to:

   ```bash
   npm install
   ```

5. Set the start command to:

   ```bash
   npm start
   ```

6. Add the backend environment variables in Render's Environment settings:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`

7. Deploy the service.
8. Test the health endpoint:

   `https://YOUR-RENDER-SERVICE.onrender.com/api/health`

Replace the example URL with your actual Render service URL.

### Deploy the frontend to Vercel

1. Import the Git repository into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Configure the project to use Vite.
4. Add the environment variable:

   ```dotenv
   VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
   ```

5. Deploy the frontend.
6. Open the deployed website and test course loading, administrator login, contact messages, and study planning.

If you change an environment variable, create a new deployment so the updated value is included in the frontend build.

## Data Storage

The backend currently stores course and message data in JSON files:

- `backend/data/courses.json`
- `backend/data/messages.json`

This is a simple approach for development and small demonstrations. Files stored on a typical Render service filesystem may not persist across deployments or service replacements unless persistent storage is configured.

For a production application, consider using a database such as PostgreSQL and implementing appropriate backups.

## Security Notes

- Keep administrator credentials and `JWT_SECRET` private.
- Do not commit `.env` files or secrets to Git.
- Use HTTPS for deployed services.
- Validate incoming data on the backend.
- Keep administrator routes protected by authentication.
- Consider restricting CORS to trusted frontend origins.
- Use persistent database storage for important data.

## Troubleshooting

**The courses do not load**
- Verify that the Render service is running.
- Open `/api/health` on the backend URL.
- Confirm that `VITE_API_URL` is correct.
- Check the browser console and Network tab for failed requests.

**Administrator login fails**
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Render.
- Check the `/api/login` request in the browser Network tab.
- Review the backend logs for errors.

**Changes do not appear after deployment**
- Confirm that your latest changes were committed and pushed.
- Check the deployment status in Vercel or Render.
- Redeploy after changing environment variables.

**Data disappears**
- Check whether the backend is using temporary filesystem storage.
- Consider configuring persistent storage or migrating to a database.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project under a particular open-source license.

---

**Course Planner** — A course discovery and study planning application built with React, Vite, Node.js, and Express.
