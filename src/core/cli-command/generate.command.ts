import got from 'got';
import chalk from 'chalk';
import { appendFile } from 'node:fs/promises';
import { MockOffer } from '../../types/mock.type';
import { CliCommandInterface } from './cli-command.interface';
import OfferGenerator from '../../modules/offer-generator/offer-generator.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockOffer;

  public execute = async (...params: string[]): Promise<void> => {
    const [count, filepath, url] = params;
    const offerCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.log(chalk.red(`Failed to get data to generate at: ${url}.`));
    }

    if (!offerCount || offerCount < 0) {
      console.error(chalk.red(`
        Specified amount of generated data ${count} is incorrect.
        The count parameter must be number and greater than 0`
      ));
      return;
    }

    const offerGenerator = new OfferGenerator(this.initialData);

    for (let i = 0; i < offerCount; i++) {
      await appendFile(filepath, `${offerGenerator.generate()}\n`, 'utf8');
    }

    console.log(`File ${filepath} has been created! Generated ${offerCount} rows`);
  };
}
