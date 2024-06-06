const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const products = [
  { productId: '1', name: 'Product 1', description: 'Description 1', price: 10.0, stock: 100 },
  { productId: '2', name: 'Product 2', description: 'Description 2', price: 20.0, stock: 200 },
  { productId: '3', name: 'Product 3', description: 'Description 3', price: 30.0, stock: 300 },
  { productId: '4', name: 'Product 4', description: 'Description 4', price: 40.0, stock: 400 },
  { productId: '5', name: 'Product 5', description: 'Description 5', price: 50.0, stock: 500 },
  { productId: '6', name: 'Product 6', description: 'Description 6', price: 60.0, stock: 600 },
  { productId: '7', name: 'Product 7', description: 'Description 7', price: 70.0, stock: 700 },
  { productId: '8', name: 'Product 8', description: 'Description 8', price: 80.0, stock: 800 },
  { productId: '9', name: 'Product 9', description: 'Description 9', price: 90.0, stock: 900 },
  { productId: '10', name: 'Product 10', description: 'Description 10', price: 100.0, stock: 1000 },
  { productId: '11', name: 'Product 11', description: 'Description 11', price: 110.0, stock: 1100 },
  { productId: '12', name: 'Product 12', description: 'Description 12', price: 120.0, stock: 1200 },
  { productId: '13', name: 'Product 13', description: 'Description 13', price: 130.0, stock: 1300 },
  { productId: '14', name: 'Product 14', description: 'Description 14', price: 140.0, stock: 1400 },
  { productId: '15', name: 'Product 15', description: 'Description 15', price: 150.0, stock: 1500 },
  { productId: '16', name: 'Product 16', description: 'Description 16', price: 160.0, stock: 1600 },
  { productId: '17', name: 'Product 17', description: 'Description 17', price: 170.0, stock: 1700 },
  { productId: '18', name: 'Product 18', description: 'Description 18', price: 180.0, stock: 1800 },
  { productId: '19', name: 'Product 19', description: 'Description 19', price: 190.0, stock: 1900 },
  { productId: '20', name: 'Product 20', description: 'Description 20', price: 200.0, stock: 2000 },
];

async function populateProducts() {
  for (const product of products) {
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Item: product,
    };

    try {
      await dynamo.put(params).promise();
      console.log(`Inserted product: ${product.name}`);
    } catch (error) {
      console.error(`Failed to insert product: ${product.name}`, error);
    }
  }
}

module.exports.populateProductsHandler = async (event) => {
  await populateProducts();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Products populated successfully' }),
  };
};
