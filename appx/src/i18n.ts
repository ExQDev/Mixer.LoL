import {
  createI18n,
  LocaleMessages,
  LocaleMessageValue,
  VueMessageType
} from 'vue-i18n'

// import messages from '@intlify/vite-plugin-vue-i18n/messages'

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages (): LocaleMessages<
  Record<string, LocaleMessageValue<VueMessageType>>
  > {
  const locales = require.context(
    './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  )
  const messages: LocaleMessages<
    Record<string, LocaleMessageValue<VueMessageType>>
  > = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key).default
    }
  })
  console.log(messages)
  return messages
}

const setDateTimeFormats = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }
}

const dateTimeFormats = {
  en: setDateTimeFormats,
  es: setDateTimeFormats,
  de: setDateTimeFormats,
  'en-GB': setDateTimeFormats,
  ru: setDateTimeFormats
}

export default createI18n({
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
  dateTimeFormats
})
