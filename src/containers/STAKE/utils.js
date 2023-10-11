export const getDay = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  if (now > timestamp) return 0;

  const day = Math.floor((timestamp - now) / (3600 * 24));
  return day;
};

export const getHour = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  if (now > timestamp) return 0;

  const hour = Math.floor(((timestamp - now) % (3600 * 24)) / 3600);
  return hour;
};

const format = (value) => {
  if (value.length < 2) return '0' + value;
  return value;
};
export const getTimeLeft = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  if (now >= timestamp) return '00:00:00:00';

  let day = '' + Math.floor((timestamp - now) / (3600 * 24));
  let hour = '' + Math.floor(((timestamp - now) % (3600 * 24)) / 3600);
  let minute = '' + Math.floor(((timestamp - now) % 3600) / 60);
  let second = '' + Math.floor((timestamp - now) % 60);

  return `${format(day)}:${format(hour)}:${format(minute)}:${format(second)}`;
};
