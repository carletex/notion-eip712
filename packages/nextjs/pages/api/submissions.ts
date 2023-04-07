// pages/api/submissions.ts
import { Client } from "@notionhq/client";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { EIP_712_DOMAIN, EIP_712_TYPES } from "~~/eip712";

// Get your Notion secret integration key on https://www.notion.so/my-integrations
// More info about integrations: https://developers.notion.com/docs/create-a-notion-integration
const notion = new Client({ auth: process.env.NOTION_SECRET_INTEGRATION_TOKEN });
// Get your database ID from the notion page(database) and connect your integration to it
// https://developers.notion.com/docs/create-a-notion-integration#step-3-save-the-database-id
const databaseId = process.env.NOTION_DATABASE_ID ?? "";

/**
 * Returns the address that signed the EIP-712 value for the domain
 * and types to produce the signature.
 */
const recoverSignerAddress = (signature: string, values: any) => {
  return ethers.utils.verifyTypedData(EIP_712_DOMAIN, EIP_712_TYPES, values, signature);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.error("Not a POST request");
    res.status(400).json({ message: "Not a POST request" });
  }

  const { signature, values, from } = req.body;
  const recoveredAddress = recoverSignerAddress(signature, { ...values, from });

  if (recoveredAddress !== from) {
    console.error("recoveredAddress error", recoveredAddress, from);
    res.status(401).json({ message: "Invalid signature" });
  }

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      name: { title: [{ type: "text", text: { content: values.name } }] },
      message: { rich_text: [{ type: "text", text: { content: values.message } }] },
      url: { url: values.url },
      signerAddress: { rich_text: [{ type: "text", text: { content: recoveredAddress } }] },
      date: { date: { start: new Date().toISOString() } },
    },
  });

  res.status(200).json({ message: "Submission successfully saved" });
}
