/*
 * The content of this file is licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 */

(function (exports) {

  "use strict";

  /* global $ */

  /**
   * A poor mans I18n helper class which provides help to translate strings.
   */
  class SieveI18n {

    /**
     * Sets the current locale. In case the locale is unknown an exception will be thrown.
     *
     * @param {string} locale
     *   the new locale
     * @returns {SieveI18n}
     *   a self reference
     */
    async setLocale(locale) {
      if (locale === undefined)
        locale = "en-US";

      if (this.locale === locale)
        return this;

      return await new Promise((resolve, reject) => {
        if (this.locale === locale)
          resolve(this);

        $.getJSON(`./i18n/${locale}.json`)
          .done((data) => {
            this.strings = data;
            resolve(this);
          })
          .fail(() => {
            reject(new Error("Failed to load locale"));
          });
      });
      // this.strings = require(`./i18n/${locale}.json`);
    }

    /**
     * The strings unique id
     *
     * @param {string} string
     *   the string which should be translated
     * @returns {string}
     *   the tranlated string
     */
    getString(string) {
      const value = this.strings[string];

      if (typeof (value) === "undefined" || value === null)
        return string;

      return value;
    }

  }

  if (typeof(module) !== "undefined" && module && module.exports)
    module.exports.SieveI18n = SieveI18n;
  else
    exports.SieveI18n = SieveI18n;

})(this);
