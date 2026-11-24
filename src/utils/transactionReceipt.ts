// utils/transactionReceipt.ts
type ReceiptData = {
  id?: string
  name: string
  amount: number
  status: string
  typeLabel: string
  statusLabel: string
  createdAt?: string | Date
  paymentMethod?: string
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(n)

const formatDate = (d?: string | Date) => {
  if (!d) return "-"
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  SUCCESS: { bg: "#E6F9EE", text: "#16A34A" },
  PENDING: { bg: "#FFF4E5", text: "#EA7A00" },
  PROCESS: { bg: "#E8F1FF", text: "#2563EB" },
  CHALLENGE: { bg: "#E8F1FF", text: "#2563EB" }
}
const DEFAULT_STATUS = { bg: "#FEE9E9", text: "#DC2626" } // gagal/batal/expired

export function buildReceiptHtml(data: ReceiptData) {
  const color = STATUS_COLORS[data.status] ?? DEFAULT_STATUS
  const paymentMethod = data.paymentMethod?.replace(/_/g, " ")

  const row = (label: string, value: string) => `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${escapeHtml(value)}</td>
    </tr>`

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page { margin: 0; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { height: auto; }
      body {
        font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
        background: #F3F4F6;
        padding: 12px;
        color: #111827;
      }
      .card {
        width: 100%;
        background: #fff;
        border-radius: 24px;
        overflow: hidden;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .header {
        background: #FF6B00;
        color: #fff;
        padding: 34px 30px;
        text-align: center;
      }
      .header .brand { font-size: 24px; letter-spacing: 4px; opacity: .95; text-transform: uppercase; font-weight: 700; }
      .header h1 { font-size: 40px; margin-top: 6px; }
      .amount-block { text-align: center; padding: 26px 30px 4px; }
      .amount-block .caption { font-size: 20px; color: #6B7280; text-transform: uppercase; letter-spacing: 2px; }
      .amount-block .amount { font-size: 62px; font-weight: 800; margin: 4px 0 12px; line-height: 1.15; }
      .badge {
        display: inline-block;
        padding: 12px 26px;
        border-radius: 999px;
        font-size: 20px;
        font-weight: 700;
        background: ${color.bg};
        color: ${color.text};
      }
      .divider {
        border-top: 3px dashed #E5E7EB;
        margin: 18px 30px;
      }
      .section { padding: 12px 30px; }
      .section-title {
        font-size: 18px; font-weight: 700; color: #9CA3AF;
        text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;
      }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 12px 0; font-size: 24px; vertical-align: top; }
      td.label { color: #6B7280; width: 42%; }
      td.value { text-align: right; font-weight: 600; word-break: break-word; }
      .total-row td { padding-top: 14px; font-size: 28px; font-weight: 800; border-top: 2px solid #F3F4F6; }
      .total-row td.value { color: #FF6B00; }
      .footer {
        text-align: center; font-size: 20px; color: #9CA3AF;
        margin: 10px 30px 0; padding: 14px 0 20px;
        border-top: 2px solid #F3F4F6;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="brand">SMARTGYM</div>
        <h1>Bukti Transaksi</h1>
      </div>

      <div class="amount-block">
        <div class="caption">Total Pembayaran</div>
        <div class="amount">${formatRupiah(data.amount)}</div>
        <span class="badge">${escapeHtml(data.statusLabel)}</span>
      </div>

      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Detail Transaksi</div>
        <table>
          ${data.id ? row("ID Transaksi", data.id) : ""}
          ${row("Tanggal", formatDate(data.createdAt))}
          ${row("Jenis", data.typeLabel)}
          ${row("Item", data.name)}
          ${paymentMethod ? row("Metode Bayar", paymentMethod) : ""}
        </table>
      </div>

      <div class="divider"></div>

      <div class="section">
        <div class="section-title">Rincian Pembayaran</div>
        <table>
          ${row("Subtotal", formatRupiah(data.amount))}
          <tr class="total-row">
            <td class="label" style="color:#111827">Total</td>
            <td class="value">${formatRupiah(data.amount)}</td>
          </tr>
        </table>
      </div>

      <div class="footer">
        Terima kasih telah bertransaksi di SMARTGYM.<br />
        Dokumen ini dibuat otomatis dan sah sebagai bukti pembayaran.
      </div>
    </div>
  </body>
</html>`
}
