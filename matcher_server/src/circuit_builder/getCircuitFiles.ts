import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

export default async function getCircuitFiles(): Promise<Record<string, string>> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const circuitDir = path.join(__dirname, 'circuit');
  const circuitFiles: Record<string, string> = {};

  async function readCircuitFiles(dir: string) {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        // Recursively read subdirectories
        await readCircuitFiles(fullPath);
      } else if (path.extname(file) === '.ts') {
        // Create the exact path format you want
        const relativePath = `circuit/${file}`;
        const fileContent = await fs.readFile(fullPath, 'utf8');
        circuitFiles[relativePath] = fileContent.replace(/\n/g, '');
      }
    }
  }

  await readCircuitFiles(circuitDir);
  // console.log('circuitFiles: ', JSON.stringify(circuitFiles, null, 2));
  return circuitFiles;
}
