/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
import * as React from "react";
import { Image, tokens, makeStyles } from "@fluentui/react-components";
import { useEffect } from "react";

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

const useStyles = makeStyles({
  welcome__header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "10px",
    paddingTop: "50px",
    backgroundColor: tokens.colorNeutralBackground3,
  },
  message: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightRegular,
    fontColor: tokens.colorNeutralBackgroundStatic,
  },
});

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title, logo, message } = props;
  const styles = useStyles();

  useEffect(() => {
    const resizeObserverErr = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        console.error("ResizeObserver loop error in Header");
        e.stopImmediatePropagation();
        e.stopPropagation();
      }
    };
    window.addEventListener("error", resizeObserverErr);
    return () => {
      window.removeEventListener("error", resizeObserverErr);
    };
  }, []);

  return (
    <section className={styles.welcome__header}>
      <Image width="90" height="90" src={logo} alt={title} />
      <h1 className={styles.message}>{message}</h1>
    </section>
  );
};

export default Header;
