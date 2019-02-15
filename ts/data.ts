var scale: number = 16;

var room01: Array<Array<string>> = [
  [
    "       gb55556     e    egb5cb55",
    "       e78b556     e    ee7b5cb5",
    "       e egb5c3    e    ee 45545",
    "       e ee7b5c23  e    ee 7bad5",
    "222223 e ee 4555c3 f23  ee  7455",
    "55555c3e ef2d5555c2d5c3 ee   455",
    "555555c222d5555555555a9 ee   7b5",
    "5555555555555a88b55569  ee    45",
    "5555555a8b55a9  7b55c3  ee   1d5",
    "55555a89e7baee  1d555c23ee  1d55",
    "5555a9  e 79ee  4555555cee12d555",
    "555563  e   ee 1d5555555efd55555",
    "555556  e   ee1d555a8b55e4555555",
    "55555c3 e   efd555a9e7b5fd555555",
    "5555556 e  1ee555a9 e 4ad5555555",
    "                                ",
  ],
  [
    "                             7b5",
    "                              7b",
    "                               4",
    "                               4",
    "2223                           4",
    "55a9hi                         7",
    "556         12223hiiij12223     ",
    "556       12d5a89     788b6    1",
    "556       78889          79    4",
    "556                            4",
    "55c23                          4",
    "88889                         1d",
    "                              45",
    "                              45",
    "         12223                45",
    "222222222d555c2222222222222222d5",
  ],
  [
    "                            6   ",
    "                             b  ",
    "                              c ",
    "1121                          6 ",
    "    4                         5 ",
    "    4       2 121     11 21   5 ",
    "   f      19     4   5     3   b",
    "   4     6       4   6     3    ",
    "         5     f8     87c  4  6 ",
    "   d2     87787          78   6 ",
    "     4                        9 ",
    "     3                       6  ",
    "87887                        5  ",
    "         11212               5  ",
    "1121 2129     e1 2 221 2112 29  ",
    "                                ",
  ]
];
var room02: Array<Array<string>> = [
  [
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
  ],
  [
    "                                ",
    "                                ",
    "                                ",
    "              123               ",
    "             1d5c23         1222",
    "             7b555c3       1d555",
    "              45555c3     1d5555",
    "              4555556hij12d55555",
    "       123    4555556   7b555555",
    "       7b6hiij45555a9    78b5555",
    "        79    455556       7b555",
    "              455556        7888",
    "             j455556            ",
    "23            45555c3           ",
    "5c2223       1d55555c3          ",
    "55555c2222222d5555555c2222222222",
  ],
  [
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
  ]
];
var room01Actors: Map<string, Actor> = new Map<string, Actor>()
  .set("child", new Npc("Young girl", new Vector2D(16, 14), new Vector2D(1, 1), "child", "U- Urg... save me... please..."))
  .set("villager", new Npc("Villager", new Vector2D(11, 13), new Vector2D(1, 2), "villager", "Hello there !"));
var room02Actors: Map<string, Actor> = new Map<string, Actor>();

/* MULTIPLE ROOMS ACTORS */

room01Actors
  .set("tp01", new Teleporter("tp01", new Vector2D(0, 13), new Vector2D(0.125, 1), "null",
    new Level(room02, room02Actors), new Vector2D(30.75, 14), false))
  .set("tp02", new Teleporter("tp02", new Vector2D(0, 2), new Vector2D(0.125, 1), "null",
    new Level(room02, room02Actors), new Vector2D(30.75, 3), false))
  .set("tp03", new Teleporter("tp03", new Vector2D(0, 1), new Vector2D(0.125, 1), "null",
    new Level(room02, room02Actors), new Vector2D(30.75, 2), false));
room02Actors
  .set("tp01", new Teleporter("tp01", new Vector2D(31.875, 13), new Vector2D(0.125, 1), "null",
    new Level(room01, room01Actors), new Vector2D(0.25, 14), true))
  .set("tp02", new Teleporter("tp02", new Vector2D(31.875, 2), new Vector2D(0.125, 1), "null",
    new Level(room01, room01Actors), new Vector2D(0.25, 3), true))
  .set("tp03", new Teleporter("tp03", new Vector2D(31.875, 1), new Vector2D(0.125, 1), "null",
    new Level(room01, room01Actors), new Vector2D(0.25, 2), true));