'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const base64 = require('base-64');
const { Users } = require('./models');
const basicAuth = require('./middleware/basic');
// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
router.post('/signup', async (req, res) => {

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const record = await Users.create(req.body);
    res.status(200).json(record);
  } catch (e) { res.status(403).send('Error Creating User'); }
});


// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
router.post('/signin', basicAuth, async (req, res) => {

  /*
    req.headers.authorization is : "Basic am9objpmb28="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  // let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'am9objpmb28=']
  // let encodedString = basicHeaderParts.pop();  // am9objpmb28=
  // let decodedString = base64.decode(encodedString); // "username:password"
  // let [username, password] = decodedString.split(':'); // username, password

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {

    res.status(200).json(req.user);

  } catch (error) { res.status(403).send('Invalid Login: ', error.message); }

});

module.exports = router;
