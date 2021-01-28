exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: 'developer.han',
      age: 45,
      email: 'developer.han@theenm.com'
    })
  }
}