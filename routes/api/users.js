const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route    POST api/users
//@desc     Register user
//@access   Public 

// User validation
router.post('/', [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please iclude a valid email')
    .isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    const { name, email, password } = req.body;

    try {

      // See if user exist
      let user = await User.findOne({ email });  // ES6 equal email: email(req.body.email)

      if (user) {
        return res.status(400).json({ errors: [{ msg: [{ msg: 'User already exist' }] }] });
      }

      // Get users gravatar 

      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg',  // reating 
        d: 'mp'   // default
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password with bcryptjs

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },     // Chang to 3600 befor deploying!!!
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        });

    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;