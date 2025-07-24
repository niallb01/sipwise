export function formatDateToLocal(dateString: string) {
  return new Date(dateString).toLocaleString(); // Uses device timezone by default
}

// Optional with timezone abbreviation
export function formatDateToLocalWithTZ(dateString: string) {
  return new Date(dateString).toLocaleString(undefined, {
    timeZoneName: "short",
  });
}
