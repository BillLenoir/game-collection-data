export async function fetchData(path: string, paramater: string | number) {

  const requestUrl = `https://boardgamegeek.com/xmlapi/${path}/${paramater}`;

  let response;
  try {
    response = await fetch(requestUrl);
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      `An error occurred during the fetch: ${error}`,
    );
    // Handle the error as needed
  }

  if (typeof response !== 'undefined') {
    //    console.log(`Done fetching ${paramater}, => ${response.body}`);
    let rawResponse;
    try {
      rawResponse = await response.text();
    } catch (error) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `An error occurred with the response: ${error}`,
      );
    }
    return rawResponse;
  } else {
    throw new Error('Did not receive a response.');
  }
}
