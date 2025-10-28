function getTimeStamp(options?: {dateOnly?: boolean}){
	const now: Date = new Date();

	if (options?.dateOnly) {
    // Swedish locale, only the date part (YYYY-MM-DD)
    return now.toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });
  }

  // Full local datetime ( "2025-10-27 16:23:45")
  return now.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" });
}

export {getTimeStamp}