import { Trans } from 'react-i18next'

function Resources() {
  return (
    <section id="resources">
      <h2>
        <Trans i18nKey="resources_title" />
      </h2>
      <ul className="icon-list">
        <li>
          <i className="material-symbols-outlined">insert_drive_file</i>
          <a href="#whitepaper">
            <Trans i18nKey="res_whitepaper" />
          </a>
        </li>
        <li>
          <i className="material-symbols-outlined">code</i>
          <a
            href="https://github.com/hallyu-chain"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans i18nKey="res_github" />
          </a>
        </li>
        <li>
          <i className="material-symbols-outlined">chat</i>
          <a
            href="https://discord.gg/example"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans i18nKey="res_discord" />
          </a>
        </li>
      </ul>
    </section>
  )
}

export default Resources
