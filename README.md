# Blogging API

A RESTful Blogging API built with Node.js, Express, and MongoDB, designed for managing blogs with user authentication and various access controls. The API supports CRUD operations, pagination, filtering, and sorting for an efficient blogging experience.

---

## Features

- User Authentication: Users can register and log in with email and password using JWT-based authentication (tokens expire after 1 hour).
- *Blog States*: Blogs can exist in either `draft` or `published` states.
- *Public Access*: Published blogs are accessible to all users, logged in or not.
- *CRUD Operations*:
  - Users can create, update, and delete their own blogs.
  - Blogs start in a `draft` state by default and can be published by the owner.
- *Pagination and Filtering*:
  - Retrieve blogs in paginated format (default 20 per page).
  - Filter blogs by state (`draft` or `published`) or search by title, tags, or author.
- *Sorting*: Blogs can be sorted by `read_count`, `reading_time`, or `timestamp`.
- *Reading Count*: Every time a blog is accessed, its `read_count` is incremented.
- *Reading Time Calculation*: Estimated based on the content length (average reading speed of 200 words per minute).

---

## Installation and Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/blogging-api.git
cd blogging-api
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Variables**
Create a `.env` file in the root directory with the following content:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### **4. Start the Server**
- **Development mode**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## API Endpoints

### **Authentication**
| Method | Endpoint       | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| POST   | `/auth/signup` | Register a new user  | No            |
| POST   | `/auth/login`  | Log in as a user     | No            |

### **Blogs**
| Method | Endpoint                | Description                                 | Auth Required | Restrictions        |
|--------|--------------------------|---------------------------------------------|---------------|---------------------|
| GET    | `/blogs`                | Get all published blogs                    | No            | None                |
| GET    | `/blogs/:id`            | Get a specific published blog              | No            | None                |
| POST   | `/blogs`                | Create a new blog                          | Yes           | Only for owners     |
| PATCH  | `/blogs/:id/state`      | Update blog state (draft → published)      | Yes           | Only for owners     |
| PATCH  | `/blogs/:id`            | Edit a blog                                | Yes           | Only for owners     |
| DELETE | `/blogs/:id`            | Delete a blog                              | Yes           | Only for owners     |
| GET    | `/blogs/user`           | Get all blogs created by the logged-in user | Yes           | None                |

---

## Data Models

### **User**
| Field      | Type   | Description              |
|------------|--------|--------------------------|
| first_name | String | User's first name        |
| last_name  | String | User's last name         |
| email      | String | User's unique email      |
| password   | String | Encrypted user password  |

### **Blog**
| Field         | Type     | Description                             |
|---------------|----------|-----------------------------------------|
| title         | String   | Blog title (must be unique)            |
| description   | String   | Short description of the blog          |
| body          | String   | Full blog content                      |
| tags          | [String] | Tags associated with the blog          |
| state         | String   | Blog state: `draft` or `published`     |
| author        | ObjectId | Reference to the blog's author         |
| read_count    | Number   | Number of times the blog was read       |
| reading_time  | Number   | Estimated reading time in minutes      |
| timestamp     | Date     | Blog creation time                     |

---

## Algorithms

### **Reading Time Calculation**
Reading time is calculated based on an average reading speed of 200 words per minute:
```javascript
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
```

---

## Testing

This project includes automated tests to validate the functionality of all endpoints.

### **Run Tests**
1. Install `jest` and `supertest`:
   ```bash
   npm install jest supertest --save-dev
   ```
2. Run the test suite:
   ```bash
   npm test
   ```

### **Testing Environment**
- The project uses `mongodb-memory-server` to run tests without affecting the main database.

---

## Tools and Technologies
- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing application data.
- **JWT**: Secure authentication.
- **Jest**: Testing framework.
- **Supertest**: Library for API testing.

---

## Project Structure

```
Blogging API/
├── controllers/      # Logic for handling API requests
├── models/           # Mongoose schemas and models
├── routes/           # Route definitions
├── middleware/       # Custom middlewares (e.g., auth, validation)
├── utils/            # Utility functions (e.g., calculateReadingTime)
├── tests/            # Unit and integration tests
├── .env              # Environment variables
├── index.js          # Entry point
├── package.json      # Project metadata and dependencies
```

---

## Future Improvements

- Add role-based access control (e.g., admin vs. regular users).
- Implement image upload functionality for blogs.
- Add rate-limiting and request throttling to improve security.
- Improve search functionality with fuzzy matching.
- Integrate social sharing for blogs.

