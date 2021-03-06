const tape = require('tape');
const build = require('../src/database/db_build.js');
const dbConnect = require('../src/database/db_connection.js');
const displayItems = require('../src/database/queries/displayItems.js');
const createUser = require('../src/database/queries/createUser');
const userexists = require('../src/database/queries/userexists');

// Testing if tape is working
tape('Is it working', t => {
  t.equals(1, 1, 'one equals one');
  t.end();
});

tape('Item IDs should be selected', t => {
  build((err, res) => {
    if (err) {
      throw err;
    } else {
      const expected = [1, 2, 3, 4, 5];
      displayItems((error, results) => {
        if (error) {
          console.log(error);
        } else {
          // console.log(results);
          var actual = [];
          results.forEach(el => {
            actual.push(el.id);
          });
          t.deepEqual(actual, expected, 'Should return an array of item IDs.');
          t.end();
        }
      });
    }
  });
});

tape('New user was created', t => {
  build((err, res) => {
    if (err) throw err;
    else {
      const expected = { username: 'tape' };
      createUser(
        'tape',
        'tapefirst',
        'tapelast',
        'tapeaddress',
        'tapepassword',
        (err, res) => {
          if (err) console.log('error creating user', err);
          else {
            dbConnect.query(
              `select username from users where username = 'tape'`,
              (err, res) => {
                if (err) console.log('error in query', err);
                else {
                  // console.log(res);
                  var actual = res.rows[0];
                  // var actual1 = actual.username;
                  t.deepEqual(actual, expected, 'should find the new username');
                  t.end();
                }
              }
            );
          }
        }
      );
    }
  });
});

tape('Check if user exists', (t) => {
  build((err, res) => {
    if (err) throw err;
    else {
      const expected_1 = true;
      const expected_2 = false;
      userexists('admin', (error, result) => {
        if (error) console.log(error);
        else {
          console.log(result);
          t.equals(expected_1, result, 'Query should return true for user found.');
        }
      })
      userexists('KittyCat', (error, result) => {
        if (error) console.log(error);
        else {
          t.equals(expected_2, result, 'Query should return false for user not found.');
          t.end();
        }
      })
    }
  })
})
