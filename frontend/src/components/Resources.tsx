import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

interface Resource {
  nameKey: string;
  icon: string;
  url: string;
}

function Resources() {
  const [items, setItems] = useState<Resource[]>([]);

  useEffect(() => {
    Promise.all([fetch('/resources.json'), fetch('/token-address.json')])
      .then(async ([resRes, addrRes]) => {
        const resources = await resRes.json();
        if (addrRes.ok) {
          const addresses = await addrRes.json();
          if (addresses.mainnet?.HallyuToken) {
            resources.push({
              nameKey: 'res_token_mainnet',
              icon: 'token',
              url: `https://etherscan.io/token/${addresses.mainnet.HallyuToken}`,
            });
          }
          if (addresses.testnet?.HallyuToken) {
            resources.push({
              nameKey: 'res_token_testnet',
              icon: 'token',
              url: `https://sepolia.etherscan.io/token/${addresses.testnet.HallyuToken}`,
            });
          }
        }
        return resources;
      })
      .then(setItems)
      .catch((err) => console.error('Failed to load resources:', err));
  }, []);

  return (
    <section id="resources">
      <h2>
        <Trans i18nKey="resources_title" />
      </h2>
      <ul className="icon-list">
        {items.map((item) => (
          <li key={item.nameKey}>
            <i className="material-symbols-outlined" aria-hidden="true">
              {item.icon}
            </i>
            <a
              href={item.url}
              target={item.url.startsWith('http') ? '_blank' : undefined}
              rel={
                item.url.startsWith('http') ? 'noopener noreferrer' : undefined
              }
            >
              <Trans i18nKey={item.nameKey} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Resources;
