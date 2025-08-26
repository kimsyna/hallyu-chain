import { Trans } from 'react-i18next'

function About() {
  return (
    <section id="about">
      <h2>
        <Trans i18nKey="about_title" />
      </h2>
      <p>
        <Trans i18nKey="about_text" />
      </p>
      <p>
        <Trans i18nKey="about_text2" />
      </p>
      <p>
        <Trans i18nKey="about_text3" />
      </p>
    </section>
  )
}

export default About
