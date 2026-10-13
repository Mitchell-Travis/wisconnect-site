import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./member-access.module.css";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "placeholder"> & {
  id: string;
  label: string;
  control?: ReactNode;
  children?: ReactNode;
};

export default function AccountField({ id, label, control, children, ...input }: Props) {
  return <div className={styles.loginField}>
    <div className={`${styles.floatingControl} ${control ? styles.passwordControl : ""}`}>
      <input {...input} id={id} placeholder=" "/>
      <label htmlFor={id}>{label}</label>
      {control}
    </div>
    {children}
  </div>;
}
