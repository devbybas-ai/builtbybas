"use client";

import { ProfileSettings } from "./settings/ProfileSettings";
import { PasswordSettings } from "./settings/PasswordSettings";
import { BusinessSettings } from "./settings/BusinessSettings";
import { NotificationSettings } from "./settings/NotificationSettings";

interface SettingsFormProps {
  user: { id: string; name: string; email: string; role: string };
}

export function SettingsForm({ user }: SettingsFormProps) {
  return (
    <div className="mt-6 space-y-6">
      <ProfileSettings user={user} />
      <PasswordSettings />
      <BusinessSettings />
      <NotificationSettings />
    </div>
  );
}
