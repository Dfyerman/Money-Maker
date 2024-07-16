const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({ include: Product });
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching tags' });
  }
});

// GET a single tag by ID with associated Product data
router.get('/:id', async (req, res) => {
  const tagId = req.params.id;
  try {
    const tag = await Tag.findByPk(tagId, {
      include: Product
    });
    if (tag) {
      res.json(tag);
    } else {
      res.status(404).json({ message: 'Tag not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the tag' });
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  const { tagName } = req.body;
  try {
    const newTag = await Tag.create({ tag_name: tagName });
    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create a new tag' });
  }
});

// PUT (update) a tag by ID
router.put('/:id', async (req, res) => {
  const tagId = req.params.id;
  const { tagName } = req.body;
  try {
    const updatedTag = await Tag.update({ tag_name: tagName }, { where: { id: tagId } });
    res.json(updatedTag);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update the tag' });
  }
});

// DELETE a tag by ID
router.delete('/:id', async (req, res) => {
  const tagId = req.params.id;
  try {
    await Tag.destroy({ where: { id: tagId } });
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the tag' });
  }
});


module.exports = router;
