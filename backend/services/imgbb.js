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

  const data = res.data.data
  // image.url = direct image file URL (e.g. i.ibb.co/xxx/name.png)
  // display_url = also direct but may be resized
  // url = page URL (not what we want)
  const directUrl = data.image?.url || data.display_url || data.url
  console.log('ImgBB upload success:', directUrl)
  return directUrl
}

module.exports = { uploadToImgBB }
