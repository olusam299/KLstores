import { ReactNode } from "react";
import { LEGAL_LAST_UPDATED } from "../config/store";

export const LegalSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="mt-8">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    <div className="space-y-3 text-gray-800 leading-relaxed">{children}</div>
  </section>
);

const LegalPage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="max-w-3xl mx-auto pt-20 pb-24 px-5 max-[400px]:px-3">
    <h1 className="text-4xl font-light max-sm:text-3xl">{title}</h1>
    <p className="mt-2 text-sm text-gray-500">Last updated: {LEGAL_LAST_UPDATED}</p>
    {children}
  </div>
);

export default LegalPage;
