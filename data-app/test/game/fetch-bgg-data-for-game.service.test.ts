import { fetchBggDataForGame } from "../../src/game/fetch-bgg-data-for-game.service";
import type { bggApiClientInput } from "../../src/utils/data.types";
import * as logger from "../../src/utils/log-messages";
import { runStepFunction } from "../../src/utils/run-step-function";

const mockFetch = jest.fn();
global.fetch = mockFetch;

let spyLogMessage: jest.SpiedFunction<typeof logger.logMessage>;

const fetchGameDataFromBggInput: bggApiClientInput = {
  parameters: "game-1",
};

export const validGameXML: string =
  '<boardgames termsofuse="https://boardgamegeek.com/xmlapi/termsofuse"> <boardgame objectid="269546"> <yearpublished>2017</yearpublished> <minplayers>2</minplayers> <maxplayers>2</maxplayers> <playingtime>240</playingtime> <minplaytime>240</minplaytime> <maxplaytime>240</maxplaytime> <age>16</age> <name primary="true" sortindex="1">¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933</name> <description>Apuren el Corralito! is a two player print and play, free game depicting the climactic battle of 2nd Alihuat&amp;aacute; (Dec. 1933), during the Chaco War between Paraguay and Bolivia (1932-35), which ended with the surrender of the bulk of the Bolivian army in a clearing of the &amp;ldquo;chaco&amp;rdquo; bush known as Campo V&amp;iacute;a, and resulted in the first truce in the war.&lt;br/&gt;&lt;br/&gt;The game is a Battalion level simulation, the map depicts a 30 x 35 mile area (each hex is 1mile aprox.) and turns are 1 day each (the battle lasted for 10 days). The game includes:&lt;br/&gt;&lt;br/&gt;&lt;br/&gt; 280 two sided counters.&lt;br/&gt; Four A4 sheets map. (Or 1 x A2 map).&lt;br/&gt; One air placement auxiliary sheet.&lt;br/&gt; One rulebook with playing aides.&lt;br/&gt;&lt;br/&gt;&lt;br/&gt;Although the battle was mainly a one sided business, with the Paraguayan conducting three successive envelopments (thanks to initial Bolivian command sclerosis and lack of reserves), the Bolivian player still has a lot to do, husbanding his forces and trying to save as much as he can from the Paraguayan onslaught.&lt;br/&gt;&lt;br/&gt;On the other side, the Paraguayan player must at least accomplish what historically was done: envelope and force to surrender two, out of three, Bolivian divisions and tear down the front, forcing his opponent to abandon the battle area. And this means having the noose tightened up to the end, and sticking to a strict schedule.&lt;br/&gt;&lt;br/&gt;Being the Chaco an extensive bush country, intelligence on your enemy is a key to carrying out enveloping maneuvers. Remember that this was &amp;rdquo;MG time&amp;rdquo; and you couldn&amp;rsquo;t just walk naively into an entrenched killing ground. The game provides rules for intelligence gathering in order to simulate surprise.&lt;br/&gt;&lt;br/&gt;&amp;mdash;description from the designer&lt;br/&gt;&lt;br/&gt;</description> <thumbnail>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg</thumbnail> <image>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg</image> <boardgamepublisher objectid="4">(Self-Published)</boardgamepublisher> <boardgamefamily objectid="13252">Country: Bolivia</boardgamefamily> <boardgamefamily objectid="10650">Country: Paraguay</boardgamefamily> <boardgamemechanic objectid="2072">Dice Rolling</boardgamemechanic> <boardgamefamily objectid="81575">Digital Implementations: VASSAL</boardgamefamily> <boardgameversion objectid="439923">English/Spanish edition</boardgameversion> <boardgamedesigner objectid="115133">Pablo Martín Fernández</boardgamedesigner> <boardgamedeveloper objectid="115133">Pablo Martín Fernández</boardgamedeveloper> <boardgameartist objectid="115133">Pablo Martín Fernández</boardgameartist> <boardgamemechanic objectid="2026">Hexagon Grid</boardgamemechanic> <boardgamefamily objectid="58144">History: Chaco War</boardgamefamily> <boardgameintegration objectid="343269">Huarikasaya Kalatakaya!: The Battle of Strongest, Bolivia vs Paraguay, 19-25 May 1934</boardgameintegration> <boardgamefamily objectid="44377">Interwar period (Nov. 1918 - Aug. 1939)</boardgamefamily> <boardgamefamily objectid="59609">Misc: Free Wargames</boardgamefamily> <boardgamefamily objectid="61979">Players: Two-Player Only Games</boardgamefamily> <boardgamemechanic objectid="2070">Simulation</boardgamemechanic> <boardgamecategory objectid="1019">Wargame</boardgamecategory> <boardgamesubdomain objectid="4664">Wargames</boardgamesubdomain> <boardgameintegration objectid="343269" inbound="true">Huarikasaya Kalatakaya!: The Battle of Strongest, Bolivia vs Paraguay, 19-25 May 1934</boardgameintegration> <poll name="suggested_numplayers" title="User Suggested Number of Players" totalvotes="3"> <results numplayers="1"> <result value="Best" numvotes="0" /> <result value="Recommended" numvotes="3" /> <result value="Not Recommended" numvotes="0" /> </results> <results numplayers="2"> <result value="Best" numvotes="3" /> <result value="Recommended" numvotes="0" /> <result value="Not Recommended" numvotes="0" /> </results> <results numplayers="2+"> <result value="Best" numvotes="0" /> <result value="Recommended" numvotes="1" /> <result value="Not Recommended" numvotes="2" /> </results> </poll> <poll name="language_dependence" title="Language Dependence" totalvotes="3"> <results> <result level="1" value="No necessary in-game text" numvotes="0" /> <result level="2" value="Some necessary text - easily memorized or small crib sheet" numvotes="0" /> <result level="3" value="Moderate in-game text - needs crib sheet or paste ups" numvotes="3" /> <result level="4" value="Extensive use of text - massive conversion needed to be playable" numvotes="0" /> <result level="5" value="Unplayable in another language" numvotes="0" /> </results> </poll> <poll name="suggested_playerage" title="User Suggested Player Age" totalvotes="3"> <results> <result value="2" numvotes="0" /> <result value="3" numvotes="0" /> <result value="4" numvotes="0" /> <result value="5" numvotes="0" /> <result value="6" numvotes="0" /> <result value="8" numvotes="0" /> <result value="10" numvotes="0" /> <result value="12" numvotes="0" /> <result value="14" numvotes="0" /> <result value="16" numvotes="3" /> <result value="18" numvotes="0" /> <result value="21 and up" numvotes="0" /> </results> </poll> </boardgame></boardgames>';

beforeEach(() => {
  jest.clearAllMocks();
  spyLogMessage = jest.spyOn(logger, "logMessage");
});

describe("fetchBggDataForGame", () => {
  it("Expect OK to be true when BGG returns game data", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      text: async () => Promise.resolve(JSON.stringify(validGameXML)),
    });

    const fetchGameDataFromBggResponse = await runStepFunction<
      bggApiClientInput,
      string
    >(
      `Fetch BGG Game Data for game-1`,
      fetchBggDataForGame,
      fetchGameDataFromBggInput,
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).not.toHaveBeenCalled();
    expect(fetchGameDataFromBggResponse.ok).toBe(true);
    expect(fetchGameDataFromBggResponse.message).toBe(
      "Received a response from BGG for game ID: game-1!",
    );
  });

  it("Expect OK to be false when BGG returns data, but it does not look like game data", async () => {
    mockFetch.mockResolvedValue({
      status: 404,
      text: async () => "Page not found",
    });

    const fetchGameDataFromBggResponse = await runStepFunction<
      bggApiClientInput,
      string
    >(
      `Fetch BGG Game Data for game-1`,
      fetchBggDataForGame,
      fetchGameDataFromBggInput,
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledWith(
      "ERROR",
      "Fetch BGG Game Data for game-1 failed: BGG returned NOT ok (status: 404)",
    );
    expect(fetchGameDataFromBggResponse.ok).toBe(false);
    expect(fetchGameDataFromBggResponse.message).toBe(
      "BGG returned NOT ok (status: 404)",
    );
  });

  it("Expect OK to be false when BGG returns a status >= 300", async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      text: async () => "This is not game data",
    });

    const fetchGameDataFromBggResponse = await runStepFunction<
      bggApiClientInput,
      string
    >(
      `Fetch BGG Game Data for game-1`,
      fetchBggDataForGame,
      fetchGameDataFromBggInput,
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledWith(
      "ERROR",
      "Fetch BGG Game Data for game-1 failed: Received unexpected response from BGG for game ID: game-1 - This is not game data!",
    );
    expect(fetchGameDataFromBggResponse.ok).toBe(false);
    expect(fetchGameDataFromBggResponse.message).toBe(
      "Received unexpected response from BGG for game ID: game-1 - This is not game data!",
    );
  });

  it("Expect OK to be false when the fetch throws an error", async () => {
    mockFetch.mockRejectedValue(new Error("Fetch Failed"));

    const fetchGameDataFromBggResponse = await runStepFunction<
      bggApiClientInput,
      string
    >(
      `Fetch BGG Game Data for game-1`,
      fetchBggDataForGame,
      fetchGameDataFromBggInput,
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledTimes(1);
    expect(spyLogMessage).toHaveBeenCalledWith(
      "ERROR",
      "Fetch BGG Game Data for game-1 failed: The fetch threw an error for game ID: game-1 - Fetch Failed",
    );
    expect(fetchGameDataFromBggResponse.ok).toBe(false);
    expect(fetchGameDataFromBggResponse.message).toBe(
      "The fetch threw an error for game ID: game-1 - Fetch Failed",
    );
  });
});
