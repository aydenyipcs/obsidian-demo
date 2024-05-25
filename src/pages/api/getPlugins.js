import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
   try {
      console.log('path hit')
      const jsonDirectory = path.join(process.cwd(), 'public');
      const filePath = path.join(jsonDirectory, 'plugins.json');
      const fileContents = await fs.readFile(filePath, 'utf8');
      console.log('got data')
      const data = JSON.parse(fileContents);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error reading plugins file:", error.message);
      res.status(500).json({ error: 'Failed to read plugins file', details: error.message });
    }
}