"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./AppShell.module.css";

type AppShellProps = {
  children: React.ReactNode;
};

const navigation = [
  {
    href: "/",
    label: "Library",
    icon: "bx-library",
  },
  {
    href: "/search",
    label: "Search",
    icon: "bx-search",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: "bx-cog",
  },
];

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className={styles.app}>
      <main className={styles.content}>
        {children}
      </main>

      <nav
        className={styles.navigation}
        aria-label="Main navigation"
      >
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(
                  item.href,
                );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${
                isActive
                  ? styles.active
                  : ""
              }`}
            >
              <i
                className={`bx ${item.icon} ${styles.icon}`}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}