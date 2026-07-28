"use client";

interface PrintInvoiceProps {
  order: any;
  customer?: any;
}

export default function PrintInvoice({ order, customer }: PrintInvoiceProps) {
  if (!order) return null;

  const items = order.items || [];
  const subtotal = items.reduce((sum: number, i: any) => sum + (Number(i.price) || 0) * (i.quantity || i.qty || 1), 0) || order.total || 0;
  const shippingFee = subtotal >= 500 ? 0 : subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shippingFee;
  const taxAmount = (subtotal * 0.18) / 1.18; // 18% GST inclusive calculation
  const taxableValue = subtotal - taxAmount;

  const address = order.shippingAddress || {};

  return (
    <div className="print-only printable-invoice-container p-8 bg-white text-black font-sans leading-relaxed">
      {/* ── TOP BRAND HEADER & TAX INVOICE BADGE ── */}
      <div className="border-b-4 border-black pb-6 mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-black text-white font-mono text-2xl font-bold px-3 py-1">TD</span>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase font-display-xl">THE DROP</h1>
              <p className="text-[10px] tracking-widest uppercase font-bold opacity-70">MODA ARCHIVE LUXURY INC.</p>
            </div>
          </div>
          <p className="text-[11px] opacity-70 mt-3 max-w-sm font-medium">
            100 Corporate Plaza, Level 45, Financial District, Mumbai, Maharashtra 400051<br />
            GSTIN: <span className="font-mono font-bold">27AAACD9823P1Z0</span> | CIN: U74999MH2024PTC384920
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-2">
            TAX INVOICE / BILL OF SUPPLY
          </span>
          <p className="text-xs font-mono font-bold">INVOICE NO: INV-{order.id}</p>
          <p className="text-xs font-medium">ORDER REF: {order.orderNumber || order.id}</p>
          <p className="text-xs font-medium">DATE: {order.date || order.createdAt || "JUL 25, 2025"}</p>
          <p className="text-xs font-medium text-emerald-800 font-bold mt-1">PAYMENT: PAID & VERIFIED</p>
        </div>
      </div>

      {/* ── SUPPLIER & BUYER INFORMATION GRID ── */}
      <div className="grid grid-cols-2 gap-8 border-2 border-black p-4 bg-gray-50 mb-6 text-xs">
        {/* Supplier / Seller */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">
            SOLD BY / SUPPLIER DETAILS
          </h3>
          <p className="font-bold">THE DROP APPAREL ONLINE STORE</p>
          <p>Central Logistics Vault, Level 2</p>
          <p>Express Dispatch Hub, Ahmedabad, Gujarat 382350</p>
          <p className="mt-1">Support Phone: +91 99999 99999</p>
          <p>Email: concierge@thedrop.com</p>
        </div>

        {/* Billed To / Shipping Address */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">
            BILLED & SHIPPED TO
          </h3>
          <p className="font-bold text-sm uppercase">
            {address.firstName || customer?.name || "VIP Customer"} {address.lastName || ""}
          </p>
          <p className="opacity-90">{address.line1 || "A-701 Brown stone, M.G. Road"}</p>
          {address.line2 && <p className="opacity-90">{address.line2}</p>}
          <p className="opacity-90">
            {address.city || "Ahmedabad"}, {address.state || "Gujarat"} - {address.zip || "382350"}
          </p>
          <p className="opacity-90">{address.country || "India"}</p>
          {address.phone && <p className="font-mono font-bold mt-1">MOBILE: {address.phone}</p>}
        </div>
      </div>

      {/* ── ITEMIZED PRODUCTS TABLE ── */}
      <div className="mb-6">
        <table className="w-full text-left border-collapse border-2 border-black text-xs">
          <thead>
            <tr className="bg-black text-white font-bold uppercase text-[11px] tracking-wider">
              <th className="p-3 border-r border-gray-700">#</th>
              <th className="p-3 border-r border-gray-700">ITEM DESCRIPTION / SPECIFICATION</th>
              <th className="p-3 border-r border-gray-700 text-center">SIZE</th>
              <th className="p-3 border-r border-gray-700 text-center">QTY</th>
              <th className="p-3 border-r border-gray-700 text-right">UNIT PRICE</th>
              <th className="p-3 text-right">AMOUNT ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black font-medium">
            {items.map((item: any, idx: number) => {
              const qty = item.quantity || item.qty || 1;
              const unitPrice = Number(item.price) || 0;
              const lineTotal = unitPrice * qty;
              return (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="p-3 border-r border-black font-mono text-center">{idx + 1}</td>
                  <td className="p-3 border-r border-black font-bold uppercase">
                    {item.title}
                    <span className="block text-[10px] font-normal text-gray-600">COLOR: {item.color || "BLACK"}</span>
                  </td>
                  <td className="p-3 border-r border-black text-center font-mono font-bold">{item.size || "L"}</td>
                  <td className="p-3 border-r border-black text-center font-bold">{qty}</td>
                  <td className="p-3 border-r border-black text-right font-mono">${unitPrice.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-bold">${lineTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── FINANCIAL CALCULATIONS & TOTALS ── */}
      <div className="flex justify-between items-start gap-8 mb-8 text-xs">
        {/* Payment & Terms Note */}
        <div className="w-1/2 space-y-3">
          <div className="border border-black p-3 bg-gray-50">
            <h4 className="font-bold text-[11px] uppercase tracking-wider mb-1">TERMS & RETURNS POLICY</h4>
            <p className="text-[10px] text-gray-700 leading-tight">
              All luxury drop items carry a 7-day archive authenticity guarantee. Returns are accepted within 7 days of delivery in original sealed vault packaging with security tags intact.
            </p>
          </div>

          <div className="border border-black p-3 bg-gray-50">
            <h4 className="font-bold text-[11px] uppercase tracking-wider mb-1">GST & TAX BREAKDOWN (INCLUDED)</h4>
            <div className="flex justify-between text-[10px]">
              <span>Taxable Goods Value:</span>
              <span className="font-mono">${taxableValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Integrated GST (IGST @ 18%):</span>
              <span className="font-mono">${taxAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="w-1/2 border-2 border-black p-4 bg-gray-50 space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Items Subtotal:</span>
            <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Express Courier Shipping:</span>
            <span className="font-mono font-bold">{shippingFee === 0 ? "FREE ($0.00)" : `$${shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-xs font-bold pt-2 border-t-2 border-black">
            <span>GRAND TOTAL INCL. TAXES:</span>
            <span className="font-mono text-base font-black text-black">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ── AUTHENTICITY STAMP & SIGNATURE ── */}
      <div className="border-t-2 border-black pt-6 flex justify-between items-end text-xs">
        <div className="flex items-center gap-4">
          {/* Circular Stamp Icon */}
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-red-700 text-red-700 flex flex-col items-center justify-center p-1 text-[8px] font-bold uppercase text-center leading-none tracking-tighter transform -rotate-12">
            <span>THE DROP</span>
            <span className="my-0.5 text-[7px] font-mono">VERIFIED</span>
            <span>AUTHENTIC</span>
          </div>
          <div>
            <p className="font-bold text-xs uppercase">OFFICIAL ARCHIVE DOCUMENTATION</p>
            <p className="text-[10px] text-gray-500">Computer generated invoice under Section 31 of CGST Act. No signature required.</p>
          </div>
        </div>

        <div className="text-right border-t border-black pt-2 w-48">
          <p className="font-bold text-xs uppercase">AUTHORISED SIGNATORY</p>
          <p className="text-[10px] text-gray-500">MODA Archive Inc. Logistics Team</p>
        </div>
      </div>
    </div>
  );
}
