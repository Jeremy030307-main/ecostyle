/**
 * @swagger
 *  /collections/{id}?:
 *    get:
 *      summary: Get all active collections (optional id filter)
 *      description: Retrieves all active collection. If an ID is provided, fetches a specific collections.
 *      tags: [Collection]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: false
 *          schema:
 *            type: string
 *          description: The ID of the collection to retrieve.
 *      responses:
 *        200:
 *          description: Collection details along with its status history
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  collectionID:
 *                    type: string
 *                    description: The ID of the collection
 *                  name:
 *                    type: string
 *                    description: The name of the collection
 *                  description:
 *                    type: string
 *                    description: A short description of the collection
 *                  statusHistory:
 *                    type: array
 *                    description: History of the collection's status updates
 *                    items:
 *                      type: object
 *                      properties:
 *                        status:
 *                          type: string
 *                          description: The status of the collection at a particular point in time
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: Timestamp when the status was updated
 *        404:
 *          description: Collection not found
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  admin/collections:
 *    post:
 *      summary: Add a new collection
 *      description: Creates a new collection with the provided details.
 *      tags: [Collection]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - name
 *                - code
 *              properties:
 *                name:
 *                  type: string
 *                  description: The name of the collection
 *                code:
 *                  type: string
 *                  description: A unique code for the collection
 *                description:
 *                  type: string
 *                  description: A description of the collection
 *      responses:
 *        201:
 *          description: Collection successfully created
 *        400:
 *          description: Bad request (e.g., missing required fields or collection already exists)
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  admin/collections/{id}:
 *    patch:
 *      summary: Update an existing collection
 *      description: Updates the details of a specific collection by its ID.
 *      tags: [Collection]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the collection to update.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  description: The updated name of the collection
 *                description:
 *                  type: string
 *                  description: The updated description of the collection
 *      responses:
 *        200:
 *          description: Collection successfully updated
 *        400:
 *          description: Collection not found or invalid data
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  admin/collections/{id}/{status}:
 *    patch:
 *      summary: Update the status of a collection
 *      description: Updates the status of a specific collection by its ID.
 *      tags: [Collection]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the collection whose status is being updated.
 *        - in: path
 *          name: status
 *          required: true
 *          schema:
 *            type: string
 *            enum: [ACTIVE, INACTIVE, NEW, PENDING]
 *          description: The new status to set for the collection.
 *      responses:
 *        200:
 *          description: Collection status successfully updated
 *        400:
 *          description: Invalid collection ID or status
 *        500:
 *          description: Internal server error
 */

/**
 * @swagger
 *  admin/collections/{id}:
 *    delete:
 *      summary: Delete a collection by ID
 *      description: Deletes a collection along with its history and checks for associated products.
 *      tags: [Collection]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the collection to delete.
 *      responses:
 *        200:
 *          description: Collection and its history successfully deleted
 *        400:
 *          description: Collection not found or invalid ID
 *        409:
 *          description: Conflict due to associated products under the collection
 *        500:
 *          description: Internal server error
 */

