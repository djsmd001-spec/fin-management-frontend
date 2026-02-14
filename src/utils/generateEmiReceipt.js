import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateEmiReceipt = (data) => {
  const doc = new jsPDF();

  const primary = [17, 24, 39];
  const accent = [212, 175, 55];

  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("EMI PAYMENT RECEIPT", 105, 18, { align: "center" });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  doc.text(`Receipt No: ${data.receiptNo}`, 14, 40);
  doc.text(`Date: ${data.date}`, 150, 40);
  doc.text(`Transaction ID: ${data.transactionId}`, 14, 48);

  doc.setDrawColor(...accent);
  doc.line(14, 55, 196, 55);

  doc.setFontSize(14);
  doc.text("Customer Details", 14, 65);

  doc.setFontSize(12);
  doc.text(`Name: ${data.name}`, 14, 75);
  doc.text(`Email: ${data.email}`, 14, 83);
  doc.text(`Loan ID: ${data.loanId}`, 14, 91);
  doc.text(`EMI No: ${data.emiNo}`, 14, 99);

  autoTable(doc, {
    startY: 110,
    head: [["Description", "Amount (₹)"]],
    body: [
      ["EMI Amount", data.emiAmount],
      ["Penalty", data.lateFee],
      ["Total Paid", data.total],
    ],
    theme: "grid",
    headStyles: { fillColor: primary },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.text(`Payment Mode: ${data.paymentMode}`, 14, finalY);

  doc.setTextColor(0, 128, 0);
  doc.text("Status: SUCCESSFUL", 14, finalY + 8);

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(14);
  doc.text("Thank You For Your Payment!", 105, finalY + 25, {
    align: "center"
  });

  doc.save(`EMI_Receipt_${data.receiptNo}.pdf`);
};
