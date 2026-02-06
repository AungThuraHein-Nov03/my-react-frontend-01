# CSX4107 - React Frontend (Week 07 - Week 09)

This is the client-side part of the project. It's a React app using Vite. It talks to the Next.js backend to display the shop items and manage users.

## Important Details

-   **Auth**: We're using a `UserContext` to wrap the app so we know if the user is logged in or not.
-   **Routing**: Using `react-router-dom`. Some routes like `/profile` are protected by the `RequireAuth` component. If you aren't logged in, it bounces you to login.
-   **Styles**: Just regular CSS files for now. (I'm too lazy to have fancy Ui)

## Setup

1.  Go into this folder and install the node modules:
    ```bash
    npm install
    ```

2.  Make sure the backend is running on port 3000.

3.  Set up the environment variable so it knows where to fetch data:
    Create a `.env` file:
    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  Start it up:
    ```bash
    npm run dev
    ```
    Open the link it gives you (probably localhost:5173).

## The Files

-   `src/context/UserProvider.jsx`: This is where the login logic actually happens 
-   `src/middleware/RequireAuth.jsx`: Checks the context; if `!isLoggedIn`, returns `<Navigate to="/login" />`.
-   `src/components/`: The UI parts. `UseList`/`UserEdit` are for admins to manage accounts.


