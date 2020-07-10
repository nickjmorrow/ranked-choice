import { ConnectionOptions } from 'typeorm';

const ormconfig: ConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    // We are using migrations, synchronize should be set to false.
    synchronize: false,
    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: true,
    logging: true,
    logger: 'file',
    cli: {
        // Location of migration should be inside src folder
        // to be compiled into dist/ folder.
        migrationsDir: 'src/migrations',
    },
};

export = ormconfig;
