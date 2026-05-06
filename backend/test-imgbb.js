require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
const form = new FormData();
form.append('image', buf.toString('base64'));
form.append('name', 'test_icon');

axios.post('https://api.imgbb.com/1/upload?key=' + process.env.IMGBB_API_KEY, form, { headers: form.getHeaders() })
  .then(r => {
    const d = r.data.data;
    console.log('=== ImgBB Response ===');
    console.log('url:', d.url);
    console.log('display_url:', d.display_url);
    console.log('image.url:', d.image?.url);
    console.log('thumb.url:', d.thumb?.url);
    console.log('medium.url:', d.medium?.url);
  })
  .catch(e => console.log('Error:', e.response?.data || e.message));
