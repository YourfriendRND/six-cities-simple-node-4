import TSVFileReader from '../file-reader/tsv-file-reader.js';
import OfferService from '../../modules/offer/offer.service.js';
import UserService from '../../modules/user/user.service.js';
import ConsoleLoggerService from '../logger/console.service.js';
import DataBaseClientService from '../database-client/database-client.service.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import { UserModel } from '../../modules/user/user.entity.js';
import { convertFileLineToOffer, getDataBaseUri } from '../helpers/index.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface';
import { UserServiceInterface } from '../../modules/user/user-service.interface';
import { DataBaseClientInterface } from '../database-client/database-client.interface';
import { LoggerInterface } from '../logger/logger.interface';
import { CliCommandInterface } from './cli-command.interface';
import { Offer } from '../../types/offer.type';

const DEFAULT_DB_PORT = '27017';
const DEFAULT_USER_PASSWORD = '000111';

export default class ImportCommand implements CliCommandInterface {
  public name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private databaseClient!: DataBaseClientInterface;
  private logger!: LoggerInterface;
  private salt!: string;

  constructor() {
    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseClient = new DataBaseClientService(this.logger);
  }

  private saveOffer = async (offer: Offer): Promise<void> => {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD,
    }, this.salt);

    await this.offerService.create({
      ...offer,
      authorId: user.id,
    });
  };

  private onLine = async (line: string, resolve: () => void): Promise<void> => {
    const offer = convertFileLineToOffer(line);
    await this.saveOffer(offer);
    resolve();
  };

  private onComplete = (lineCount: number) => {
    this.logger.info(`${lineCount} rows has been imported`);
    this.databaseClient.disconnect();
  };

  public execute = async (fileName: string, login: string, password: string, host: string, databaseName: string, salt: string): Promise<void> => {
    const uriConnection = getDataBaseUri(
      login,
      password,
      host,
      DEFAULT_DB_PORT,
      databaseName
    );
    this.salt = salt;

    await this.databaseClient.connect(uriConnection);

    const reader = new TSVFileReader(fileName.trim());

    reader.on('line', this.onLine);

    reader.on('end', this.onComplete);

    try {
      reader.read();
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      this.logger.error(`Failed to import data from file ${fileName}, due to: ${err.message}`);
    }
  };
}
