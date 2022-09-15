<template>
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h1>4<span>0</span>4</h1>
      </div>
      <p>{{ $t('404.description') }}</p>
      <Button
        :label="$t('404.toHome')"
        @click="$router.push('/')"
        class="p-button-outlined p-button-lg" />
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Josefin Sans';
  font-style: normal;
  font-weight: 400;
  src: url(/fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_DjQbMlhLzTs.woff2)
    format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1,
    U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Josefin Sans';
  font-style: normal;
  font-weight: 400;
  src: url(/fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_DjQbMhhLzTs.woff2)
    format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Josefin Sans';
  font-style: normal;
  font-weight: 400;
  src: url(/fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_DjQbMZhLw.woff2)
    format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}
/* vietnamese */
@font-face {
  font-family: 'Josefin Sans';
  font-style: normal;
  font-weight: 700;
  src: url(/fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XbMlhLzTs.woff2)
    format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1,
    U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Josefin Sans';
  font-style: normal;
  font-weight: 700;
  src: url(/fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XbMhhLzTs.woff2)
    format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Josefin Sans';
  font-style: normal;
  font-weight: 700;
  src: url(/fonts.gstatic.com/s/josefinsans/v20/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XbMZhLw.woff2)
    format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}

#notfound {
  position: relative;
  background-color: #222;
  user-select: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 93vh;
}

#notfound .notfound {
  top: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
  /* position: absolute; */
  /* left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%); */
}

.notfound {
  max-width: 460px;
  width: 100%;
  text-align: center;
  line-height: 1.4;
}

.notfound .notfound-404 {
  height: 158px;
  line-height: 153px;
}

.notfound .notfound-404 h1 {
  font-family: 'Josefin Sans', sans-serif;
  color: #222;
  font-size: 220px;
  letter-spacing: 10px;
  margin: 0px;
  font-weight: 700;
  text-shadow: 2px 2px 0px #c9c9c9, -2px -2px 0px #c9c9c9;
}

.notfound .notfound-404 h1 > span {
  text-shadow: 2px 2px 0px #ffab00, -2px -2px 0px #ffab00, 0px 0px 8px #ff8700;
}

.notfound p {
  font-family: 'Josefin Sans', sans-serif;
  color: #c9c9c9;
  font-size: 16px;
  font-weight: 400;
  margin-top: 0px;
  margin-bottom: 15px;
}

.notfound a {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
  background: transparent;
  color: #c9c9c9;
  border: 2px solid #c9c9c9;
  display: inline-block;
  padding: 10px 25px;
  font-weight: 700;
  -webkit-transition: 0.2s all;
  transition: 0.2s all;
}

.notfound a:hover {
  color: #ffab00;
  border-color: #ffab00;
}

@media only screen and (max-width: 480px) {
  .notfound .notfound-404 {
    height: 122px;
    line-height: 122px;
  }

  .notfound .notfound-404 h1 {
    font-size: 122px;
  }
}
</style>
