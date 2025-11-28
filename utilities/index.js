const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="nav-list">';
  list += '<li><a href="/" class="nav-link" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" class="nav-link" title="See our inventory of ' +
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
      grid += '<span>';

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailView = async function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, vehicle not found.</p>';
  }

  // Inline styles
  let styles = `
    <style>
      .vehicle-detail {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #fff;
        padding: 1.5rem;
        margin-top: 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .vehicle-detail-image {
        width: 100%;
      }
      .vehicle-detail-image img {
        width: 100%;
        height: auto;
        border-radius: 4px;
        border: 1px solid #ddd;
      }
      .vehicle-detail-info {
        width: 100%;
      }
      .vehicle-price-section {
        background: linear-gradient(to right, #f8f9fa, #e9ecef);
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border-left: 4px solid #00bcd4;
      }
      .vehicle-title {
        font-size: 1.75rem;
        color: #1a1a1a;
        margin-bottom: 0.75rem;
        font-weight: bold;
      }
      .vehicle-price {
        font-size: 2.5rem;
        color: #00bcd4;
        font-weight: bold;
        margin: 0;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      }
      .vehicle-details-list {
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 1px solid #e0e0e0;
      }
      .detail-item {
        display: flex;
        padding: 0.875rem 0;
        border-bottom: 1px solid #e0e0e0;
        font-size: 1.05rem;
      }
      .detail-item:last-child {
        border-bottom: none;
      }
      .detail-label {
        font-weight: bold;
        color: #333;
        min-width: 120px;
      }
      .detail-value {
        color: #555;
        flex: 1;
      }
      .vehicle-description {
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }
      .vehicle-description h3 {
        font-size: 1.4rem;
        color: #1a1a1a;
        margin-bottom: 1rem;
        font-weight: bold;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #00bcd4;
      }
      .vehicle-description p {
        font-size: 1.05rem;
        line-height: 1.8;
        color: #555;
      }
      @media screen and (min-width: 768px) {
        .vehicle-detail {
          flex-direction: row;
          gap: 3rem;
          padding: 2.5rem;
        }
        .vehicle-detail-image {
          flex: 1;
          max-width: 48%;
        }
        .vehicle-detail-info {
          flex: 1;
          max-width: 48%;
        }
        .vehicle-title {
          font-size: 2.25rem;
        }
        .vehicle-price {
          font-size: 3rem;
        }
        .detail-item {
          font-size: 1.1rem;
        }
        .detail-label {
          min-width: 140px;
        }
      }
    </style>
  `;

  let detailView = styles;
  detailView += '<div class="vehicle-detail">';
  
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
  detailView += '<p class="vehicle-price">';

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util; 
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
* Build the classification list (select dropdown)
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailView = async function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, vehicle not found.</p>';
  }

  // Inline styles
  let styles = `
    <style>
      .vehicle-detail {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #fff;
        padding: 1.5rem;
        margin-top: 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .vehicle-detail-image {
        width: 100%;
      }
      .vehicle-detail-image img {
        width: 100%;
        height: auto;
        border-radius: 4px;
        border: 1px solid #ddd;
      }
      .vehicle-detail-info {
        width: 100%;
      }
      .vehicle-price-section {
        background: linear-gradient(to right, #f8f9fa, #e9ecef);
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border-left: 4px solid #00bcd4;
      }
      .vehicle-title {
        font-size: 1.75rem;
        color: #1a1a1a;
        margin-bottom: 0.75rem;
        font-weight: bold;
      }
      .vehicle-price {
        font-size: 2.5rem;
        color: #00bcd4;
        font-weight: bold;
        margin: 0;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      }
      .vehicle-details-list {
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border: 1px solid #e0e0e0;
      }
      .detail-item {
        display: flex;
        padding: 0.875rem 0;
        border-bottom: 1px solid #e0e0e0;
        font-size: 1.05rem;
      }
      .detail-item:last-child {
        border-bottom: none;
      }
      .detail-label {
        font-weight: bold;
        color: #333;
        min-width: 120px;
      }
      .detail-value {
        color: #555;
        flex: 1;
      }
      .vehicle-description {
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }
      .vehicle-description h3 {
        font-size: 1.4rem;
        color: #1a1a1a;
        margin-bottom: 1rem;
        font-weight: bold;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #00bcd4;
      }
      .vehicle-description p {
        font-size: 1.05rem;
        line-height: 1.8;
        color: #555;
      }
      @media screen and (min-width: 768px) {
        .vehicle-detail {
          flex-direction: row;
          gap: 3rem;
          padding: 2.5rem;
        }
        .vehicle-detail-image {
          flex: 1;
          max-width: 48%;
        }
        .vehicle-detail-info {
          flex: 1;
          max-width: 48%;
        }
        .vehicle-title {
          font-size: 2.25rem;
        }
        .vehicle-price {
          font-size: 3rem;
        }
        .detail-item {
          font-size: 1.1rem;
        }
        .detail-label {
          min-width: 140px;
        }
      }
    </style>
  `;

  let detailView = styles;
  detailView += '<div class="vehicle-detail">';
  
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
  detailView += '<p class="vehicle-price">';

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util; 
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