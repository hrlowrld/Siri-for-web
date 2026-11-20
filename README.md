# Siri27

A Manifest V3 Chrome extension with a floating Liquid Glass-inspired assistant.

## Install
1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this folder.

## Features
- Floating assistant panel with an animated orb and responsive glass styling.
- Voice input using the browser Speech Recognition API where supported.
- Time/date, weather (Open-Meteo), local notes, timers and reminders.
- Optional Fitbit API connection using a user-supplied access token.
- Slash commands: `/help`, `/mute`, `/clear`, `/newtab`, `/chatgpt`.

## Notes
- Weather requires an internet connection.
- Fitbit access requires a valid token and the relevant Fitbit permissions.
- Browser speech recognition availability depends on Chrome and region.
- Open-ended AI answers are not generated locally; use the ChatGPT shortcut to open ChatGPT.
- This is a functional starter release, not a claim of fully silent background ChatGPT automation.
