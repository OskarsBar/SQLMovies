import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Simple Queries", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("05", "06");
  }, minutes(3));

  it(
    "should select total budget and revenue from movies, by using adjusted financial data",
    async done => {
      const query = `SELECT ROUND(SUM(budget_adjusted), 2) as total_budget,ROUND(SUM(revenue_adjusted), 2) as total_revenue from movies`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        total_budget: 190130349695.48,
        total_revenue: 555818960433.08
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select count from movies where budget was more than 100000000 and release date after 2009",
    async done => {
      const query = `SELECT COUNT(*) as count from movies where budget > 100000000 and release_date > 1546304461`;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(282);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three movies order by budget where release data is after 2009",
    async done => {
      const query = `SELECT original_title,budget,revenue FROM movies where release_date > 1546304461  ORDER BY budget DESC limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: "The Warrior's Way",
          budget: 425000000.0,
          revenue: 11087569.0
        },
        {
          original_title: "Pirates of the Caribbean: On Stranger Tides",
          budget: 380000000.0,
          revenue: 1021683000.0
        },
        {
          original_title: "Pirates of the Caribbean: At World's End",
          budget: 300000000.0,
          revenue: 961000000.0
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies where homepage is secure (starts with https)",
    async done => {
      const query = `SELECT COUNT(*) as count from movies where homepage like 'https%'`;
      const result = await db.selectSingleRow(query);

      expect(result.count).toBe(82);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of movies released every year",
    async done => {
      const query = `select COUNT(*) as count,substr(release_date,1,4)as year
      from movies 
      group by year
      order by year desc`;
      const result = await db.selectMultipleRows(query);

      expect(result.length).toBe(56);
      expect(result.slice(0, 3)).toEqual([
        {
          count: 627,
          year: "2015"
        },
        {
          count: 696,
          year: "2014"
        },
        {
          count: 656,
          year: "2013"
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three users which left most ratings",
    async done => {
      const query = `select count (*) as count,user_id
      from movie_ratings
      group by user_id
      order by count DESC
      limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          user_id: 8659,
          count: 349
        },
        {
          user_id: 179792,
          count: 313
        },
        {
          user_id: 107720,
          count: 294
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select count of ratings left each month",
    async done => {
      const query = `select count (*) as count,substr(time_created,6,2)as month
      from movie_ratings
      group by month
      order by count DESC`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          count: 161252,
          month: "11"
        },
        {
          count: 146804,
          month: "12"
        },
        {
          count: 144545,
          month: "07"
        },
        {
          count: 141643,
          month: "10"
        },
        {
          count: 136058,
          month: "06"
        },
        {
          count: 131934,
          month: "01"
        },
        {
          count: 130411,
          month: "05"
        },
        {
          count: 129070,
          month: "03"
        },
        {
          count: 127299,
          month: "08"
        },
        {
          count: 119368,
          month: "04"
        },
        {
          count: 108811,
          month: "02"
        },
        {
          count: 103819,
          month: "09"
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select avarage movie budget",
    async done => {
      const query = `select round(avg(budget_adjusted),2) as avarageBudget from movies`;
      const result = await db.selectSingleRow(query);

      expect(result.avarageBudget).toBe(17580245);

      done();
    },
    minutes(3)
  );
  it(
    "should select total movie budget for movies starts with letter D",
    async done => {
      const query = `select round(sum(budget_adjusted),2) as sum
      from movies
      where original_title like 'D%'`;
      const result = await db.selectSingleRow(query);

      expect(result.sum).toBe(7946813578.4);

      done();
    },
    minutes(3)
  );
  it(
    "should select sum of movies revenue where title have 6 letters starts with B ends with n",
    async done => {
      const query = `select round(sum(revenue),2) as totalRevenue ,original_title
      from movies
      where original_title like 'B____n'`;
      const result = await db.selectSingleRow(query);

      expect(result.totalRevenue).toBe(411348924.0);
      expect(result.original_title).toBe("Broken");
      done();
    },
    minutes(3)
  );
});
