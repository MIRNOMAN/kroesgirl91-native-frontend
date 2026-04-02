// utils/getGreeting.ts

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}
