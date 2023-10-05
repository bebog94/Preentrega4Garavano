
import express from 'express';
import { manager } from '../ProductManager.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts(req.query);
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
