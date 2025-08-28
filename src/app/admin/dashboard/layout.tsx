
import APP_TITLE from '../../appTitle';

export const metadata = {
  title: `Admin - ${APP_TITLE}`,
  description: `Dashboard Admin ${APP_TITLE}`,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
