/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Product]
 *     summary: Get all products
 *     description: Retrieves a list of all products from the database, including details such as pricing, colors, and sizes.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the product.
 *                   name:
 *                     type: string
 *                     description: The name of the product.
 *                   price:
 *                     type: number
 *                     description: The price of the product.
 *                   rating:
 *                     type: number
 *                     description: The rating of the product (out of 5).
 *                   reviewCount:
 *                     type: string
 *                     description: The total number of reviews the product has received.
 *                   color:
 *                     type: object
 *                     additionalProperties:
 *                       type: object
 *                       additionalProperties:
 *                         type: string
 *                       description: A map of colors and their available sizes with quantities.
 *                     description: A list of available colors and their corresponding sizes and stock quantities.
 *       400:
 *         description: No products found or error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Product]
 *     summary: Get a product by its ID
 *     description: Retrieves a product from the database using the provided product ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A product object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the product.
 *                 name:
 *                   type: string
 *                   description: The name of the product.
 *                 price:
 *                   type: number
 *                   description: The price of the product.
 *                 category:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The list of category IDs associated with the product.
 *       404:
 *         description: Product not found.
 *       400:
 *         description: Error occurred while retrieving product data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Product]
 *     summary: Create a new product
 *     description: Adds a new product to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of category IDs associated with the product.
 *     responses:
 *       200:
 *         description: Product created successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         description: Error occurred while creating the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by its ID
 *     tags: [Product]
 *     description: Updates an existing product in the database using the provided product ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update.
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
 *                 description: The name of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of category IDs associated with the product.
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         description: Error occurred while updating the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by its ID
 *     tags: [Product]
 *     description: Deletes a product from the database using the provided product ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         description: Error occurred while deleting the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */
