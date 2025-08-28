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
    fetch('/resources.json')
      .then((res) => res.json())
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
