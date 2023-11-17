import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface';
import multer from 'multer';

export default class FormDataMiddleware implements MiddlewareInterface {
  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const uploadForm = multer().single('previewImage');

    uploadForm(req, res, next);
  };
}
