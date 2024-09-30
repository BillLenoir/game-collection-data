import { formatCollectionData } from './format-data';
import { getCollectionData } from './get-data';
import { dataConfigs } from './utils/data.config';
import { FormatCollectionDataResponse, GetCollectionDataResponse } from './utils/data.types';

const bggCollectionData: GetCollectionDataResponse = await getCollectionData(dataConfigs.bggUser);

if (!bggCollectionData.getDataSuccessful) {
  console.error('\x1b[31m%s\x1b[0m', bggCollectionData.message);
  console.log(bggCollectionData.response.substring(0, 100));
} else {
  const formatttedCollectionData: FormatCollectionDataResponse = await formatCollectionData(bggCollectionData.response);
  if (!formatttedCollectionData.formatDataSuccessful) {
    console.error('\x1b[31m%s\x1b[0m', formatttedCollectionData.message);
  } else {
    console.log(
      '\x1b[32m%s\x1b[0m',
      'Looking good so far!',
    );
  }
}
