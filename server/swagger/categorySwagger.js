/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all categories including subcategories.
 *     tags: [Category]
 *     description: Retrieves all categories from the database, including any associated subcategories.
 *     responses:
 *       200:
 *         description: A list of categories with their subcategories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   subcategories:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *       400:
 *         description: Error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /category/{categoryPath}:
 *   get:
 *     summary: Get products under a specific category path.
 *     tags: [Category]
 *     description: Retrieves all products belonging to the specified category path, including subcategories.
 *     parameters:
 *       - name: categoryPath
 *         in: path
 *         description: The category path, which may include subcategories.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of products belonging to the category.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       400:
 *         description: Error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Add a new category with optional subcategories.
 *     tags: [Category]
 *     description: Creates a new category, optionally adding subcategories.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subcategories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Category added successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         description: Error message if category creation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /category/delete:
 *   delete:
 *     summary: Delete categories and their subcategories.
 *     tags: [Category]
 *     description: Deletes categories from the database, including all associated subcategories and nested subcollections.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: array
 *                   items:
 *                     type: string
 *     responses:
 *       200:
 *         description: Categories deleted successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         description: Error message if category deletion fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
