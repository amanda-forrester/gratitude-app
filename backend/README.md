# gratitude-app-backend

The back-end of the gratitude app contains an API with the following routes:

/login: Displays a link to authenticate with Google using OAuth2.

/auth/google: Redirects the user to Google's authentication page and requests permission to access their email and profile information.

/auth/google/callback: Handles the callback from Google after the user has authenticated. If authentication is successful, redirects the user to the /gratitude page. If authentication fails, redirects the user to /auth/failure.

/auth/failure: Displays an error message if authentication fails.

/gratitude: If the user is logged in, displays a welcome message with the user's name and profile picture, and runs a query to get the user's first name from the database. If the user does not exist in the database, creates a new user with their information. If the user is not logged in, redirects them to the login page.

/logout: Logs the user out and destroys their session.

GET /users: Returns a list of all users in the database.

GET /users/:id: Returns a specific user by ID.

POST /users: Creates a new user in the database.

PUT /users/:id: Updates a user's information in the database.

DELETE /users/:id: Deletes a user from the database.

POST /gratitude/:id_users: Creates a new gratitude entry for a user.

GET /gratitude/:id_users: Returns all gratitude entries for a user.

DELETE /gratitude/:id: Deletes a specific gratitude entry by ID.

PUT /gratitude/:id: Updates a specific gratitude entry by ID.

GET /gratitude/:id_users/:date: Returns the gratitude entry for a user on a specific date.