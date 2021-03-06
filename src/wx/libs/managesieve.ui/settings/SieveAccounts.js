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

  /* global browser */
  const { SieveUniqueId } = require("libs/managesieve.ui/utils/SieveUniqueId.js");
  const { SieveAbstractAccount } = require("libs/managesieve.ui/settings/SieveAbstractAccount.js");

  /**
   * Manages the configuration for sieve accounts.
   * It behaves like a directory. It just lists the accounts.
   * The individual settings are managed by the SieveAccount object
   *
   * It uses the DOM's local store to persist the configuration data.
   */
  class SieveAccounts {

    /**
     * Creates a new instance
     *
     * @param {Function} callback
     *   the password callback.
     */
    constructor(callback) {
      this.callback = callback;
      this.accounts = {};
    }

    /**
     * Loads the list of accounts configurations.
     *
     * @returns {SieveAccounts}
     *   a self reference.
     */
    async load() {

      const items = await (browser.accounts.list());

      this.accounts = {};

      if (!items)
        return this;

      for (const item of items) {

        if (item.type !== "imap" && item.type !== "pop3")
          continue;

        this.accounts[item.id] = new SieveAbstractAccount(item.id, this.callback);
      }

      return this;
    }

    /**
     * Generates a pseudo unique id.
     * The id is guaranteed to be made of alphanumerical characters and dashes.
     *
     * @returns {string}
     *   the unique id in string representation.
     */
    generateId() {
      return (new SieveUniqueId()).generate();
    }

    /**
     * Returns a list with all accounts.
     * The accounts are returned as key value pairs (unique id and Account)
     *
     * @returns { object<string, SieveAccount>}
     *   a list with sieve account.
     */
    getAccounts() {
      return Object.keys(this.accounts);
    }

    /**
     * Returns a specific sieve account
     * @param {string} id
     *   the accounts unique id.
     * @returns {SieveAccount}
     *   the sieve account or undefined.
     */
    getAccountById(id) {
      return this.accounts[id];
    }
  }

  // Require modules need to use export.module
  if (typeof (module) !== "undefined" && module && module.exports)
    module.exports.SieveAccounts = SieveAccounts;
  else
    exports.SieveAccounts = SieveAccounts;

})(this);
