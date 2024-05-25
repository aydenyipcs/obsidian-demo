const fs = require('fs')

export default async function handler(req, res) {
   console.log('path hit')
   const jsonDirectory = path.join(process.cwd(), 'public');
    const filePath = path.join(jsonDirectory, 'plugins.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    console.log('got data')
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
}