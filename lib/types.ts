export type Language = 'en' | 'hy';
export type SafetyContact = { id: string; name: string; phone: string };
export type SafetySessionType = 'location_share' | 'safe_ride' | 'unsafe_alert' | 'emergency';
export type SafetySession = {
  id: string;
  shareToken: string;
  type: SafetySessionType;
  startedAt: string;
  destination?: string;
};
