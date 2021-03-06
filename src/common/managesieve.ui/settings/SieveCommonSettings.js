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

  /**
   * Manages the accounts common settings.
   */
  class SieveCommonSettings {

    constructor(account) {
      this.account = account;
    }

    getDebugFlags() {
      return 255;
    }

  }

  if (typeof (module) !== "undefined" && module && module.exports) {
    module.exports.SieveCommonSettings = SieveCommonSettings;
  } else {
    exports.SieveCommonSettings = SieveCommonSettings;
  }


})(this);
