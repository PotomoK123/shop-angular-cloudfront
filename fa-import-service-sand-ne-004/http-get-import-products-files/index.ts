import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import * as dotenv from 'dotenv';

dotenv.config();

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const blobName = req.query.name;

  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey,
  );

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential,
  );

  const containerName = 'uploaded'; // Replace with your container name
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const blobSAS = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('rw'), // Read and write permissions
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400), // 1 day later
    },
    sharedKeyCredential,
  ).toString();

  const sasUrl = blobClient.url + '?' + blobSAS;

  context.res = {
    body: { url: sasUrl },
  };
};

export default httpTrigger;
