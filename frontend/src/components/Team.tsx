import { Trans } from 'react-i18next'

function Team() {
  return (
    <section id="team">
      <h2>
        <Trans i18nKey="team_hero_title" />
      </h2>
      <p>
        <Trans i18nKey="team_hero_subtitle" />
      </p>
      <ul className="team-roles">
        <li>
          <Trans i18nKey="role_ceo" />
        </li>
        <li>
          <Trans i18nKey="role_cto" />
        </li>
        <li>
          <Trans i18nKey="role_lead" />
        </li>
      </ul>
      <h3>
        <Trans i18nKey="team_links_title" />
      </h3>
      <ul className="icon-list">
        <li>
          <i className="material-symbols-outlined">public</i>
          <a
            href="https://twitter.com/hallyu_chain"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans i18nKey="team_link_twitter" />
          </a>
        </li>
        <li>
          <i className="material-symbols-outlined">chat</i>
          <a
            href="https://discord.gg/example"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans i18nKey="team_link_discord" />
          </a>
        </li>
        <li>
          <i className="material-symbols-outlined">code</i>
          <a
            href="https://github.com/hallyu-chain"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans i18nKey="team_link_github" />
          </a>
        </li>
      </ul>
    </section>
  )
}

export default Team
