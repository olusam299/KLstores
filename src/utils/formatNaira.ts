export const formatNaira = (amount: number) =>
  `₦${Number(amount).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
