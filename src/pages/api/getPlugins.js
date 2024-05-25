const fs = require('fs')

export default async function handler(req, res) {
   const data = JSON.parse(fs.readFileSync('public/plugins.json', 'utf-8'))
   res.status(200).json(data)
}