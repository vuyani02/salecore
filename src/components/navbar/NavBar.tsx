"use client";
import { Layout, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  TeamOutlined,
  ContactsOutlined,
  RiseOutlined,
  DollarOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  CalendarOutlined,
  FileOutlined,
  FolderOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavBarStyles } from "./styles/navBarStyle";

const { Sider } = Layout;
const { Title } = Typography;

const NAV_ITEMS = [
  { href: "/dashboard",       label: "Dashboard",        icon: <DashboardOutlined /> },
  { href: "/clients",         label: "Clients",          icon: <TeamOutlined />      },
  { href: "/contacts",        label: "Contacts",         icon: <ContactsOutlined />  },
  { href: "/Opportunities",   label: "Opportunities",    icon: <RiseOutlined />      },
  { href: "/pricingrequests", label: "Pricing Requests", icon: <DollarOutlined />    },
  { href: "/proposals",       label: "Proposals",        icon: <FileTextOutlined />  },
  { href: "/contracts",       label: "Contracts",        icon: <FileDoneOutlined />  },
  { href: "/activities",      label: "Activities",       icon: <CalendarOutlined />  },
  { href: "/notes",           label: "Notes",            icon: <FileOutlined />      },
  { href: "/documents",       label: "Documents",        icon: <FolderOutlined />    },
];

export default function NavBar() {
  const { styles, cx } = useNavBarStyles();
  const pathname = usePathname();

  return (
    <Sider width={260} className={styles.sider}>

      {/* Logo */}
      <div className={styles.logoWrap}>
        <Title level={2} className={styles.logo}>
          <span className={styles.sale}>Sale</span>
          <span className={styles.core}>core</span>
        </Title>
      </div>

      {/* Main nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cx(styles.navItem, isActive && styles.navItemActive)}
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings — pinned to bottom */}
      <div className={styles.navBottom}>
        <Link
          href="/settings"
          className={cx(styles.navItem, pathname.startsWith("/settings") && styles.navItemActive)}
        >
          <span className={styles.navIcon}><SettingOutlined /></span>
          <span className={styles.navLabel}>Settings</span>
        </Link>
      </div>

    </Sider>
  );
}