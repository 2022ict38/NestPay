export const seedTenants = [
  { id: "t1", name: "Kasun Perera", room: "R1", phone: "0771234567", rent: 15000, status: "Paid" },
  { id: "t2", name: "Nimal Silva",  room: "R2", phone: "0712345678", rent: 12000, status: "Pending" },
  // තව 8–10ක් දාන්න
];

export const seedPayments = [
  { id: "p1", tenantId: "t1", type: "Rent",        amount: 15000, month: "2026-10", date: "2026-10-03" },
  { id: "p2", tenantId: "t1", type: "Electricity", amount: 2300,  month: "2026-10", date: "2026-10-05" },
  { id: "p3", tenantId: "t2", type: "Water",       amount: 800,   month: "2026-10", date: "2026-10-06" },
  // තව 20ක් විතර දාන්න
];