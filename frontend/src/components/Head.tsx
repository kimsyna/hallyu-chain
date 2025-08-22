import { Helmet } from 'react-helmet'

function Head() {
  return (
    <Helmet>
      <link rel="icon" type="image/svg+xml" href="/assets/hall-symbol.svg" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto&family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  )
}

export default Head
