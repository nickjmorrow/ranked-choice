import { ConnectionOptions } from 'typeorm';

const getOrmConfig = (): ConnectionOptions => {
    const commonOptions = {
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // We are using migrations, synchronize should be set to false.
        synchronize: false,
        type: 'postgres' as const,
        // Run migrations automatically,
        // you can disable this if you prefer running migration manually.
        migrationsRun: true,
        logging: true,
        logger: 'file' as const,
        cli: {
            // Location of migration should be inside src folder
            // to be compiled into dist/ folder.
            migrationsDir: 'src/migrations',
        },
    };
    if (process.env.DATABASE_URL !== undefined) {
        return {
            url: process.env.DATABASE_URL,
            ...commonOptions,
        };
    }
};

const ormConfig = getOrmConfig();

export = ormConfig;
