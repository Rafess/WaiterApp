import {Request, Response } from "express";
import { Category } from "../../models/Category";

export async function createCategories(req:Request, res:Response) {
  try {
    const { icon, name } = req.body;
    await Category.create({
      name,icon
    });
    res.send(name);
  }
  catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
}
