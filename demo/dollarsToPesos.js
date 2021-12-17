const https = require('https');

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

  const res = await fetch('https://free.currconv.com/api/v7/convert?q=USD_MXN&compact=ultra&apiKey=' + process.env.CONVERTER_API_KEY);
  const dollarPrice = JSON.parse(res).USD_MXN;
  const conversion = (Number(quantity) * Number(dollarPrice)).toFixed(3);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'USD$ ' + quantity + ' = MXN$ ' + conversion,
    }),
  }
}

async function fetch(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: 1000 }, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`))
      }

      const body = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        const resString = Buffer.concat(body).toString()
        resolve(resString)
      })
    })

    request.on('error', (err) => reject(err))
    request.on('timeout', (err) => {
      console.log('timed out', err)
      reject(err)
    })
  })
}
