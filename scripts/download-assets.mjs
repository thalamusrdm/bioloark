import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const assets = {
  'logo-header.png': 'https://static.wixstatic.com/media/4f9f6b_3d3a1dd7f06d45f5a610115395c948e1~mv2.png',
  'logo-footer.png': 'https://static.wixstatic.com/media/4f9f6b_8a5f0f1e9deb4677a7578e51ada1a428~mv2.png',
  'hero.jpg': 'https://static.wixstatic.com/media/4f9f6b_2cf1f47f9d4142bcaabcde524a053836~mv2.jpg',
  'og.jpg': 'https://static.wixstatic.com/media/4f9f6b_be1689861670429f94381d68d3d0800f~mv2.jpg',
  'terrarium-feature.jpg': 'https://static.wixstatic.com/media/4f9f6b_fab1a59deb92410c8a5bf84889dbb644~mv2.jpg',
  'service-green-wall.webp': 'https://static.wixstatic.com/media/4f9f6b_be93775bd0f0419eadf2b94c9add2c1b~mv2.webp',
  'service-hotels.jpg': 'https://static.wixstatic.com/media/4f9f6b_83db8ad2f0d14a1ea42ff94166592f12~mv2.jpg',
  'service-terrariums.webp': 'https://static.wixstatic.com/media/4f9f6b_0e4758d44f204dfcb5474b37f5d676c1~mv2.webp',
  'project-01.jpg': 'https://static.wixstatic.com/media/4f9f6b_2b9af87e16b14104a7a16ab7f8b76cc3~mv2.jpg',
  'project-02.jpg': 'https://static.wixstatic.com/media/4f9f6b_be1689861670429f94381d68d3d0800f~mv2.jpg',
  'project-03.webp': 'https://static.wixstatic.com/media/4f9f6b_1ba90b0a75cd49e4bbf40ddb42960557~mv2.webp',
  'project-04.webp': 'https://static.wixstatic.com/media/4f9f6b_4278ec045aba4cea8c44d77eb269b69d~mv2.webp',
  'project-05.webp': 'https://static.wixstatic.com/media/4f9f6b_1221ea54861a4af8b21fb308513f1ab6~mv2.webp',
  'project-06.webp': 'https://static.wixstatic.com/media/4f9f6b_0166c63b7697410f990c683afc4c7741~mv2.webp',
  'project-07.webp': 'https://static.wixstatic.com/media/4f9f6b_da59088a454a443fa3f7003c88b01179~mv2.webp',
  'project-08.webp': 'https://static.wixstatic.com/media/4f9f6b_735c9a80e5c6437cb5d48ec7c73c78ab~mv2.webp',
  'project-09.jpg': 'https://static.wixstatic.com/media/4f9f6b_989c8053a86147c7b3c284c887837c2d~mv2.jpg',
  'project-10.jpg': 'https://static.wixstatic.com/media/4f9f6b_d663610f672049a088980d5ccd258eef~mv2.jpg',
  'project-11.jpg': 'https://static.wixstatic.com/media/4f9f6b_02a321dc5e5741c68e5068ef1308d18c~mv2.jpg',
  'project-12.jpg': 'https://static.wixstatic.com/media/4f9f6b_9da772c6b2b449c9ac062054b7c4cda3~mv2.jpg',
};

const target = path.join(process.cwd(), 'public', 'images');
await mkdir(target, { recursive: true });
for (const [name, url] of Object.entries(assets)) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  await writeFile(path.join(target, name), Buffer.from(await response.arrayBuffer()));
  console.log(name);
}
