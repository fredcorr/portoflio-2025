import type { NavigationItem } from "./components/navigation";

export interface SettingsData {
  email?: string;
  navigationItems?: NavigationItem[];
  socialLinks?: NavigationItem[];
  projectCount?: number;
}
