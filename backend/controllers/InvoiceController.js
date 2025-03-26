import puppeteer from "puppeteer";
import Membership from "../models/MembershipSchema.js"
import User from "../models/UserSchema.js"
import Gym from "../models/GymSchema.js"
import { generateInvoiceHTML } from "../views/invoiceTemplate.js";

export const generateInvoice = async (req, res) => {
  try {
    const { membershipId } = req.params;
    
    const membership = await Membership.findById(membershipId)
      .populate("user", "name")  
      .populate("gym", "name address");

    if (!membership) {
      return res.status(404).json({ success: false, message: "Membership not found" });
    }

    const { user, gym } = membership;

    const htmlContent = generateInvoiceHTML(user, gym, membership);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=Invoice_${membershipId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ success: false, message: "Failed to generate invoice" });
  }
};
