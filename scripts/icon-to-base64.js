import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE64_HEADER = 'data:image/png;base64,';

/**
 * resize icon.png to 64x64 and generate base64 string
 * then write the string to package.json
 */
async function main() {
  console.log('===== generate icon.png base64 =====');
  try {
    // icon.png => 64x64 => base64
    const buffer = await sharp('icon.png')
      .resize({
        width: 64,
        height: 64,
      })
      // use max compression level
      .png({ compressionLevel: 9 })
      .toBuffer();
    const base64Str = buffer.toString('base64');
    console.log('length:', base64Str.length);
    console.log(BASE64_HEADER + base64Str);

    // base64 => package.json
    const content = readFileSync('package.json', 'utf-8');
    const o = JSON.parse(content);
    o.bgt.icon = base64Str;
    writeFileSync('package.json', JSON.stringify(o));

    console.log('====================================' + '\n');
  } catch (e) {
    console.error(e);
  }
}

main();
