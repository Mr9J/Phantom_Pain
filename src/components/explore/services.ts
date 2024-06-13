// 從DateTime傳還為字串(多久前)
export const DateTimeToString = (dateTime: string): string => {
  const now = new Date();
  const date = new Date(dateTime);
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);

  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小時前`;
  } else if (minutes > 0) {
    return `${minutes}分鐘前`;
  } else {
    return `${seconds}秒前`;
  }
};
