import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../types/middleware.interface';
import multer from 'multer';
import mime from 'mime-types';
import { nanoid } from 'nanoid';

export default class FormDataParserMiddleware implements MiddlewareInterface {
  constructor(
    private readonly filesFieldName: string,
    private readonly maxCountElements: number,
    private readonly uploadDirName: string,
  ) {}

  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    console.log('first middleware', req.files);
    const userId = req.user.id;

    const storage = multer.diskStorage({
      destination: `./${this.uploadDirName}/${userId}`,
      filename: (_req, file, callback) => {
        const extention = mime.extension(file.mimetype);
        const fileName = nanoid();
        callback(null, `${fileName}.${extention}`);
      }
    });

    const uploadFormMiddleware = multer({storage, limits: {files: this.maxCountElements}}).array(this.filesFieldName);

    uploadFormMiddleware(req, res, next);
  };
}
