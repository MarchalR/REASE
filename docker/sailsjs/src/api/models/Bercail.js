/**
 * Bercail.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      id: {
          type: 'integer',
          required: true,
          unique: true,
          autoIncrement: true
      },
      title: {
          type: 'string',
      },
      description: {
          type: 'longtext',
      },
      postalCode: {
          type: 'string',
      },
      city: {
          type: 'string',
      },
      price: {
          type: 'string',
      },
      surface:{
          type: 'string',
      },
      nbRoom:{
          type: 'string',
      },
      url:{
          type: 'string',
      },
      picture:{
          type: 'array',
      },
      type:{

          type: 'string',
          enum: ['achat', 'location']
      },
      site:{

          type: 'string',
          enum: ['SeLoger', 'LeBonCoin']
      }
  }
};
