const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll(
     {
       include: Category
     }
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
});



// GET a single product by ID with associated Category and Tag data
router.get('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByPk(productId, {
      include: [
        { model: Category },
        { model: Tag }
      ]
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
});

// create new product
router.post('/', (req, res) => {
  // Extract the required fields from the request body
  const { product_name, price, stock, category_id, tagIds } = req.body;

  // Check if all required fields are present in the request body
  if (!product_name || !price || !category_id) {
    return res.status(400).json({ error: 'Please provide product_name, price, and category_id' });
  }

  // Create a new Product instance
  Product.create({
    product_name,
    price,
    stock: stock || 10, // Set default value for stock if not provided
    category_id,
  })
    .then((product) => {
      // Check if there are tagIds provided
      if (tagIds && tagIds.length) {
        // Create productTag entries for each tagId
        const productTagIdArr = tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });

        // Bulk create productTag entries
        return ProductTag.bulkCreate(productTagIdArr);
      }

      // Respond with the created product if no tags provided
      res.status(200).json(product);
    })
    .then((productTagIds) => {
      // Respond with the productTagIds if tags were created
      res.status(200).json(productTagIds);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ error: 'Failed to create product' });
    });
});
// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  await Product.destroy({ where: { id: productId } });
  res.json({ message: 'Product deleted successfully' });
});
module.exports = router;
