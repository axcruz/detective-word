// utils/index.js

// Index file for easier reference of utility functions
// Allows for importing on one line
// e.g. import {getInvestigations} from './utils'

import getInvestigations from "./getInvestigations";
import getLevels from "./getLevels";
import createWordSearch from "./createWordSearch";
import savePlayerScore from "./savePlayerScore";
import getScoreboard from "./getScoreboard";
import getUserPrefs from "./getUserPrefs";

export {
    getInvestigations,
    getLevels,
    createWordSearch,
    savePlayerScore,
    getScoreboard,
    getUserPrefs,
};
