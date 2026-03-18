const Service = require('../models/Service');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const { getBaseUrl, deleteLocalFile, parseJSON } = require('../utils/helpers');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res, next) => {
  const query = req.query.admin === 'true' ? {} : { isActive: true };
  const services = await Service.find(query).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findOne({ slug: req.params.slug });

  if (!service) {
    return next(new ErrorResponse(`Service not found with slug of ${req.params.slug}`, 404));
  }

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res, next) => {
  const {
    title,
    subtitle,
    description,
    subProducts,
    specs,
    applications,
    order,
    isActive,
    heroImageAlt,
    cardImageAlt,
    metaDescription
  } = req.body;

  let heroImage = '';
  let cardImage = '';
  
  // Log for debugging
  console.log('--- Create Service Debug ---');
  console.log('Body keys:', Object.keys(req.body));
  console.log('Raw subProducts string:', req.body.subProducts);
  
  let parsedSubProducts = parseJSON(subProducts, []);
  let parsedSections = parseJSON(req.body.sections, []);
  console.log('Parsed subProducts:', JSON.stringify(parsedSubProducts, null, 2));
  console.log('Parsed sections:', JSON.stringify(parsedSections, null, 2));
  console.log('Files received:', req.files ? req.files.map(f => f.fieldname) : 'none');

  if (req.files) {
    req.files.forEach(file => {
      const normalizedPath = file.path.replace(/\\/g, '/');
      const relativePath = normalizedPath;

      if (file.fieldname === 'heroImage') {
        heroImage = relativePath;
      } else if (file.fieldname === 'cardImage') {
        cardImage = relativePath;
      } else if (file.fieldname.startsWith('subProductImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSubProducts[index]) {
          parsedSubProducts[index].image = relativePath;
        }
      } else if (file.fieldname.startsWith('subProductGallery_')) {
        const parts = file.fieldname.split('_');
        const index = parseInt(parts[1]);
        const imgIndex = parseInt(parts[2]);
        if (!isNaN(index) && parsedSubProducts[index]) {
          if (!parsedSubProducts[index].gallery) parsedSubProducts[index].gallery = [];
          parsedSubProducts[index].gallery[imgIndex] = relativePath;
        }
      } else if (file.fieldname.startsWith('sectionImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSections[index]) {
          parsedSections[index].image = relativePath;
        }
      }
    });
  }

  // Generate slugs for sub-products
  if (Array.isArray(parsedSubProducts)) {
    parsedSubProducts = parsedSubProducts.map(sp => {
      if (sp.title && !sp.slug) {
        sp.slug = sp.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      }
      // Ensure gallery is a clean array (removing any possible nulls from indexed assignment)
      if (sp.gallery) sp.gallery = sp.gallery.filter(img => img != null);
      return sp;
    });
  }

  // Auto-assign order based on existing services count
  const servicesCount = await Service.countDocuments();
  
  const serviceData = {
    title,
    subtitle,
    description,
    metaDescription,
    heroImage,
    heroImageAlt,
    cardImage,
    cardImageAlt,
    subProducts: parsedSubProducts,
    specs: parseJSON(specs, []),
    applications: Array.isArray(applications) ? applications : parseJSON(applications, []),
    layout: parseJSON(req.body.layout, {
      showIntro: true,
      showShowcase: true,
      showSolutions: true,
      showSpecs: true,
      showApplications: true
    }),
    sections: parsedSections,
    faqs: parseJSON(req.body.faqs, []),
    category: req.body.category || "",
    tags: parseJSON(req.body.tags, []),
    extraContent: parseJSON(req.body.extraContent, []),
    order: servicesCount, // Auto-assign order
    isActive: isActive === 'true' || isActive === true
  };

  const service = await Service.create(serviceData);

  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PATCH /api/services/admin/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  const {
    title,
    subtitle,
    description,
    subProducts,
    specs,
    applications,
    order,
    isActive,
    heroImageAlt,
    cardImageAlt,
    metaDescription
  } = req.body;

  // Log for debugging
  const fs = require('fs');
  const logData = `--- Update Service Debug (ID: ${req.params.id}) ---\n` +
                  `Time: ${new Date().toISOString()}\n` +
                  `Body Keys: ${Object.keys(req.body).join(', ')}\n` +
                  `Raw subProducts: ${subProducts ? subProducts.substring(0, 500) + '...' : 'N/A'}\n`;
  fs.appendFileSync('debug_update.log', logData);
  
  let parsedSubProducts = subProducts ? parseJSON(subProducts, service.subProducts) : service.subProducts;
  let parsedSections = req.body.sections ? parseJSON(req.body.sections, service.sections) : service.sections;
  
  if (Array.isArray(parsedSubProducts)) {
    fs.appendFileSync('debug_update.log', `Parsed subProducts count: ${parsedSubProducts.length}\n`);
    if (parsedSubProducts.length > 0) {
      fs.appendFileSync('debug_update.log', `Sample [0] keys: ${Object.keys(parsedSubProducts[0]).join(', ')}\n`);
      fs.appendFileSync('debug_update.log', `Sample [0] fullDescription length: ${parsedSubProducts[0].fullDescription ? parsedSubProducts[0].fullDescription.length : 'N/A'}\n`);
    }
    parsedSubProducts = parsedSubProducts.map(p => typeof p.toObject === 'function' ? p.toObject() : p);
  }

  if (req.files) {
    req.files.forEach(file => {
      const normalizedPath = file.path.replace(/\\/g, '/');
      // Store ONLY the relative path
      const relativePath = normalizedPath;

      console.log(`Processing file: ${file.fieldname}, Relative Path: ${relativePath}`);

      if (file.fieldname === 'heroImage') {
        // Delete old file if it exists
        if (service.heroImage && service.heroImage.includes('uploads/')) {
          deleteLocalFile(path.join(__dirname, '..', service.heroImage));
        }
        service.heroImage = relativePath;
      } else if (file.fieldname === 'cardImage') {
        // Delete old file if it exists
        if (service.cardImage && service.cardImage.includes('uploads/')) {
          deleteLocalFile(path.join(__dirname, '..', service.cardImage));
        }
        service.cardImage = relativePath;
      } else if (file.fieldname.startsWith('subProductImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSubProducts[index]) {
          const oldSubProduct = service.subProducts[index];
          if (oldSubProduct && oldSubProduct.image && oldSubProduct.image.includes('uploads/')) {
            deleteLocalFile(path.join(__dirname, '..', oldSubProduct.image));
          }
          parsedSubProducts[index].image = relativePath;
        }
      } else if (file.fieldname.startsWith('subProductGallery_')) {
        const parts = file.fieldname.split('_');
        const index = parseInt(parts[1]);
        const imgIndex = parseInt(parts[2]);
        if (!isNaN(index) && parsedSubProducts[index]) {
          if (!parsedSubProducts[index].gallery) parsedSubProducts[index].gallery = [];
          
          // Cleanup old image if we are replacing it at this specific index
          const oldGallery = service.subProducts[index]?.gallery;
          if (oldGallery && oldGallery[imgIndex] && oldGallery[imgIndex].includes('uploads/')) {
            deleteLocalFile(path.join(__dirname, '..', oldGallery[imgIndex]));
          }
          
          parsedSubProducts[index].gallery[imgIndex] = relativePath;
        }
      } else if (file.fieldname.startsWith('sectionImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSections[index]) {
          const oldSection = service.sections[index];
          if (oldSection && oldSection.image && oldSection.image.includes('uploads/')) {
            deleteLocalFile(path.join(__dirname, '..', oldSection.image));
          }
          parsedSections[index].image = relativePath;
        }
      }
    });
  }

  // Ensure slugs for sub-products on update
  if (Array.isArray(parsedSubProducts)) {
    parsedSubProducts = parsedSubProducts.map(sp => {
      if (sp.title && !sp.slug) {
        sp.slug = sp.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      }
      // Clean up gallery array
      if (sp.gallery) sp.gallery = sp.gallery.filter(img => img != null);
      return sp;
    });
  }

  if (title) service.title = title;
  if (subtitle) service.subtitle = subtitle;
  if (description) service.description = description;
  if (metaDescription) service.metaDescription = metaDescription;
  if (heroImageAlt !== undefined) service.heroImageAlt = heroImageAlt;
  if (cardImageAlt !== undefined) service.cardImageAlt = cardImageAlt;
  if (subProducts) {
    service.subProducts = parsedSubProducts;
    service.markModified('subProducts');
  }
  if (specs) {
    service.specs = parseJSON(specs, service.specs);
    service.markModified('specs');
  }
  if (applications) service.applications = Array.isArray(applications) ? applications : parseJSON(applications, service.applications);
  if (req.body.layout) {
    service.layout = { ...service.layout, ...parseJSON(req.body.layout, {}) };
    service.markModified('layout');
  }
  if (req.body.extraContent) {
    service.extraContent = parseJSON(req.body.extraContent, []);
    service.markModified('extraContent');
  }
  if (req.body.sections || req.files) {
    service.sections = parsedSections;
    service.markModified('sections');
  }
  if (req.body.faqs) {
    service.faqs = parseJSON(req.body.faqs, []);
    service.markModified('faqs');
  }
  if (req.body.category) service.category = req.body.category;
  if (req.body.tags) {
    service.tags = parseJSON(req.body.tags, []);
    service.markModified('tags');
  }
  if (order !== undefined) service.order = parseInt(order);
  if (isActive !== undefined) service.isActive = isActive === 'true' || isActive === true;

  console.log('Finalizing save for service: ' + service.title);
  await service.save();
  console.log('--- Update Service Success (ID: ' + service._id + ') ---');

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/admin/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  const imagesToDelete = [];
  if (service.heroImage) imagesToDelete.push(service.heroImage);
  if (service.cardImage) imagesToDelete.push(service.cardImage);
  if (service.subProducts) {
    service.subProducts.forEach(sp => {
      if (sp.image) imagesToDelete.push(sp.image);
      if (sp.gallery && Array.isArray(sp.gallery)) {
        sp.gallery.forEach(img => imagesToDelete.push(img));
      }
    });
  }

  imagesToDelete.forEach(img => {
    if (img && img.includes('/uploads/')) {
      const filePath = img.split(req.get('host'))[1];
      if (filePath) {
        deleteLocalFile(path.join(__dirname, '..', filePath.substring(1)));
      }
    }
  });

  await service.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reorder services
// @route   POST /api/services/reorder
// @access  Private/Admin
exports.reorderServices = asyncHandler(async (req, res, next) => {
  const { orders } = req.body; // Array of { id, order }

  const updatePromises = orders.map(item => 
    Service.findByIdAndUpdate(item.id, { order: item.order })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'Services reordered successfully'
  });
});
