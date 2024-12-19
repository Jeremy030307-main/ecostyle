/**
 * @swagger
 * /category/{id}?:
 *   get:
 *     summary: Get categories with subcategories (optional ID filter).
 *     tags: [Category]
 *     description: Retrieves all categories, including subcategories. If an ID is provided, fetches a specific category.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the category (optional, to filter by a specific category).
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of categories with their subcategories (or a specific category if ID is provided).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 subcategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * admin/category/{parentID}?:
 *   post:
 *     summary: Add a new category with optional subcategories.
 *     tags: [Category]
 *     description: Creates a new category, optionally adding subcategories. The parentID parameter is used for nested categories.
 *     parameters:
 *       - name: parentID
 *         in: path
 *         description: The ID of the parent category (optional).
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               subcategory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Invalid input or category already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * admin/category/{id}:
 *   delete:
 *     summary: Delete a category and its subcategories.
 *     tags: [Category]
 *     description: Deletes the specified category and all associated subcategories recursively. Products under the category must be removed first.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the category to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted successfully.
 *       400:
 *         description: Missing or invalid category ID.
 *       409:
 *         description: Cannot delete category due to existing products.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication failed or no token provided.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 */


