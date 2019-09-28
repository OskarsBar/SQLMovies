import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
            const query = `SELECT ROUND(sum(m.budget_adjusted),2) as total_budget,d.full_name as director
            FROM movies as m
            
            INNER JOIN movie_directors as md ON m.id=md.movie_id
            INNER JOIN directors as d ON md.director_id=d.id
            GROUP by d.full_name
            ORDER by sum(m.budget_adjusted) DESC
            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Steven Spielberg",
          total_budget: 2173663066.68
        },
        {
          director: "Ridley Scott",
          total_budget: 1740157354.14
        },
        {
          director: "Michael Bay",
          total_budget: 1501996071.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
            // 
            const query = `SELECT COUNT (mk.movie_id) as count,k.keyword as keyword
            FROM movies as m
            
            INNER JOIN movie_keywords as mk ON m.id=mk.movie_id
            INNER JOIN keywords as k ON mk.keyword_id=k.id
            GROUP by k.keyword
            ORDER by COUNT (mk.movie_id) DESC
            limit 10`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 411
        },
        {
          keyword: "independent film",
          count: 394
        },
        {
          keyword: "based on novel",
          count: 278
        },
        {
          keyword: "sex",
          count: 272
        },
        {
          keyword: "sport",
          count: 216
        },
        {
          keyword: "murder",
          count: 204
        },
        {
          keyword: "musical",
          count: 169
        },
        {
          keyword: "biography",
          count: 168
        },
        {
          keyword: "new york",
          count: 163
        },
        {
          keyword: "suspense",
          count: 157
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select one movie which has highest count of actors",
    async done => {
            const query = `SELECT COUNT(ma.movie_id) as count,m.original_title as original_title
            FROM movies as m
            
            INNER JOIN movie_actors as ma ON m.id=ma.movie_id
            GROUP by m.original_title
            ORDER by COUNT(ma.movie_id) DESC
            limit 1`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Hamlet",
        count: 20
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
            const query = `SELECT count(mr.rating)as five_stars_count,g.genre as genre
            FROM movies as m
            
            INNER JOIN movie_genres as mg ON m.id=mg.movie_id
            INNER JOIN genres as g ON mg.genre_id=g.id
            INNER JOIN movie_ratings as mr ON m.id=mr.movie_id
            where mr.rating=5
            GROUP by g.genre
            ORDER by count(mr.rating) DESC
            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 143663
        },
        {
          genre: "Thriller",
          five_stars_count: 96265
        },
        {
          genre: "Comedy",
          five_stars_count: 81184
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
            const query = `SELECT ROUND(avg(mr.rating),2)as avg_rating,g.genre as genre
            FROM movies as m
            
            INNER JOIN movie_genres as mg ON m.id=mg.movie_id
            INNER JOIN genres as g ON mg.genre_id=g.id
            INNER JOIN movie_ratings as mr ON m.id=mr.movie_id
            
            GROUP by g.genre
            ORDER by avg(mr.rating) DESC
            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Western",
          avg_rating: 3.64
        },
        {
          genre: "Crime",
          avg_rating: 3.62
        },
        {
          genre: "Animation",
          avg_rating: 3.6
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select top three directors with 3rd letter e in name ordered by total budget spent in their movies",
    async done => {
            const query = `SELECT ROUND(sum(m.budget_adjusted),2) as total_budget,d.full_name as director
            FROM movies as m
            
            INNER JOIN movie_directors as md ON m.id=md.movie_id
            INNER JOIN directors as d ON md.director_id=d.id
			      where d.full_name like '__e%'
            GROUP by d.full_name
            ORDER by sum(m.budget_adjusted) DESC
            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Steven Spielberg",
          total_budget: 2173663066.68
        },
        {
          director: "Brett Ratner",
          total_budget: 954533890.1
        },
        {
          director: "Joel Schumacher",
          total_budget: 865206502.07
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select top 5 genres ordered by total revenue",
    async done => {
            const query = `SELECT ROUND(sum(m.revenue),2)as totalRevenue,g.genre as genre
            FROM movies as m
            
            INNER JOIN movie_genres as mg ON m.id=mg.movie_id
            INNER JOIN genres as g ON mg.genre_id=g.id
            INNER JOIN movie_ratings as mr ON m.id=mr.movie_id
			
            GROUP by g.genre
            ORDER by sum(m.revenue) DESC
            limit 5`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Action",
          totalRevenue: 82650343669562
        },
        {
          genre: "Thriller",
          totalRevenue: 82188827159264.98
        },
        {
          genre: "Drama",
          totalRevenue: 77238064915402.98
        },
        {
          genre: "Adventure",
          totalRevenue: 73959235652036
        },
        {
          genre: "Science Fiction",
          totalRevenue: 56288909819515
        }
      ]);

      done();
    },
    minutes(3)
  );
  it(
    "should select top 3 keywords 6 letters long ordered by their appearance in movies",
    async done => {
            // 
            const query = `SELECT COUNT (mk.movie_id) as count,k.keyword as keyword
            FROM movies as m
            
            INNER JOIN movie_keywords as mk ON m.id=mk.movie_id
            INNER JOIN keywords as k ON mk.keyword_id=k.id
            where k.keyword like '______'
            GROUP by k.keyword
            ORDER by COUNT (mk.movie_id) DESC
            limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "murder",
          count: 204
        },
        {
          keyword: "nudity",
          count: 154
        },
        {
          keyword: "prison",
          count: 139
        }
      ]);

      done();
    },
    minutes(3)
  );
});
