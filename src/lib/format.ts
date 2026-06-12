// Helpers format tiền/ngày dùng chung.
// Backend trả tiền dạng string DECIMAL (vd "10.5000") — parse cẩn thận, không dùng float cho logic.

export function formatVND(value: string | number): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) return "0 ₫";
  return n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";
}

/** Tính tổng tiền đơn: rate là giá trên 1000 đơn vị */
export function calcCharge(ratePer1000: string, quantity: number): number {
  const rate = Number.parseFloat(ratePer1000);
  if (Number.isNaN(rate)) return 0;
  return (rate * quantity) / 1000;
}

export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
