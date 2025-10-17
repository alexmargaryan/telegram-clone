/**
 * Converts a string like "10s", "10m", "10h", "10d" to a number of milliseconds
 */
export const parseStringToTime = (time: string): number => {
  const match = time.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000, // seconds
    m: 60 * 1000, // minutes
    h: 60 * 60 * 1000, // hours
    d: 24 * 60 * 60 * 1000, // days
  };

  return value * multipliers[unit];
};
