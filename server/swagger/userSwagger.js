/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by their ID
 *     tags: [User]
 *     description: Retrieves a user from the Firestore database by their unique user ID.
 *     operationId: getUser
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique user identifier.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique user identifier.
 *                 name:
 *                   type: string
 *                   description: Name of the user.
 *                 email:
 *                   type: string
 *                   description: Email address of the user.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Bad request, invalid data.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /user/{id}:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     description: Creates a new user in the Firestore database with the provided user data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UID of the user.
 *         schema:
 *           type: string
 *     operationId: createUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unique user identifier.
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *               otherField:
 *                 type: string
 *                 description: Other user-related fields.
 *     responses:
 *       200:
 *         description: User successfully created.
 *       400:
 *         description: Bad request, invalid data.
 */

/**
 * @swagger
 * /user/{id}/admin:
 *   post:
 *     summary: Set a user as an admin
 *     tags: [User]
 *     description: |
 *       Grants a user admin privileges by setting a custom claim to `admin: true`.
 *       This operation requires the user's ID as a path parameter. *     operationId: setAdmin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique user identifier.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin custom claim successfully set for the user.
 *       500:
 *         description: Internal server error.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user data
 *     tags: [User]
 *     description: Updates an existing user's data by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The UID of the user.
 *         schema:
 *           type: string
 *     operationId: updateUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Unique user identifier.
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *               otherField:
 *                 type: string
 *                 description: Other user-related fields.
 *     responses:
 *       200:
 *         description: User successfully updated.
 *       400:
 *         description: Bad request, invalid data.
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by their ID
 *     tags: [User]
 *     description: Deletes a user from the Firestore database by their unique user ID.
 *     operationId: deleteUser
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique user identifier.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *       400:
 *         description: Bad request, invalid data.
 */
