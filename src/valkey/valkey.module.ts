import { Module, Global } from '@nestjs/common';
import { GlideClient } from '@valkey/valkey-glide';

@Global()
@Module({
  providers: [
    {
      provide: 'VALKEY_CLIENT',
      useFactory: async () => {
        // Configura el cliente en modo Standalone (o GlideClusterClient si usas Cluster)
        return await GlideClient.createClient({
          addresses: [{ host: 'caching', port: 6379 }],
          requestTimeout: 1000, // Opcional: Tiempo de espera en ms
        });
      },
    },
  ],
  exports: ['VALKEY_CLIENT'],
})
export class ValkeyModule {}
