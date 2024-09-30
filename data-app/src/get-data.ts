import fs from 'fs';
import { dataConfigs } from './utils/data.config';
import { GetCollectionDataResponse } from './utils/data.types';
import { fetchData } from './utils/fetch-data';

export async function getCollectionData(username: string): Promise<GetCollectionDataResponse> {
  let getDataSuccessful = true;
  let message = '';
  let response: string;

  try {
    response = await fetchData('collection', username);

    if (response === undefined) {
      throw new Error('There was no response from BGG');
    }

    if (response.includes(
      'Your request for this collection has been accepted and will be processed',
    ) === true) {
      throw new Error(
        'Your request for this collection has been accepted and will be processed.  Please try again later for access.',
      );
    }
  } catch (error) {
    getDataSuccessful = false;
    message = error;
  }

  const dataDirectory = dataConfigs.localData.dataDirectory;
  const rawResponseFile = dataConfigs.localData.rawResponseFile;

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  fs.writeFile(rawResponseFile, response, (error) => {
    if (error) {
      getDataSuccessful = false;
      message = `${error}`;
    }
  });

  message = 'I wrote the raw response XML file for the collection data!';
  return {
    response,
    getDataSuccessful,
    message,
  };
}
