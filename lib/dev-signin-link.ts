import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const devSigninLinkPath = path.join(process.cwd(), '.next', 'dev-signin-link.json');

export type DevSigninLink = {
  email: string;
  url: string;
  createdAt: string;
};

export async function saveDevSigninLink(link: DevSigninLink) {
  await mkdir(path.dirname(devSigninLinkPath), { recursive: true });
  await writeFile(devSigninLinkPath, JSON.stringify(link), 'utf8');
}

export async function readDevSigninLink() {
  try {
    const contents = await readFile(devSigninLinkPath, 'utf8');
    return JSON.parse(contents) as DevSigninLink;
  } catch {
    return null;
  }
}
