import type { ReactNode } from "react";
import * as s from "./Block.css";

type BlockProps = {
  title: string;
  danger?: boolean;
  children: ReactNode;
};
const Block = ({ title, danger, children }: BlockProps) => {
  return (
    <section className={s.block}>
      <h2 className={danger ? `${s.blockTitle} ${s.danger}` : s.blockTitle}>
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Block;
