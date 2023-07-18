import { Request, Response, NextFunction } from 'express';
import multer, {diskStorage} from 'multer';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import { MiddlewareInterface } from '../../types/middleware.interface';

export default class UploadFileMiddleware implements MiddlewareInterface {

  constructor(
    private uploadFileDirectory: string,
    private fieldName: string
  ) {}

  public execute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const storage = diskStorage({
      destination: this.uploadFileDirectory,
      filename: (_req, file, callback) => {
        const extention = mime.extension(file.mimetype);
        const fileName = nanoid();
        console.log(extention);
        console.log(fileName);
        callback(null, `${fileName}.${extention}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage}).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);

  };
}
