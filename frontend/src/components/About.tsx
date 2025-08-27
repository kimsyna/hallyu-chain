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
      <div>
        <h3>
          <Trans i18nKey="about_mission_title" />
        </h3>
        <ul>
          <li>
            <Trans i18nKey="about_mission_list1" />
          </li>
          <li>
            <Trans i18nKey="about_mission_list2" />
          </li>
        </ul>
      </div>
      <div>
        <h3>
          <Trans i18nKey="about_usecases_title" />
        </h3>
        <ul>
          <li>
            <Trans i18nKey="about_usecases_list1" />
          </li>
          <li>
            <Trans i18nKey="about_usecases_list2" />
          </li>
        </ul>
      </div>
      <div>
        <h3>
          <Trans i18nKey="about_benefits_title" />
        </h3>
        <ul>
          <li>
            <Trans i18nKey="about_benefits_list1" />
          </li>
          <li>
            <Trans i18nKey="about_benefits_list2" />
          </li>
        </ul>
      </div>
    </section>
  )
}

export default About
