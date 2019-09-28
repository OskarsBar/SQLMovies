import _ from "lodash";
import { Database } from "../src/database";
import {
  selectGenreById,
  selectDirectorById,
  selectActorById,
  selectKeywordById,
  selectProductionCompanyById,
  selectMovieById
} from "../src/queries/select";
import { minutes } from "./utils";
import { escape } from "../src/utils";

describe("Update tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("08", "09");
    await db.execute("PRAGMA foreign_keys = ON");
  }, minutes(3));

it(
  "Should be able to change actor name by id",
  async done => {
    const actorId = 34;

    await db.execute(`UPDATE actors SET full_name = 'The king of CODE' WHERE id = '${actorId}'`);

    const actor = await db.selectSingleRow(selectActorById(actorId));

    expect(actor.full_name).toBe('The king of CODE');
    
    done();
  }
);
it(
  "Should be able to change directors name by id",
  async done => {
    const directorId = 13;

    await db.execute(`UPDATE directors SET full_name = 'The Boss of Bugs' WHERE id = '${directorId}'`);

    const director = await db.selectSingleRow(selectDirectorById(directorId));

    expect(director.full_name).toBe('The Boss of Bugs');
    
    done();
  }
);
it(
  "Should be able to change genre name by id",
  async done => {
    const genreId = 7;

    await db.execute(`UPDATE genres SET genre = 'The Amazing Action Comedy Thriller' WHERE id = '${genreId}'`);

    const genre = await db.selectSingleRow(selectGenreById(genreId));

    expect(genre.genre).toBe('The Amazing Action Comedy Thriller');
    
    done();
  }
);
});