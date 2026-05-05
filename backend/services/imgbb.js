const axios = require('axios')
const FormData = require('form-data')

async function uploadToImgBB(buffer, name) {
  const form = new FormData()
  form.append('image', buffer.toString('base64'))
  form.append('name', name)

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    form,
    { headers: form.getHeaders() }
  )
  return res.data.data.url
}

module.exports = { uploadToImgBB }
