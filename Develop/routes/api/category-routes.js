const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categories = await Category.findAll({ include: Product });
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findByPk(categoryId, { include: Product });
  res.json(category);
});

router.post('/', async (req, res) => {
  const { categoryName } = req.body;
  
  try {
    if (!categoryName) {
      return res.status(400).json({ error: 'Please provide categoryName' });
    }

    const newCategory = await Category.create({ category_name: categoryName });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', async (req, res) => {
  const categoryId = req.params.id;
  const { categoryName } = req.body;
  const updatedCategory = await Category.update({ category_name: categoryName }, { where: { id: categoryId } });
  res.json(updatedCategory);
});

router.delete('/:id', async (req, res) => {
  const categoryId = req.params.id;
  await Category.destroy({ where: { id: categoryId } });
  res.json({ message: 'Category deleted successfully' });
});

module.exports = router;
