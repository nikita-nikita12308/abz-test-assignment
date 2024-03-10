const { Pool } = require("pg");
const { faker } = require("@faker-js/faker");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ABZREST",
  password: "1903",
  port: 5432,
});

// Seed positions first
pool.query(
  `
    INSERT INTO positions (name) VALUES
      ('Security'),
      ('Designer'),
      ('Content manager'),
      ('Lawyer')
    RETURNING id;
  `,
  (err, positionsResult) => {
    if (err) {
      console.error("Error seeding positions table:", err);
      pool.end();
    } else {
      console.log("Positions table seeded successfully");

      // Use the returned positions' IDs to seed users
      const positionIds = positionsResult.rows.map((row) => row.id);

      // Seed users
      for (let i = 0; i < 45; i++) {
        const userData = generateRandomUserData(positionIds);

        const userValues = [
          ...Object.values(userData) /* Remove CURRENT_TIMESTAMP */,
        ];

        pool.query(
          `
          INSERT INTO users (name, email, phone, position_id, photo, registration_timestamp) VALUES
            ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP);
        `,
          userValues,
          (userErr, userResult) => {
            if (userErr) {
              console.error("Error seeding users table:", userErr);
            } else {
              console.log(`User ${i + 1} seeded successfully`);
            }

            // Close the connection pool after all insertions
            if (i === 44) {
              pool.end();
            }
          }
        );
      }
    }
  }
);

// Function to generate random user data with position IDs
const generateRandomUserData = (positionIds) => {
  const positionId =
    positionIds[Math.floor(Math.random() * positionIds.length)];

  return {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number("+380#########"),
    position_id: positionId,
    photo: faker.image.avatar(),
  };
};
