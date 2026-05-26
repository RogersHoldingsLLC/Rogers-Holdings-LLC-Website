/*
  Rogers Holdings LLC Business Time Tracker

  Setup step:
  1. Deploy the Google Apps Script backend as a web app.
  2. Copy the web app URL.
  3. Paste it below between the quotes.
*/
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynzYDOH7Gt_MJRGJwEuN2hzRMIIg5i_EfhZs1Rz_4EirNCxtvZZgi6bbxiQ3jumRzn/exec";

const STORAGE_KEYS = {
  activeSession: "rogersTimeTracker.activeSession",
  completedSessions: "rogersTimeTracker.completedSessions",
  personName: "rogersTimeTracker.personName",
};

// Some browsers restrict localStorage on file:// pages. This fallback keeps
// the app usable, though refresh persistence works best from http://localhost.
const memoryStorage = {};

const statusPill = document.getElementById("statusPill");
const sessionTimer = document.getElementById("sessionTimer");
const sessionDetail = document.getElementById("sessionDetail");
const todayTotal = document.getElementById("todayTotal");
const weekTotal = document.getElementById("weekTotal");
const personNameField = document.getElementById("personName");
const notesField = document.getElementById("notes");
const clockInBtn = document.getElementById("clockInBtn");
const clockOutBtn = document.getElementById("clockOutBtn");
const message = document.getElementById("message");

let activeSession = readJson(STORAGE_KEYS.activeSession, null);
let completedSessions = readJson(STORAGE_KEYS.completedSessions, []);
let sheetTotals = null;
let timerInterval = null;

clockInBtn.addEventListener("click", handleClockIn);
clockOutBtn.addEventListener("click", handleClockOut);
personNameField.addEventListener("change", savePersonName);
personNameField.addEventListener("input", storePersonName);
notesField.addEventListener("input", saveActiveNotes);

loadPersonName();
loadSavedNotes();
render();
startTimer();
refreshTotalsFromSheet();

function handleClockIn() {
  const person = getPersonName();

  if (!person) {
    showMessage("Enter the person's name before clocking in.", "error");
    personNameField.focus();
    return;
  }

  if (activeSession) {
    showMessage("You are already clocked in. Clock out before starting another session.", "error");
    return;
  }

  const now = new Date();
  activeSession = {
    clockInIso: now.toISOString(),
    person,
    notes: notesField.value.trim(),
  };
  writeJson(STORAGE_KEYS.activeSession, activeSession);
  showMessage(`Clocked in at ${formatTime(now)}.`, "success");
  render();
}

async function handleClockOut() {
  if (!activeSession) {
    showMessage("You are already clocked out. Clock in before ending a session.", "error");
    return;
  }

  if (!APPS_SCRIPT_URL) {
    showMessage("Add your Google Apps Script web app URL in script.js before clocking out.", "error");
    return;
  }

  const clockInDate = new Date(activeSession.clockInIso);
  const clockOutDate = new Date();
  const notes = notesField.value.trim() || activeSession.notes || "";
  const session = buildSessionRecord(clockInDate, clockOutDate, notes);

  setButtonsDisabled(true);
  showMessage("Saving this session to Google Sheets...", "");

  try {
    const response = await callAppsScript("saveSession", {
      payload: JSON.stringify(session),
      date: session.date,
      week: session.week,
      year: session.year,
      person: session.person,
    });

    if (!response.ok) {
      throw new Error(response.message || "Google Apps Script could not save the row.");
    }

    completedSessions.push(session);
    writeJson(STORAGE_KEYS.completedSessions, completedSessions);
    sheetTotals = response.totals || sheetTotals;
    removeStorageItem(STORAGE_KEYS.activeSession);
    activeSession = null;
    notesField.value = "";

    showSheetMessage(
      `Clocked out at ${formatTime(clockOutDate)}. Session saved to the Time Entries tab in Google Sheets.`,
      response.spreadsheetUrl
    );
    render();
  } catch (error) {
    showMessage(`The session was not saved: ${error.message}`, "error");
  } finally {
    setButtonsDisabled(false);
    render();
  }
}

function buildSessionRecord(clockInDate, clockOutDate, notes) {
  const totalHours = (clockOutDate - clockInDate) / 36e5;
  const dateParts = getDateParts(clockInDate);

  return {
    person: activeSession.person || getPersonName(),
    date: formatDate(clockInDate),
    clockInTime: formatTime(clockInDate),
    clockOutTime: formatTime(clockOutDate),
    totalTime: totalHours.toFixed(2),
    notes,
    week: getWeekNumber(clockInDate),
    month: dateParts.month,
    year: dateParts.year,
    clockInIso: clockInDate.toISOString(),
    clockOutIso: clockOutDate.toISOString(),
  };
}

function callAppsScript(action, extraParams) {
  /*
    Apps Script web apps do not provide normal browser CORS headers.
    JSONP keeps the setup simple: the app creates a temporary script tag,
    Apps Script calls our callback, and we can read the success response.
  */
  return new Promise((resolve, reject) => {
    const callbackName = `rogersTimeTrackerCallback_${Date.now()}`;
    const params = new URLSearchParams({
      action,
      callback: callbackName,
      ...extraParams,
    });

    const script = document.createElement("script");
    script.src = `${APPS_SCRIPT_URL}?${params.toString()}`;
    script.async = true;

    const cleanup = () => {
      delete window[callbackName];
      script.remove();
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("The Google Sheets save request timed out."));
    }, 20000);

    window[callbackName] = (response) => {
      window.clearTimeout(timeout);
      cleanup();
      resolve(response || { ok: false, message: "Empty response from Apps Script." });
    };

    script.onerror = () => {
      window.clearTimeout(timeout);
      cleanup();
      reject(new Error("Could not reach the Google Apps Script web app."));
    };

    document.body.appendChild(script);
  });
}

function render() {
  const isClockedIn = Boolean(activeSession);
  statusPill.textContent = isClockedIn ? "Clocked In" : "Clocked Out";
  statusPill.classList.toggle("clocked-in", isClockedIn);
  clockInBtn.disabled = isClockedIn;
  clockOutBtn.disabled = !isClockedIn;

  if (isClockedIn) {
    const clockInDate = new Date(activeSession.clockInIso);
    sessionTimer.textContent = formatDuration(Date.now() - clockInDate.getTime());
    sessionDetail.textContent = `Started at ${formatTime(clockInDate)}.`;
  } else {
    sessionTimer.textContent = "00:00:00";
    sessionDetail.textContent = "Ready to clock in.";
  }

  todayTotal.textContent = `${getTodayHours().toFixed(2)} hrs`;
  weekTotal.textContent = `${getWeekHours().toFixed(2)} hrs`;
}

function startTimer() {
  timerInterval = window.setInterval(render, 1000);
}

async function refreshTotalsFromSheet() {
  if (!APPS_SCRIPT_URL) {
    return;
  }

  try {
    const now = new Date();
    const response = await callAppsScript("getTotals", {
      date: formatDate(now),
      week: getWeekNumber(now),
      year: now.getFullYear(),
      person: getPersonName(),
    });

    if (response.ok) {
      sheetTotals = response.totals;
      render();
    }
  } catch (error) {
    showMessage("Could not refresh totals from Google Sheets. Local totals are still shown.", "error");
  }
}

function saveActiveNotes() {
  if (!activeSession) {
    return;
  }

  activeSession.notes = notesField.value.trim();
  writeJson(STORAGE_KEYS.activeSession, activeSession);
}

function savePersonName() {
  writeStorageItem(STORAGE_KEYS.personName, getPersonName());
  sheetTotals = null;
  refreshTotalsFromSheet();
  render();
}

function storePersonName() {
  writeStorageItem(STORAGE_KEYS.personName, getPersonName());
}

function loadPersonName() {
  personNameField.value = readStorageItem(STORAGE_KEYS.personName) || "";
}

function loadSavedNotes() {
  if (activeSession && activeSession.notes) {
    notesField.value = activeSession.notes;
  }
}

function getTodayHours() {
  if (sheetTotals) {
    return Number(sheetTotals.today || 0);
  }

  return sumHoursForToday();
}

function getWeekHours() {
  if (sheetTotals) {
    return Number(sheetTotals.week || 0);
  }

  return sumHoursForWeek();
}

function sumHoursForToday() {
  const today = formatDate(new Date());
  const person = getPersonName();

  return completedSessions
    .filter((session) => session.date === today && session.person === person)
    .reduce((sum, session) => sum + Number(session.totalTime || 0), 0);
}

function sumHoursForWeek() {
  const now = new Date();
  const week = getWeekNumber(now);
  const year = now.getFullYear();
  const person = getPersonName();

  return completedSessions
    .filter(
      (session) =>
        Number(session.week) === week &&
        Number(session.year) === year &&
        session.person === person
    )
    .reduce((sum, session) => sum + Number(session.totalTime || 0), 0);
}

function getPersonName() {
  return personNameField.value.trim();
}

function setButtonsDisabled(disabled) {
  clockInBtn.disabled = disabled || Boolean(activeSession);
  clockOutBtn.disabled = disabled || !activeSession;
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type || ""}`.trim();
}

function showSheetMessage(text, spreadsheetUrl) {
  showMessage(text, "success");

  if (!spreadsheetUrl) {
    return;
  }

  const link = document.createElement("a");
  link.href = spreadsheetUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = " Open sheet.";

  message.appendChild(link);
}

function readJson(key, fallback) {
  try {
    const value = readStorageItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  writeStorageItem(key, JSON.stringify(value));
}

function readStorageItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return memoryStorage[key] || null;
  }
}

function writeStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    memoryStorage[key] = value;
  }
}

function removeStorageItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    delete memoryStorage[key];
  }
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function getDateParts(date) {
  return {
    month: date.toLocaleString("en-US", { month: "long" }),
    year: date.getFullYear(),
  };
}

function getWeekNumber(date) {
  /*
    Returns the ISO-style week number so weekly totals stay consistent.
    Weeks begin on Monday.
  */
  const copiedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = copiedDate.getUTCDay() || 7;
  copiedDate.setUTCDate(copiedDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(copiedDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((copiedDate - yearStart) / 86400000 + 1) / 7);
}
