// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  category: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body);
  const cat: any = await fetch("https://hack-o-octo--adityaberry.repl.co/api/get_tag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "description": req.body.description })
  }).then((res) => res.json());
  console.log(cat);
  res.status(200).json(cat.lable)
}
