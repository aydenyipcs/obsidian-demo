const fs = require('fs')

export default async function handler(req, res) {
   const jsonDirectory = path.join(process.cwd(), 'public');
    const fileContents = await fs.readFile(jsonDirectory + '/plugins.json', 'utf8');
    const data = JSON.parse(fileContents);
   res.status(200).json(data)
}