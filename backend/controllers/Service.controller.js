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
    isActive
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
      // Store ONLY the relative path, not the full URL
      const relativePath = normalizedPath;

      console.log(`Processing file: ${file.fieldname}, Relative Path: ${relativePath}`);

      if (file.fieldname === 'heroImage') {
        heroImage = relativePath;
      } else if (file.fieldname === 'cardImage') {
        cardImage = relativePath;
      } else if (file.fieldname.startsWith('subProductImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSubProducts[index]) {
          parsedSubProducts[index].image = relativePath;
          console.log(`Successfully assigned image path to subProducts[${index}]`);
        } else {
          console.log(`Failed to assign image to subProducts[${index}]. Array length: ${parsedSubProducts.length}`);
        }
      } else if (file.fieldname.startsWith('sectionImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSections[index]) {
          parsedSections[index].image = relativePath;
          console.log(`Successfully assigned image path to sections[${index}]`);
        } else {
          console.log(`Failed to assign image to sections[${index}]. Array length: ${parsedSections.length}`);
        }
      }
    });
  }

  console.log('Final subProducts before save:', JSON.stringify(parsedSubProducts.map(p => ({ title: p.title, hasImage: !!p.image })), null, 2));

  // Auto-assign order based on existing services count
  const servicesCount = await Service.countDocuments();
  
  const serviceData = {
    title,
    subtitle,
    description,
    heroImage,
    cardImage,
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
    isActive
  } = req.body;

  // Log for debugging
  console.log('--- Update Service Debug ---');
  console.log('Body keys:', Object.keys(req.body));
  console.log('Raw subProducts string:', subProducts);

  let parsedSubProducts = subProducts ? parseJSON(subProducts, service.subProducts) : service.subProducts;
  let parsedSections = req.body.sections ? parseJSON(req.body.sections, service.sections) : service.sections;
  
  if (typeof parsedSubProducts.toObject === 'function') {
    parsedSubProducts = parsedSubProducts.toObject();
  } else if (Array.isArray(parsedSubProducts)) {
    parsedSubProducts = parsedSubProducts.map(p => typeof p.toObject === 'function' ? p.toObject() : p);
  }

  if (typeof parsedSections.toObject === 'function') {
    parsedSections = parsedSections.toObject();
  } else if (Array.isArray(parsedSections)) {
    parsedSections = parsedSections.map(s => typeof s.toObject === 'function' ? s.toObject() : s);
  }

  console.log('Final Parsed subProducts count:', parsedSubProducts.length);
  console.log('Final Parsed sections count:', parsedSections.length);
  console.log('Files received:', req.files ? req.files.map(f => f.fieldname) : 'none');

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
          // Delete old sub-product image if it exists
          const oldSubProduct = service.subProducts[index];
          if (oldSubProduct && oldSubProduct.image && oldSubProduct.image.includes('uploads/')) {
            deleteLocalFile(path.join(__dirname, '..', oldSubProduct.image));
          }
          parsedSubProducts[index].image = relativePath;
          console.log(`Successfully updated image path for subProducts[${index}]`);
        } else {
          console.log(`Failed to update image for subProducts[${index}]. Array length: ${parsedSubProducts.length}`);
        }
      } else if (file.fieldname.startsWith('sectionImage_')) {
        const index = parseInt(file.fieldname.split('_')[1]);
        if (!isNaN(index) && parsedSections[index]) {
          // Delete old section image if it exists
          const oldSection = service.sections[index];
          if (oldSection && oldSection.image && oldSection.image.includes('uploads/')) {
            deleteLocalFile(path.join(__dirname, '..', oldSection.image));
          }
          parsedSections[index].image = relativePath;
          console.log(`Successfully updated image path for sections[${index}]`);
        } else {
          console.log(`Failed to update image for sections[${index}]. Array length: ${parsedSections.length}`);
        }
      }
    });
  }

  console.log('Final subProducts before update:', JSON.stringify(parsedSubProducts.map(p => ({ title: p.title, hasImage: !!p.image })), null, 2));

  if (title) service.title = title;
  if (subtitle) service.subtitle = subtitle;
  if (description) service.description = description;
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

  await service.save();

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
