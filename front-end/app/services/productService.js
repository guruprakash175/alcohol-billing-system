import { productAPI } from './api';

export const productService = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      const response = await productAPI.getAll(filters);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch products');
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await productAPI.getById(productId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Product not found');
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await productAPI.search(query);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Search failed');
    }
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await productAPI.create(productData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create product');
    }
  },

  // Update product (Admin only)
  updateProduct: async (productId, productData) => {
    try {
      const response = await productAPI.update(productId, productData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update product');
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (productId) => {
    try {
      const response = await productAPI.delete(productId);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete product');
    }
  },

  // Filter products by category
  filterByCategory: (products, category) => {
    if (!category || category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  // Sort products
  sortProducts: (products, sortBy) => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'alcohol-low':
        return sorted.sort((a, b) => a.alcoholContent - b.alcoholContent);
      case 'alcohol-high':
        return sorted.sort((a, b) => b.alcoholContent - a.alcoholContent);
      default:
        return sorted;
    }
  },

  // Get product categories
  getCategories: (products) => {
    const categories = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(categories)];
  },

  // Format product for display
  formatProduct: (product) => {
    return {
      ...product,
      formattedPrice: `₹${product.price.toFixed(2)}`,
      formattedVolume: `${product.volume}L`,
      formattedAlcohol: `${product.alcoholContent}%`,
      inStock: product.stock > 0,
      lowStock: product.stock > 0 && product.stock <= 10,
    };
  },
};

export default productService;