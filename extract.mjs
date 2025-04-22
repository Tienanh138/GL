import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SourceMapConsumer } from 'source-map';
import * as mkdirp from 'mkdirp';

// Tạo __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc sourcemap
const mapData = JSON.parse(await fs.readFile(path.join(__dirname, './main.js.map'), 'utf8'));
const outputDir = path.join(__dirname, './extracted');

// Extract từng file
await SourceMapConsumer.with(mapData, null, async consumer => {
  for (const sourcePath of consumer.sources) {
    const content = consumer.sourceContentFor(sourcePath, true);
    if (!content) continue;

    const relativePath = sourcePath.replace(/^webpack:\/\//, '');
    const outputPath = path.join(outputDir, relativePath);

    await mkdirp.mkdirp(path.dirname(outputPath));
    await fs.writeFile(outputPath, content, 'utf8');

    console.log('✔️ Extracted:', outputPath);
  }
});
