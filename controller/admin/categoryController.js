const Category = require('../../model/category');

// Load category list page
exports.loadCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('category', { categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Load Add Category Form
exports.loadAddCategory = (req, res) => {
  try {
    res.render('add-category');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


// Handle Add Category Form Submission
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.render('add-category', { error: 'Category already exists' });
    }

    const category = new Category({
      name,
      description
    });

    await category.save();
    res.redirect('/admin/loadcategory'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.loadEditCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);
  
      if (!category) {
        return res.redirect('/admin/loadcategory');
      }
  
      res.render('edit-category', { category });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };
  
  exports.updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { name, description } = req.body;
  
      await Category.findByIdAndUpdate(categoryId, { name, description });
      res.redirect('/admin/loadcategory');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };
  

  exports.deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      await Category.findByIdAndDelete(categoryId);
      res.redirect('/admin/loadcategory');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };
 exports.toggleCategoryStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        category.status = !category.status;
        await category.save();

        res.redirect('/admin/loadcategory');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error toggling category status');
    }
};
