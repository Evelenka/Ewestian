/* jshint esversion: 6 */
/* global chrome, define */

define(['./config.js'], (config) => {

    return {

        /**
         * Get some properties from url such as protocol, pathname etc.
         * @param {string} property
         * @param {string} url
         * @returns {string}
         */
        getFromUrl(property, url) {
            let a = document.createElement('a');
            a.href = url;
            return a[property];
        },

        /**
         * Get active and focused tab
         * @param {Object[]} tabs
         * @returns {Object|boolean} tab object or false
         */
        getActiveTab(tabs) {
            let i = 0;
            while (i < tabs.length && !tabs[i].active) {
                i++;
            }

            if (tabs[i]) {
                return tabs[i];
            }
            return false;
        },

        /**
         * Get date with format yyyy-mm-dd
         * @param {Date} [date=new Date()]
         * @returns {string}
         */
        getDateString(date = new Date()) {
            const
                year = date.getFullYear(),
                month = ('0' + (date.getMonth() + 1)).slice(-2),
                day = ('0' + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },

        /**
         * Get yesterday date
         * @returns {Date}
         */
        getYesterdayDate() {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            return date;
        },

        /**
         * Get the day yesterday
         * @returns {string}
         */
        getYesterdayDay() {
            const yesterdayDate = this.getYesterdayDate();
            return yesterdayDate.getDate().toString();
        },

        /**
         * Get yesterday date
         * @returns {number}
         */
        getLastMonth() {
            let currentMonth = parseInt(this.getCurrentMonth(), 10);
            let lastMonth = currentMonth - 1;
            if (lastMonth === 0) {
                return 12;
            }
            return lastMonth;
        },

        /**
         * Get last quarter
         * @returns {number}
         */
        getLastQuarter: function () {
            let currentQuarter = parseInt(this.getCurrentQuarter(), 10);
            let lastQuarter = currentQuarter - 1;
            if (lastQuarter === 0) {
                return 4;
            }
            return lastQuarter;
        },

        /**
         * Get current year
         * @returns {string}
         */
        getCurrentYear() {
            return new Date().getFullYear().toString();
        },

        /**
         * Get current quarter
         * @returns {string}
         */
        getCurrentQuarter() {
            return Math.floor((new Date().getMonth() + 3) / 3).toString();
        },

        /**
         * Get current month
         * @returns {string}
         */
        getCurrentMonth() {
            return (new Date().getMonth() + 1).toString();
        },

        /**
         * Get current day of the month
         * @returns {string}
         */
        getCurrentDayOfTheMonth() {
            return new Date().getDate().toString();
        },

        /**
         * Get current day of the week
         * @returns {string}
         */
        getCurrentDayOfTheWeek() {
            let dayOfTheWeek = new Date().getDay();
            // Sunday should be 7th day of the week
            if (dayOfTheWeek === 0) {
                dayOfTheWeek = 7;
            }
            return dayOfTheWeek.toString();
        },

        /**
         * Get current time with format hh:mm
         * @returns {string}
         */
        getCurrentTime() {
            const date = new Date(),
                hour = ('0' + date.getHours()).slice(-2),
                minute = ('0' + date.getMinutes()).slice(-2);
            return `${hour}:${minute}`;
        },

        /**
         * Check if chrome window is active and focused
         * @returns {boolean}
         */
        isWindowActive(window) {
            return window && window.focused;
        },

        /**
         * Is there any sound from the tab (video, player, music)
         * @param {Object} tab
         * @returns {boolean}
         */
        isSoundFromTab(tab) {
            return tab && tab.audible;
        },

        /**
         * Is current state active
         * @param {string} state active, idle or locked
         * @returns {boolean}
         */
        isStateActive(state) {
            if (config.COUNT_ONLY_ACTIVE_STATE) {
                return chrome.idle.IdleState.ACTIVE === state;
            }
            return true;
        },

        /**
         * Check if protocol from url is blacklisted
         * @param {string} url
         * @returns {boolean}
         */
        isProtocolOnBlacklist: function (url) {
            return config.BLACKLIST_PROTOCOL.indexOf(this.getFromUrl('protocol', url)) !== -1;
        },

        /**
         * Log to console if it is development mode
         * @param {*} args
         * @return {undefined}
         */
        debugLog(...args) {
            if (config.DEVELOPMENT_MODE) {
                let fnArguments = [].slice.call(args);
                if (typeof fnArguments[0] === 'string') {
                    fnArguments[0] = '%c' + fnArguments[0];
                    fnArguments.splice(1, 0, 'color: #1E90FF');
                }
                /* eslint-disable no-console */
                console.log.apply(console, fnArguments);
                /* eslint-enable no-console */
            }
        },

        /**
         * Add 1 to current number in a given property
         * @param {Object} obj
         * @param {string} property
         * @returns {Object} obj
         */
        increment(obj, property) {
            if (!obj[property]) {
                obj[property] = 0;
            }
            obj[property] += 1;
            return obj[property];
        },

        /**
         * Prepares the data storage object by adding methods directly to it.
         * These methods are used for easier navigation around the facility
         * @param {Object} data
         */
        prepareDataObjectMethods(data) {

            let utils = this,
                descObj = {
                writable: false,
                enumerable: false,
                configurable: false
            };

            function getYear(hostname, year = utils.getCurrentYear()) {
                return this[hostname][year];
            }

            function getQuarter(hostname, quarter = utils.getCurrentQuarter()) {
                try {
                    return this.getYear(hostname)[quarter];
                } catch (ex) {
                    utils.debugLog(`Error in getQuarter: ${hostname}, ${quarter}`)
                    return false;
                }
            }

            function getMonth(hostname, month = utils.getCurrentMonth()) {
                return this.getQuarter(hostname)[month];
            }

            function getDayOfTheMonth(hostname, dayOfTheMonth = utils.getCurrentDayOfTheMonth()) {
                return this.getMonth(hostname)[dayOfTheMonth];
            }

            function getDayOfTheWeek(hostname, dayOfTheWeek = utils.getCurrentDayOfTheWeek()) {
                return this.getMonth(hostname)[config.DAY_OF_THE_WEEK][dayOfTheWeek];
            }

            function getToday(hostname) {
                return this.getDayOfTheMonth(hostname);
            }

            function getYesterday(hostname) {
                return this.getDayOfTheMonth(hostname, utils.getYesterdayDay());
            }

            function defineValue(obj, fn) {
                let object = Object.assign({}, obj);
                object.value = fn;
                return object;
            }

            Object.defineProperties(data, {
                'getYear': defineValue(descObj, getYear),
                'getQuarter': defineValue(descObj, getQuarter),
                'getMonth': defineValue(descObj, getMonth),
                'getDayOfTheWeek': defineValue(descObj, getDayOfTheWeek),
                'getDayOfTheMonth': defineValue(descObj, getDayOfTheMonth),
                'getToday': defineValue(descObj, getToday),
                'getYesterday': defineValue(descObj, getYesterday)
            });
        }
    };

});