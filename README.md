# Skistar activities exposed as iCal calendar

[![CodeQL](https://github.com/ismarslomic/skistar-activities-ical/actions/workflows/codeql.yml/badge.svg)](https://github.com/ismarslomic/skistar-activities-ical/actions/workflows/codeql.yml)
[![ESLint](https://github.com/ismarslomic/skistar-activities-ical/actions/workflows/eslint.yml/badge.svg)](https://github.com/ismarslomic/skistar-activities-ical/actions/workflows/eslint.yml)
[![ESLint](https://github.com/ismarslomic/skistar-activities-ical/actions/workflows/build.yml/badge.svg)](https://github.com/ismarslomic/skistar-activities-ical/actions/workflows/build.yml)
[![Unit tests](https://codecov.io/gh/ismarslomic/skistar-activities-ical/branch/main/graph/badge.svg?token=MQPHY294KB)](https://codecov.io/gh/ismarslomic/skistar-activities-ical)

> NodeJS app exposing the upcoming activities at Skistar destinations, similar to what is displayed
> at [Activities in Hemsedal](https://www.skistar.com/en/ski-destinations/hemsedal/winter-in-hemsedal/events/) as valid
> iCal calendar.

# Example

HTTP GET http://localhost:3000/skistar_calendar.ics

```text
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//skistar.com//activities//NO
NAME:Skistar activities in Hemsedal
X-WR-CALNAME:Skistar activities in Hemsedal
BEGIN:VTIMEZONE
TZID:Europe/Oslo
TZURL:http://tzurl.org/zoneinfo-outlook/Europe/Oslo
X-LIC-LOCATION:Europe/Oslo
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
TIMEZONE-ID:Europe/Oslo
X-WR-TIMEZONE:Europe/Oslo
BEGIN:VEVENT
UID:4360e507-d7a4-4b45-9323-3219c1dfd2aa
SEQUENCE:0
DTSTAMP:20230423T233248
DTSTART;VALUE=DATE:20230423
DTEND;VALUE=DATE:20230423
X-MICROSOFT-CDO-ALLDAYEVENT:TRUE
X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE
SUMMARY:SkiStar Winter Games Hemsedal
LOCATION:Hemsedal skisenter
DESCRIPTION:SkiStar Winter Games er det åpenbare møtestedet for alle som
  elsker alpin utforkjøring. Konkurranser i toppklasse kombineres med akti
 viteter som inspirerer til skiglede\, både i og utenfor konkurransearenae
 n. SkiStar Winter Games er noe å se frem til – vinterens store skifest.
  Her konkurrerer barn og ungdom på en arena som gjøres så lik en verden
 scupkonkurranse som mulig\, med storskjerm\, direktesending og partnerby.
ATTACH:https://www.skistar.com/calendar-api/assets/b2/b28a4059-5bfb-4924-9
 3fa-081b9d0cfe55/1920x1080wintergamestoppbildhemsedal1.jpg
END:VEVENT
END:VCALENDAR
```

## Run the application

```bash
npm run start
```

## Configuration

All configuration can be done through environment variables, which you can define for example in this way:

```bash
DESTINATION=Trysil LANGUAGE=English npm run start
```

| Name             | Default                | Description                                                                                                                                                |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`           | `3000`                 | The server port serving the iCal file                                                                                                                      |
| `HOST_NAME`      | `localhost`            | The server host name serving the iCal file                                                                                                                 |
| `CAL_FILE_NAME`  | `skistar_calendar.ics` | The iCal file name used in the URL                                                                                                                         |
| `DAYS_IN_FUTURE` | `14`                   | How many days in the future from now to retrieve Skistar actvities                                                                                         |
| `DESTINATION`    | `Hemsedal`             | The Skistar destination to retrieve activities for. Valid options are: <br/>- `Hemsedal` <br/>- `Salen` <br/>- `Åre` <br/>- `Vemdalen` <br/>- `Trysil`     |
| `LANGUAGE`       | `Norsk`                | The language used for text in event title and description. Valid options are:<br/>- `English` <br/>- `Norsk` <br/>- `Svenska`<br/>- `Dansk`<br/>- `Trysil` |

## Contribution

1. Clone the repository
2. Install the dependencies with `npm install`
3. Compile the _TypeScript_ files with `npm run build`

Note! `pre-commit` hook is configured to run _eslint_, _prettier_ and _build_ before committing the changes to git,
see [lint-staged](lint-staged.config.mjs) and [husky pre-commit](.husky/pre-commit) configuration files.

### Linting and formatting

```bash
npm run lint
npm run prettier
```

### Run unit tests locally

```bash
npm run test:unit
```

### Codecov integration in Github actions

Add **Repository secret** in your Github repository with name `CODECOV_TOKEN` and a
secret value from your [codecov.io](https://app.codecov.io/gh) account.
