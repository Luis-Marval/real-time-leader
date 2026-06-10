import { Module, Global } from '@nestjs/common';
import { GlideClient } from '@valkey/valkey-glide';
import { appConfig } from '../constants';
@Global()
@Module({
  providers: [
    {
      provide: 'VALKEY_CLIENT',
      useFactory: async () => {
        // Configura el cliente en modo Standalone (o GlideClusterClient si usas Cluster)
        return await GlideClient.createClient({
          addresses: [
            { host: appConfig.valkeyHost, port: appConfig.valkeyPORT },
          ],
          credentials: {
            password: appConfig.ValkeyPass,
          },
        });
      },
    },
  ],
  exports: ['VALKEY_CLIENT'],
})
export class ValkeyModule {}
