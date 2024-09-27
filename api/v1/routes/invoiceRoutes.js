import express from'express';
import { getInvoices } from '../controllers/invoiceController.js';

const invoiceRouter = express.Router();


invoiceRouter.get('/properties/:propertyId/invoices', getInvoices);

export default invoiceRouter;