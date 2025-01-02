import express from 'express';

const router = express.Router();

// Mock Database (Replace with actual DB logic in production)
const wishlists = {};

// Get Wishlist by User
router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    const userWishlist = wishlists[userId] || [];
    res.status(200).json(userWishlist);
});

// Add Item to Wishlist
router.post('/', (req, res) => {
    const { userId, productId } = req.body;
    if (!wishlists[userId]) {
        wishlists[userId] = [];
    }
    if (!wishlists[userId].includes(productId)) {
        wishlists[userId].push(productId);
    }
    res.status(200).json(wishlists[userId]);
});

// Remove Item from Wishlist
router.delete('/', (req, res) => {
    const { userId, productId } = req.body;
    if (wishlists[userId]) {
        wishlists[userId] = wishlists[userId].filter(id => id !== productId);
    }
    res.status(200).json(wishlists[userId]);
});

export default router;