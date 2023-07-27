export function formatDate(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);

  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  if (!day || !month || !year) {
    return;
  }

  return `${day}/${month}/${year}`;
}

export function formatDateLong(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", // Full year (e.g., "2023")
    month: "long", // Full month name (e.g., "July")
    day: "numeric", // Day of the month, numeric (e.g., "22")
  };

  const formattedDate = date.toLocaleString("en-US", options);

  const parts: string[] = formattedDate.split(" ");

  if (!parts[1]) {
    return;
  }

  const day = parts[1].split(",")[0];
  const month = parts[0];
  const year = parts[2];

  if (!day || !month || !year) {
    return;
  }

  return `${day}.  ${month}${day?.endsWith(",") ? "" : ","} ${year}`;
}

export function formatDay(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const weekday = weekdays[date.getDay()];

  if (!weekday) {
    return;
  }

  return `${weekday}`;
}

export function formatMonth(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (!month || !year) {
    return "";
  }

  return `${month} ${year}`;
}

export function formatTime(unixTimestamp: number) {
  if (unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (!hours || !minutes) {
      return "";
    }

    return `${hours}:${minutes}`;
  }
}

export function formatTotal(start: number, end: number) {
  if (start && end) {
    const totalSeconds = end - start;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let result = "";

    if (hours > 0) {
      result += `${hours}h `;
    }

    if (minutes > 0) {
      result += `${minutes}min`;
    }

    return result;
  } else return `${0}h ${0}min`;
}

export function getMonthBoundaryTimestamps(dateString: Date) {
  const date = new Date(dateString);

  // Set the date to the beginning of the month
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  const startOfMonthTimestamp = Math.floor(date.getTime() / 1000);

  // Set the date to the next month and subtract 1 millisecond
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);
  date.setHours(23, 59, 59, 999);
  const endOfMonthTimestamp = Math.floor(date.getTime() / 1000);

  return [startOfMonthTimestamp, endOfMonthTimestamp];
}
