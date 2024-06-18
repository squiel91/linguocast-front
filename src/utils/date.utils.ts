export const readableDate = (date: Date | string): string => new Intl.DateTimeFormat(
  'en-US',
  { year: 'numeric', month: 'long', day: 'numeric' }
).format(typeof date === 'string' ? new Date(date) : date)

export const relativeTime = (toCompare: Date | string): string => {
  let date: Date;
  if (typeof toCompare === 'string') date = new Date(toCompare);
  else date = toCompare;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Adjust today's date to the timezone of the input date
  const todayOffset = today.getTimezoneOffset() * 60 * 1000;
  const todayWithOffset = new Date(today.getTime() + todayOffset);

  // Adjust the input date to the timezone of today's date
  const dateOffset = date.getTimezoneOffset() * 60 * 1000;
  const dateWithOffset = new Date(date.getTime() + dateOffset);

  const diffTime = Math.abs(todayWithOffset.getTime() - dateWithOffset.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.ceil(diffDays / 7);
  const diffMonths = todayWithOffset.getMonth() - dateWithOffset.getMonth() +
    (12 * (todayWithOffset.getFullYear() - dateWithOffset.getFullYear()));
  const diffYears = todayWithOffset.getFullYear() - dateWithOffset.getFullYear();

  if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffWeeks === 1) {
    return 'Last week';
  } else if (diffWeeks < 5) {
    return `${diffWeeks} weeks ago`;
  } else if (diffMonths === 1) {
    return 'Last month';
  } else if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  } else if (diffYears === 1) {
    return 'Last year';
  } else {
    return `${diffYears} years ago`;
  }
}

export const formatSeconds = (seconds: number): string => {
  let formattedTime = '';

  if (seconds >= 3600) { // More than or equal to 1 hour
      const hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      formattedTime += `${hours}h `;
  }

  if (seconds >= 60) { // More than or equal to 1 minute
      const minutes = Math.floor(seconds / 60);
      seconds %= 60;
      formattedTime += `${minutes}m `;
  }

  if (seconds > 0 || formattedTime === '') { // More than or equal to 1 second or if formattedTime is still empty
      formattedTime += `${Math.floor(seconds)}s`;
  }

  return formattedTime.trim();
}

export const daySinceEpoche = (): number => {
  const now = new Date().getTime()
  return Math.floor(now / 8.64e7)
}
