import {
  BggGameDataFromCollection,
  BggGameDataFromSingleCallJustTheGame,
  DataResponse,
  ExtractedEntity,
  GameData,
} from "../src/utils/data.types";

// Data for requests
export const validCollectionXMLOneGame: string =
  '<?xml version="1.0" encoding="utf-8" standalone="yes"?><items totalitems="1082" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse" pubdate="Tue, 08 Oct 2024 14:32:33 +0000"> <item objecttype="thing" objectid="269546" subtype="boardgame" collid="93567113">	<name sortindex="1">¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933</name> <yearpublished>2017</yearpublished> <image>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg</image> <thumbnail>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg</thumbnail> <stats minplayers="2" maxplayers="2" minplaytime="240" maxplaytime="240" playingtime="240" numowned="11" > <rating value="N/A"> <usersrated value="6" /> <average value="7.25" /> <bayesaverage value="0" /> <stddev value="1.40683" /> <median value="0" /> </rating> </stats>	<status own="0" prevowned="0" fortrade="0" want="1" wanttoplay="0" wanttobuy="1" wishlist="0" preordered="0" lastmodified="2022-04-29 06:01:26" />	<numplays>0</numplays> </item></items>';

export const validCollectionXMLTwoGames: string =
  '<?xml version="1.0" encoding="utf-8" standalone="yes"?><items totalitems="1082" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse" pubdate="Sat, 19 Oct 2024 19:53:33 +0000"> <item objecttype="thing" objectid="269546" subtype="boardgame" collid="93567113"> <name sortindex="1">¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933</name> <yearpublished>2017</yearpublished> <image>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg</image> <thumbnail>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg</thumbnail> <stats minplayers="2" maxplayers="2" minplaytime="240" maxplaytime="240" playingtime="240" numowned="11" > <rating value="N/A"> <usersrated value="6" /> <average value="7.25" /> <bayesaverage value="0" /> <stddev value="1.40683" /> <median value="0" /> </rating> </stats> <status own="0" prevowned="0" fortrade="0" want="1" wanttoplay="0" wanttobuy="1" wishlist="0" preordered="0" lastmodified="2022-04-29 06:01:26" /> <numplays>0</numplays> </item> <item objecttype="thing" objectid="22407" subtype="boardgame" collid="77275687"> <name sortindex="1">1066: End of the Dark Ages</name> <yearpublished>2006</yearpublished> <image>https://cf.geekdo-images.com/OWNEO-hMms4oKCAxMgo3Tg__original/img/OTnjaotTUtNL31W5F-RFrZNiAz0=/0x0/filters:format(jpeg)/pic772997.jpg</image> <thumbnail>https://cf.geekdo-images.com/OWNEO-hMms4oKCAxMgo3Tg__thumb/img/V8Wb82lBX27u02oKZ8PrvWSEAaw=/fit-in/200x150/filters:strip_icc()/pic772997.jpg</thumbnail> <stats minplayers="2" maxplayers="4" minplaytime="240" maxplaytime="240" playingtime="240" numowned="335" > <rating value="N/A"> <usersrated value="69" /> <average value="6.21014" /> <bayesaverage value="5.5189" /> <stddev value="1.5691" /> <median value="0" /> </rating> </stats> <status own="0" prevowned="1" fortrade="0" want="0" wanttoplay="0" wanttobuy="0" wishlist="0" preordered="0" lastmodified="2020-12-17 10:02:48" /> <numplays>0</numplays> </item></items>';

export const validGameXML: string =
  '<boardgames termsofuse="https://boardgamegeek.com/xmlapi/termsofuse"> <boardgame objectid="269546"> <yearpublished>2017</yearpublished> <minplayers>2</minplayers> <maxplayers>2</maxplayers> <playingtime>240</playingtime> <minplaytime>240</minplaytime> <maxplaytime>240</maxplaytime> <age>16</age> <name primary="true" sortindex="1">¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933</name> <description>Apuren el Corralito! is a two player print and play, free game depicting the climactic battle of 2nd Alihuat&amp;aacute; (Dec. 1933), during the Chaco War between Paraguay and Bolivia (1932-35), which ended with the surrender of the bulk of the Bolivian army in a clearing of the &amp;ldquo;chaco&amp;rdquo; bush known as Campo V&amp;iacute;a, and resulted in the first truce in the war.&lt;br/&gt;&lt;br/&gt;The game is a Battalion level simulation, the map depicts a 30 x 35 mile area (each hex is 1mile aprox.) and turns are 1 day each (the battle lasted for 10 days). The game includes:&lt;br/&gt;&lt;br/&gt;&lt;br/&gt; 280 two sided counters.&lt;br/&gt; Four A4 sheets map. (Or 1 x A2 map).&lt;br/&gt; One air placement auxiliary sheet.&lt;br/&gt; One rulebook with playing aides.&lt;br/&gt;&lt;br/&gt;&lt;br/&gt;Although the battle was mainly a one sided business, with the Paraguayan conducting three successive envelopments (thanks to initial Bolivian command sclerosis and lack of reserves), the Bolivian player still has a lot to do, husbanding his forces and trying to save as much as he can from the Paraguayan onslaught.&lt;br/&gt;&lt;br/&gt;On the other side, the Paraguayan player must at least accomplish what historically was done: envelope and force to surrender two, out of three, Bolivian divisions and tear down the front, forcing his opponent to abandon the battle area. And this means having the noose tightened up to the end, and sticking to a strict schedule.&lt;br/&gt;&lt;br/&gt;Being the Chaco an extensive bush country, intelligence on your enemy is a key to carrying out enveloping maneuvers. Remember that this was &amp;rdquo;MG time&amp;rdquo; and you couldn&amp;rsquo;t just walk naively into an entrenched killing ground. The game provides rules for intelligence gathering in order to simulate surprise.&lt;br/&gt;&lt;br/&gt;&amp;mdash;description from the designer&lt;br/&gt;&lt;br/&gt;</description> <thumbnail>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg</thumbnail> <image>https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg</image> <boardgamepublisher objectid="4">(Self-Published)</boardgamepublisher> <boardgamefamily objectid="13252">Country: Bolivia</boardgamefamily> <boardgamefamily objectid="10650">Country: Paraguay</boardgamefamily> <boardgamemechanic objectid="2072">Dice Rolling</boardgamemechanic> <boardgamefamily objectid="81575">Digital Implementations: VASSAL</boardgamefamily> <boardgameversion objectid="439923">English/Spanish edition</boardgameversion> <boardgamedesigner objectid="115133">Pablo Martín Fernández</boardgamedesigner> <boardgamedeveloper objectid="115133">Pablo Martín Fernández</boardgamedeveloper> <boardgameartist objectid="115133">Pablo Martín Fernández</boardgameartist> <boardgamemechanic objectid="2026">Hexagon Grid</boardgamemechanic> <boardgamefamily objectid="58144">History: Chaco War</boardgamefamily> <boardgameintegration objectid="343269">Huarikasaya Kalatakaya!: The Battle of Strongest, Bolivia vs Paraguay, 19-25 May 1934</boardgameintegration> <boardgamefamily objectid="44377">Interwar period (Nov. 1918 - Aug. 1939)</boardgamefamily> <boardgamefamily objectid="59609">Misc: Free Wargames</boardgamefamily> <boardgamefamily objectid="61979">Players: Two-Player Only Games</boardgamefamily> <boardgamemechanic objectid="2070">Simulation</boardgamemechanic> <boardgamecategory objectid="1019">Wargame</boardgamecategory> <boardgamesubdomain objectid="4664">Wargames</boardgamesubdomain> <boardgameintegration objectid="343269" inbound="true">Huarikasaya Kalatakaya!: The Battle of Strongest, Bolivia vs Paraguay, 19-25 May 1934</boardgameintegration> <poll name="suggested_numplayers" title="User Suggested Number of Players" totalvotes="3"> <results numplayers="1"> <result value="Best" numvotes="0" /> <result value="Recommended" numvotes="3" /> <result value="Not Recommended" numvotes="0" /> </results> <results numplayers="2"> <result value="Best" numvotes="3" /> <result value="Recommended" numvotes="0" /> <result value="Not Recommended" numvotes="0" /> </results> <results numplayers="2+"> <result value="Best" numvotes="0" /> <result value="Recommended" numvotes="1" /> <result value="Not Recommended" numvotes="2" /> </results> </poll> <poll name="language_dependence" title="Language Dependence" totalvotes="3"> <results> <result level="1" value="No necessary in-game text" numvotes="0" /> <result level="2" value="Some necessary text - easily memorized or small crib sheet" numvotes="0" /> <result level="3" value="Moderate in-game text - needs crib sheet or paste ups" numvotes="3" /> <result level="4" value="Extensive use of text - massive conversion needed to be playable" numvotes="0" /> <result level="5" value="Unplayable in another language" numvotes="0" /> </results> </poll> <poll name="suggested_playerage" title="User Suggested Player Age" totalvotes="3"> <results> <result value="2" numvotes="0" /> <result value="3" numvotes="0" /> <result value="4" numvotes="0" /> <result value="5" numvotes="0" /> <result value="6" numvotes="0" /> <result value="8" numvotes="0" /> <result value="10" numvotes="0" /> <result value="12" numvotes="0" /> <result value="14" numvotes="0" /> <result value="16" numvotes="3" /> <result value="18" numvotes="0" /> <result value="21 and up" numvotes="0" /> </results> </poll> </boardgame></boardgames>';

export const validExistingEntity: ExtractedEntity = {
  id: "1",
  bggId: "2",
  name: "This is an entity",
  role: "ThisIsTheRole",
  existingEntity: true,
};

export const validGameData: GameData = {
  id: "1",
  bggId: "269546",
  title: "¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933",
  yearpublished: "2017",
  thumbnail:
    "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg",
  description:
    "Apuren el Corralito! is a two player print and play, free game depicting the climactic battle of 2nd Alihuat&aacute; (Dec. 1933), during the Chaco War between Paraguay and Bolivia (1932-35), which ended with the surrender of the bulk of the Bolivian army in a clearing of the &ldquo;chaco&rdquo; bush known as Campo V&iacute;a, and resulted in the first truce in the war.<br/><br/>The game is a Battalion level simulation, the map depicts a 30 x 35 mile area (each hex is 1mile aprox.) and turns are 1 day each (the battle lasted for 10 days). The game includes:<br/><br/><br/>     280 two sided counters.<br/>     Four A4 sheets map. (Or 1 x A2 map).<br/>     One air placement auxiliary sheet.<br/>     One rulebook with playing aides.<br/><br/><br/>Although the battle was mainly a one sided business, with the Paraguayan conducting three successive envelopments (thanks to initial Bolivian command sclerosis and lack of reserves), the Bolivian player still has a lot to do, husbanding his forces and trying to save as much as he can from the Paraguayan onslaught.<br/><br/>On the other side, the Paraguayan player must at least accomplish what historically was done: envelope and force to surrender two, out of three, Bolivian divisions and tear down the front, forcing his opponent to abandon the battle area. And this means having the noose tightened up to the end, and sticking to a strict schedule.<br/><br/>Being the Chaco an extensive bush country, intelligence on your enemy is a key to carrying out enveloping maneuvers. Remember that this was &rdquo;MG time&rdquo; and you couldn&rsquo;t just walk naively into an entrenched killing ground. The game provides rules for intelligence gathering in order to simulate surprise.<br/><br/>&mdash;description from the designer<br/><br/>",
  gameown: false,
  gamewanttobuy: true,
  gameprevowned: false,
  gamefortrade: false,
};

export const validBggGameJson: BggGameDataFromSingleCallJustTheGame = {
  _attributes: { objectid: "269546" },
  yearpublished: { _text: "2017" },
  minplayers: { _text: "2" },
  maxplayers: { _text: "2" },
  playingtime: { _text: "240" },
  minplaytime: { _text: "240" },
  maxplaytime: { _text: "240" },
  age: { _text: "16" },
  name: {
    _attributes: { primary: "true", sortindex: "1" },
    _text:
      "¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933",
  },
  description: {
    _text:
      "Apuren el Corralito! is a two player print and play, free game depicting the climactic battle of 2nd Alihuat&aacute; (Dec. 1933), during the Chaco War between Paraguay and Bolivia (1932-35), which ended with the surrender of the bulk of the Bolivian army in a clearing of the &ldquo;chaco&rdquo; bush known as Campo V&iacute;a, and resulted in the first truce in the war.<br/><br/>The game is a Battalion level simulation, the map depicts a 30 x 35 mile area (each hex is 1mile aprox.) and turns are 1 day each (the battle lasted for 10 days). The game includes:<br/><br/><br/>     280 two sided counters.<br/>     Four A4 sheets map. (Or 1 x A2 map).<br/>     One air placement auxiliary sheet.<br/>     One rulebook with playing aides.<br/><br/><br/>Although the battle was mainly a one sided business, with the Paraguayan conducting three successive envelopments (thanks to initial Bolivian command sclerosis and lack of reserves), the Bolivian player still has a lot to do, husbanding his forces and trying to save as much as he can from the Paraguayan onslaught.<br/><br/>On the other side, the Paraguayan player must at least accomplish what historically was done: envelope and force to surrender two, out of three, Bolivian divisions and tear down the front, forcing his opponent to abandon the battle area. And this means having the noose tightened up to the end, and sticking to a strict schedule.<br/><br/>Being the Chaco an extensive bush country, intelligence on your enemy is a key to carrying out enveloping maneuvers. Remember that this was &rdquo;MG time&rdquo; and you couldn&rsquo;t just walk naively into an entrenched killing ground. The game provides rules for intelligence gathering in order to simulate surprise.<br/><br/>&mdash;description from the designer<br/><br/>",
  },
  thumbnail: {
    _text:
      "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg",
  },
  image: {
    _text:
      "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg",
  },
  boardgamepublisher: {
    _attributes: { objectid: "4" },
    _text: "(Self-Published)",
  },
  boardgamefamily: [
    { _attributes: { objectid: "13252" }, _text: "Country: Bolivia" },
    { _attributes: { objectid: "10650" }, _text: "Country: Paraguay" },
    {
      _attributes: { objectid: "81575" },
      _text: "Digital Implementations: VASSAL",
    },
    { _attributes: { objectid: "58144" }, _text: "History: Chaco War" },
    {
      _attributes: { objectid: "44377" },
      _text: "Interwar period (Nov. 1918 - Aug. 1939)",
    },
    { _attributes: { objectid: "59609" }, _text: "Misc: Free Wargames" },
    {
      _attributes: { objectid: "61979" },
      _text: "Players: Two-Player Only Games",
    },
  ],
  boardgamemechanic: [
    { _attributes: { objectid: "2072" }, _text: "Dice Rolling" },
    { _attributes: { objectid: "2026" }, _text: "Hexagon Grid" },
    { _attributes: { objectid: "2070" }, _text: "Simulation" },
  ],
  boardgameversion: {
    _attributes: { objectid: "439923" },
    _text: "English/Spanish edition",
  },
  boardgamedesigner: {
    _attributes: { objectid: "115133" },
    _text: "Pablo Martín Fernández",
  },
  boardgamedeveloper: {
    _attributes: { objectid: "115133" },
    _text: "Pablo Martín Fernández",
  },
  boardgameartist: {
    _attributes: { objectid: "115133" },
    _text: "Pablo Martín Fernández",
  },
  boardgameintegration: [
    {
      _attributes: { objectid: "343269" },
      _text:
        "Huarikasaya Kalatakaya!: The Battle of Strongest, Bolivia vs Paraguay, 19-25 May 1934",
    },
    {
      _attributes: { objectid: "343269", inbound: "true" },
      _text:
        "Huarikasaya Kalatakaya!: The Battle of Strongest, Bolivia vs Paraguay, 19-25 May 1934",
    },
  ],
  boardgamecategory: {
    _attributes: { objectid: "1019" },
    _text: "Wargame",
  },
  boardgamesubdomain: {
    _attributes: { objectid: "4664" },
    _text: "Wargames",
  },
  poll: [
    {
      _attributes: {
        name: "suggested_numplayers",
        title: "User Suggested Number of Players",
        totalvotes: "3",
      },
      results: [
        {
          _attributes: { numplayers: "1" },
          result: [
            { _attributes: { value: "Best", numvotes: "0" } },
            { _attributes: { value: "Recommended", numvotes: "3" } },
            { _attributes: { value: "Not Recommended", numvotes: "0" } },
          ],
        },
        {
          _attributes: { numplayers: "2" },
          result: [
            { _attributes: { value: "Best", numvotes: "3" } },
            { _attributes: { value: "Recommended", numvotes: "0" } },
            { _attributes: { value: "Not Recommended", numvotes: "0" } },
          ],
        },
        {
          _attributes: { numplayers: "2+" },
          result: [
            { _attributes: { value: "Best", numvotes: "0" } },
            { _attributes: { value: "Recommended", numvotes: "1" } },
            { _attributes: { value: "Not Recommended", numvotes: "2" } },
          ],
        },
      ],
    },
    {
      _attributes: {
        name: "language_dependence",
        title: "Language Dependence",
        totalvotes: "3",
      },
      results: {
        result: [
          {
            _attributes: {
              level: "1",
              value: "No necessary in-game text",
              numvotes: "0",
            },
          },
          {
            _attributes: {
              level: "2",
              value:
                "Some necessary text - easily memorized or small crib sheet",
              numvotes: "0",
            },
          },
          {
            _attributes: {
              level: "3",
              value: "Moderate in-game text - needs crib sheet or paste ups",
              numvotes: "3",
            },
          },
          {
            _attributes: {
              level: "4",
              value:
                "Extensive use of text - massive conversion needed to be playable",
              numvotes: "0",
            },
          },
          {
            _attributes: {
              level: "5",
              value: "Unplayable in another language",
              numvotes: "0",
            },
          },
        ],
      },
    },
    {
      _attributes: {
        name: "suggested_playerage",
        title: "User Suggested Player Age",
        totalvotes: "3",
      },
      results: {
        result: [
          { _attributes: { value: "2", numvotes: "0" } },
          { _attributes: { value: "3", numvotes: "0" } },
          { _attributes: { value: "4", numvotes: "0" } },
          { _attributes: { value: "5", numvotes: "0" } },
          { _attributes: { value: "6", numvotes: "0" } },
          { _attributes: { value: "8", numvotes: "0" } },
          { _attributes: { value: "10", numvotes: "0" } },
          { _attributes: { value: "12", numvotes: "0" } },
          { _attributes: { value: "14", numvotes: "0" } },
          { _attributes: { value: "16", numvotes: "3" } },
          { _attributes: { value: "18", numvotes: "0" } },
          { _attributes: { value: "21 and up", numvotes: "0" } },
        ],
      },
    },
  ],
  "poll-summary": {
    _attributes: {
      name: "suggested_numplayers",
      title: "User Suggested Number of Players",
    },
    result: [
      { _attributes: { name: "bestwith", value: "Best with 2 players" } },
      {
        _attributes: {
          name: "recommmendedwith",
          value: "Recommended with 1–2 players",
        },
      },
    ],
  },
};

export const validBggGameJsonWithoutEntities: BggGameDataFromSingleCallJustTheGame =
  {
    _attributes: { objectid: "269546" },
    yearpublished: { _text: "2017" },
    minplayers: { _text: "2" },
    maxplayers: { _text: "2" },
    playingtime: { _text: "240" },
    minplaytime: { _text: "240" },
    maxplaytime: { _text: "240" },
    age: { _text: "16" },
    name: {
      _attributes: { primary: "true", sortindex: "1" },
      _text:
        "¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933",
    },
    description: {
      _text:
        "Apuren el Corralito! is a two player print and play, free game depicting the climactic battle of 2nd Alihuat&aacute; (Dec. 1933), during the Chaco War between Paraguay and Bolivia (1932-35), which ended with the surrender of the bulk of the Bolivian army in a clearing of the &ldquo;chaco&rdquo; bush known as Campo V&iacute;a, and resulted in the first truce in the war.<br/><br/>The game is a Battalion level simulation, the map depicts a 30 x 35 mile area (each hex is 1mile aprox.) and turns are 1 day each (the battle lasted for 10 days). The game includes:<br/><br/><br/>     280 two sided counters.<br/>     Four A4 sheets map. (Or 1 x A2 map).<br/>     One air placement auxiliary sheet.<br/>     One rulebook with playing aides.<br/><br/><br/>Although the battle was mainly a one sided business, with the Paraguayan conducting three successive envelopments (thanks to initial Bolivian command sclerosis and lack of reserves), the Bolivian player still has a lot to do, husbanding his forces and trying to save as much as he can from the Paraguayan onslaught.<br/><br/>On the other side, the Paraguayan player must at least accomplish what historically was done: envelope and force to surrender two, out of three, Bolivian divisions and tear down the front, forcing his opponent to abandon the battle area. And this means having the noose tightened up to the end, and sticking to a strict schedule.<br/><br/>Being the Chaco an extensive bush country, intelligence on your enemy is a key to carrying out enveloping maneuvers. Remember that this was &rdquo;MG time&rdquo; and you couldn&rsquo;t just walk naively into an entrenched killing ground. The game provides rules for intelligence gathering in order to simulate surprise.<br/><br/>&mdash;description from the designer<br/><br/>",
    },
    thumbnail: {
      _text:
        "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg",
    },
    image: {
      _text:
        "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg",
    },
    poll: [
      {
        _attributes: {
          name: "suggested_numplayers",
          title: "User Suggested Number of Players",
          totalvotes: "3",
        },
        results: [
          {
            _attributes: { numplayers: "1" },
            result: [
              { _attributes: { value: "Best", numvotes: "0" } },
              { _attributes: { value: "Recommended", numvotes: "3" } },
              { _attributes: { value: "Not Recommended", numvotes: "0" } },
            ],
          },
          {
            _attributes: { numplayers: "2" },
            result: [
              { _attributes: { value: "Best", numvotes: "3" } },
              { _attributes: { value: "Recommended", numvotes: "0" } },
              { _attributes: { value: "Not Recommended", numvotes: "0" } },
            ],
          },
          {
            _attributes: { numplayers: "2+" },
            result: [
              { _attributes: { value: "Best", numvotes: "0" } },
              { _attributes: { value: "Recommended", numvotes: "1" } },
              { _attributes: { value: "Not Recommended", numvotes: "2" } },
            ],
          },
        ],
      },
      {
        _attributes: {
          name: "language_dependence",
          title: "Language Dependence",
          totalvotes: "3",
        },
        results: {
          result: [
            {
              _attributes: {
                level: "1",
                value: "No necessary in-game text",
                numvotes: "0",
              },
            },
            {
              _attributes: {
                level: "2",
                value:
                  "Some necessary text - easily memorized or small crib sheet",
                numvotes: "0",
              },
            },
            {
              _attributes: {
                level: "3",
                value: "Moderate in-game text - needs crib sheet or paste ups",
                numvotes: "3",
              },
            },
            {
              _attributes: {
                level: "4",
                value:
                  "Extensive use of text - massive conversion needed to be playable",
                numvotes: "0",
              },
            },
            {
              _attributes: {
                level: "5",
                value: "Unplayable in another language",
                numvotes: "0",
              },
            },
          ],
        },
      },
      {
        _attributes: {
          name: "suggested_playerage",
          title: "User Suggested Player Age",
          totalvotes: "3",
        },
        results: {
          result: [
            { _attributes: { value: "2", numvotes: "0" } },
            { _attributes: { value: "3", numvotes: "0" } },
            { _attributes: { value: "4", numvotes: "0" } },
            { _attributes: { value: "5", numvotes: "0" } },
            { _attributes: { value: "6", numvotes: "0" } },
            { _attributes: { value: "8", numvotes: "0" } },
            { _attributes: { value: "10", numvotes: "0" } },
            { _attributes: { value: "12", numvotes: "0" } },
            { _attributes: { value: "14", numvotes: "0" } },
            { _attributes: { value: "16", numvotes: "3" } },
            { _attributes: { value: "18", numvotes: "0" } },
            { _attributes: { value: "21 and up", numvotes: "0" } },
          ],
        },
      },
    ],
    "poll-summary": {
      _attributes: {
        name: "suggested_numplayers",
        title: "User Suggested Number of Players",
      },
      result: [
        { _attributes: { name: "bestwith", value: "Best with 2 players" } },
        {
          _attributes: {
            name: "recommmendedwith",
            value: "Recommended with 1–2 players",
          },
        },
      ],
    },
  };

export const validBggGameDataFromCollection: BggGameDataFromCollection = {
  _attributes: {
    objecttype: "thing",
    objectid: "269546",
    subtype: "boardgame",
    collid: "93567113",
  },
  name: {
    _attributes: { sortindex: "1" },
    _text:
      "¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933",
  },
  yearpublished: { _text: "2017" },
  image: {
    _text:
      "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__original/img/slLO8WPtRFXnqYJUXsIjhTQ5HXI=/0x0/filters:format(jpeg)/pic4707076.jpg",
  },
  thumbnail: {
    _text:
      "https://cf.geekdo-images.com/EZ3cfwV-WqjrxgXLBCGORg__thumb/img/LQvSlO1NsS15e6BwlIWWULiCUB0=/fit-in/200x150/filters:strip_icc()/pic4707076.jpg",
  },
  stats: {
    _attributes: {
      minplayers: "2",
      maxplayers: "2",
      minplaytime: "240",
      maxplaytime: "240",
      playingtime: "240",
      numowned: "11",
    },
    rating: {
      _attributes: { value: "N/A" },
      usersrated: { _attributes: { value: "6" } },
      average: { _attributes: { value: "7.25" } },
      bayesaverage: { _attributes: { value: "0" } },
      stddev: { _attributes: { value: "1.40683" } },
      median: { _attributes: { value: "0" } },
    },
  },
  status: {
    _attributes: {
      own: "0",
      prevowned: "0",
      fortrade: "0",
      want: "1",
      wanttoplay: "0",
      wanttobuy: "1",
      wishlist: "0",
      preordered: "0",
      lastmodified: "2022-04-29 06:01:26",
    },
  },
  numplays: { _text: "0" },
};

// Responses
export const fetchCollectionDataSuccessResponse: DataResponse = {
  ok: true,
  data: validCollectionXMLOneGame,
  message: "Received a response from BGG!",
};

export const fetchGameDataSuccessResponse: DataResponse = {
  ok: true,
  data: validGameXML,
  message: "Received a response from BGG!",
};

export const getGameDataFailFormatCollectionDataResponse: DataResponse = {
  ok: false,
  message:
    "Problem getting data for ¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933.",
};

export const getGameDataFailGetCollectionDataResponse: DataResponse = {
  ok: false,
  message: "No response from BGG call.",
};

export const getGameDataFailGetGameDataResponse: DataResponse = {
  ok: false,
  message: "Did not receive a response from BGG!",
};

export const getGameDataGameSuccessResponse: DataResponse = {
  ok: true,
  data: validGameXML,
  message: "Received a response from BGG!",
};

export const getGameDataCollectionSuccessResponse: DataResponse = {
  ok: true,
  data: validCollectionXMLOneGame,
  message: "Received a response from BGG!",
};

export const getGameDataTryFailFormatCollectionDataResponse: DataResponse = {
  ok: false,
  message:
    "getGameData for ¡Apuren el Corralito!: The Second Battle of Alihuatá, December 1933 failed.\nMESSAGE: getGameData Failed",
};

export const getGameDataTryFailGetGameDataResponse: DataResponse = {
  ok: false,
  message: "Did not receive a response from BGG!",
};

export const processGameSuccessResponse: DataResponse = {
  data: JSON.stringify(validBggGameDataFromCollection),
  ok: true,
  message: "Game data processed successfully",
};

export const promiseAllFulfilledResponse: PromiseSettledResult<unknown> = {
  status: "fulfilled",
  value: processGameSuccessResponse,
};
