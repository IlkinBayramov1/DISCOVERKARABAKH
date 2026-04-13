import type { MegaMenu } from '../../types/home.types';

interface ScriptsProps {
  mega: MegaMenu;
}

export default function Scripts({ mega }: ScriptsProps) {
  // Safely serialize — replace < to avoid breaking out of script tag
  const megaJson = JSON.stringify(mega).replace(/</g, '\\u003c');

  const inlineScript = `window.__MEGA__ = ${megaJson};`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: inlineScript }} />
      {/* Analytics placeholder — replace with your actual script */}
      {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" /> */}
    </>
  );
}
