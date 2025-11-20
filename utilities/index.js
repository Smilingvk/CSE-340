const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid;
  if(data.length > 0){
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailView = async function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, vehicle not found.</p>';
  }

  let detailView = '<div class="vehicle-detail">';
  
  // Image section
  detailView += '<div class="vehicle-detail-image">';
  detailView += '<img src="' + vehicle.inv_image + '" alt="' 
    + vehicle.inv_make + ' ' + vehicle.inv_model + '">';
  detailView += '</div>';
  
  // Information section
  detailView += '<div class="vehicle-detail-info">';
  
  // Title
  detailView += '<h1 class="vehicle-title">' + vehicle.inv_year + ' ' 
    + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>';
  
  // Price section
  detailView += '<div class="vehicle-price-section">';
  detailView += '<p class="vehicle-price">$' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>';
  detailView += '</div>';
  
  // Details list
  detailView += '<div class="vehicle-details-list">';
  
  detailView += '<div class="detail-item">';
  detailView += '<span class="detail-label">Mileage:</span> ';
  detailView += '<span class="detail-value">' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</span>';
  detailView += '</div>';
  
  detailView += '<div class="detail-item">';
  detailView += '<span class="detail-label">Color:</span> ';
  detailView += '<span class="detail-value">' + vehicle.inv_color + '</span>';
  detailView += '</div>';
  
  detailView += '</div>'; // Close vehicle-details-list
  
  // Description
  detailView += '<div class="vehicle-description">';
  detailView += '<h3>Description</h3>';
  detailView += '<p>' + vehicle.inv_description + '</p>';
  detailView += '</div>';
  
  detailView += '</div>'; // Close vehicle-detail-info
  detailView += '</div>'; // Close vehicle-detail
  
  return detailView;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;