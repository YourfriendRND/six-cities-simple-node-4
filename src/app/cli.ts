import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CliCommandInterface } from '../core/cli-command/cli-command.interface';

type ParsedCommand = Record<string, string[]>;

export default class CliCommandManager {
  private commands: {[commandName: string]: CliCommandInterface} = {};
  private defaultCommand = '--help';
  private filename = fileURLToPath(import.meta.url);
  private dirname = path.dirname(this.filename);
  private commandDirPath = path.resolve(this.dirname, '..', 'core', 'cli-command');

  public parseCommandFiles = async (): Promise<CliCommandInterface[]> => {
    const commandFiles = fs.readdirSync(this.commandDirPath)
      .filter((file) => (file.includes('.command.ts') || file.includes('.command.js')) && !file.includes('.js.map'));
    const commandInstances: CliCommandInterface[] = await Promise.all(commandFiles.map(async (file) => {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const module = await import(`../core/cli-command/${file}`);
      return new module.default();
    }));
    return commandInstances;
  };

  public registerCommands = async (commandList: CliCommandInterface[]): Promise<void> => {
    commandList.reduce((savedList, commandItem) => {
      savedList[commandItem.name] = commandItem;
      return savedList;
    }, this.commands);
  };

  private parseCommand = (cliArguments: string[]): ParsedCommand => {
    let command = '';
    return cliArguments.reduce((parsedCommands: ParsedCommand, item: string) => {
      if (item.startsWith('--')) {
        parsedCommands[item] = [];
        command = item;
      } else if (command && item) {
        parsedCommands[command].push(item);
      }
      return parsedCommands;
    }, {});
  };

  public getCommand = (commandName: string): CliCommandInterface => this.commands[commandName] ?? this.commands[this.defaultCommand];

  public processedCommand = (argv: string[]): void => {
    const parsedCommand = this.parseCommand(argv);
    const [ commandName ] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  };
}
