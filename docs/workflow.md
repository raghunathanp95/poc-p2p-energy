# Workflow

## Grid Services

The **Grid** is the central component for processing data, it is connected to by **Producers** and **Consumers**.

It is implemented as a REST API and the routes it provides can be seen in [../standalone/grid/src/index.ts](../standalone/grid/src/index.ts)

When the **Grid** REST API starts it registers the following services:

* registration-storage - The service which stores registration details and can use either:
    * [LocalFileStorageService](../common/src/services/storage/localFileStorageService.ts) - Store the registration details in the local file system
    * [AmazonS3RegistrationService](../common/src/services/amazon/amazonS3RegistrationService.ts) - Store the registration details in an Amazon Dynamo DB

* grid-storage-manager-state - The service which stores the current state of the grid component in either:
    * [LocalFileStorageService](../common/src/services/storage/localFileStorageService.ts) - Store the grid state in the local file system
    * [AmazonS3StorageService](../common/src/services/amazon/amazonS3StorageService.ts) - Store the grid state in an Amazon S3 Bucket

* wallet-state - The service which stores the current grid wallet state in etiher:
    * [LocalFileStorageService](../common/src/services/storage/localFileStorageService.ts) - Store the wallet state in the local file system
    * [AmazonS3StorageService](../common/src/services/amazon/amazonS3StorageService.ts) - Store the wallet state in Amazon S3 bucket

* wallet - The service which processes wallet transactions
    * [BasicWalletService](../common/src/services/wallet/basicWalletService.ts) - Basic wallet handling which just increments the address index on each transfer

* registration-management - [RegistrationManagementService](../common/src/services/registrationManagementService.ts) the `/registration` endpoints and stores the information using the **registration-storage** service. Is also polled from a scheduler to see if there are any new commands on the registered MAM channels.

* grid - The [GridManager](../common/src/services/gridManager.ts) logic which handles the commands from the **Producers** and **Consumers**. Uses a [BasicGridStrategy](../common/src/strategies/basicGridStrategy.ts) to determine how to process data.

* storage - Handles the functionality for the `/service/` endpoints, either:
    * [LocalFileStorageService](../common/src/services/storage/localFileStorageService.ts) - Use local file system for storage
    * [AmazonS3StorageService](../common/src/services/amazon/amazonS3StorageService.ts) - Use Amazon S3 for storage

* grid-producer-output-store - Stores a cached version of the **Producers** output read from the MAM channel for processing, either:
    * [LocalFileStorageService](../common/src/services/storage/localFileStorageService.ts) - Stores in Local file system
    * [ProducerOutputStoreService](../common/src/services/db/producerOutputStoreService.ts) - Stores in Amazon Dynamo DB

* grid-consumer-usage-store- Stores a cached version of the **Consumers** output read from the MAM channel for processing, either:
    * [LocalFileStorageService](../common/src/services/storage/localFileStorageService.ts) - Stores in Local file system
    * [ConsumerUsageStoreService](../common/src/services/db/consumerUsageStoreService.ts) - Stores in Amazon Dynamo DB

## Grid Logic

The `/registration` endpoints accept MAM channel details from the **Producers** and **Consumers** through the **registration-management** service. This information is then stored using the **registration-storage** service.

The **registration-management** service polls at regular intervals to see if there are any more commands from the **Producer/Consumer** MAM channels. Any new messages are handed to the **grid** service, which stores them using the **grid-producer-output-store** and **grid-consumer-usage-store**.

The **grid** service also polls at regular intervals to update its strategies. The strategies determine for each registered entity how its data should be processed i.e. how often an entity get paid or has payment requested etc. The strategies return a list of new command to send on the MAM channels back to the specific entity.

