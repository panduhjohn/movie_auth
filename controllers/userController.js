const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../lib/passport');

const User = require('../routes/users/models/Users');

module.exports = {
    renderIndex: (req, res) => {
        res.render('index');
    },
    renderRegister: (req, res) => {
        res.render('users/register');
    },
    renderLogin: (req, res) => {
        res.render('users/login');
    },
    renderSuccess: (req, res) => {
        res.render('users/success');
    },
    renderFail: (req, res) => {
        res.render('users/fail');
    },

    registerUser: (req, res) => {
        // validate inputs
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res
                .status(403)
                .json({ message: 'All inputs must be filled' });
        }
        //check if user exists
        User.findOne({ email: req.body.email })
            .then(user => {
                //check to see if there is a user value
                if (user) {
                    return res
                        .status(400)
                        .json({ message: 'User already exists', user });
                }
                //create a new user from User model
                const newUser = new User();
                //salt password
                const salt = bcrypt.genSaltSync(10);
                //hash password
                const hash = bcrypt.hashSync(req.body.password, salt);
                //set values for the user to model keys
                newUser.name = req.body.name;
                newUser.email = req.body.email;
                newUser.password = hash;
                //save user
                newUser
                    .save()
                    .then(user => {
                        return req.login(user, err => {
                            if (err) {
                                return res
                                    .status(500)
                                    .json({ message: 'Server Error', err });
                            } else {
                                console.log('login: ', req.session);
                                return res.render('movies/index', { user });
                            }
                        });
                    })
                    .catch(err =>
                        res.status(400).json({ message: 'User not saved', err })
                    );
            })
            .catch(err =>
                res.status(500).json({ message: 'Server Error', err })
            );
    },          

    logoutUser: (req, res) => {
        req.session.destroy();
        console.log('logout: ', req.session);
        req.logout();
        return res.redirect('/');
    },

    login: passport.authenticate('local-login', {
        successRedirect: '/movies',
        failureRedirect: '/users/login'
    }),

    notFound: (req, res) => {
        return res.render('404')
    }
};

// // find all Users
// router.get('/success', (req, res) => {
//     if (req.isAuthenticated()) {
//         return res.render('success');
//     } else {
//         res.send('Unauthorized');
//     }
// });
// router.get('/fail', (req, res) => {
//     return res.render('fail');
// });

// router.put('/update/:id', (req, res) => {
//     //search for user in DB based on parameters
//     User.findById(req.params.id)
//         .then(user => {
//             if (user) {
//                 //fill in values for inputs or leave value if no input
//                 user.name = req.body.name ? req.body.name : user.name;
//                 user.email = req.body.email ? req.body.email : user.email;
//                 //save user
//                 user.save()
//                     .then(user =>
//                         res.status(200).json({ message: 'User updated', user })
//                     )
//                     .catch(err =>
//                         res
//                             .status(403)
//                             .json({ message: 'Cannot reuse credentials', err })
//                     );
//             }
//         })
//         .catch(err => res.status(500).json({ message: 'User not found', err }));
// });

// //logout User
// router.get('/logout', (req, res) => {
//     req.session.destroy();
//     console.log('logout: ', req.session);
//     req.logout();
//     return res.redirect('/');
// });

//!register without passport
// router.post('/register', (req, res) => {
//     const { name, email, password } = req.body;
//     //validate inputs
//     if (!name || !email || !password) {
//         return res.status(403).json({ message: 'All inputs must be filled' });
//     }
//     //check if user exists
//     User.findOne({ email })
//         .then(user => {
//             //check to see if there is a user value
//             if (user) {
//                 return res
//                     .status(400)
//                     .json({ message: 'User already exists', user });
//             }
//             //create a new user from User model
//             const newUser = new User();
//             //salt password
//             const salt = bcrypt.genSaltSync(10);
//             //hash password
//             const hash = bcrypt.hashSync(password, salt);

//             //set values for the user to model keys
//             newUser.name = name;
//             newUser.email = email;
//             newUser.password = hash;
//             //save user
//             newUser
//                 .save()
//                 .then(user =>
//                     res.status(200).json({ message: 'User saved', user })
//                 )
//                 .catch(err =>
//                     res.status(400).json({ message: 'User not saved', err })
//                 );
//         })
//         .catch(err => res.status(500).json({ message: 'Server Error', err }));
// });
