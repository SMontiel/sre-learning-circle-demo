module.exports.handler = async (event) => {
    console.log('Event: ', event);

    const quantity = event.queryStringParameters && event.queryStringParameters['quantity'];
    if (!quantity || isNaN(Number(quantity))) {
      return {
        statusCode: 422,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Invalid quantity',
        }),
      }
    }
  
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'USD$ ' + quantity + ' = MXN$ ' + (Number(quantity) * 20),
      }),
    }
  }