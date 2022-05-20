"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var { Photo, Comment } = require('./schema/photo.js');

var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

// session 
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

// stuff to handle image upload
const fs = require("fs");
const multer = require('multer');
const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');


// password encryption
var cs142password = require('./cs142password')


mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });




app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            { name: 'user', collection: User },
            { name: 'photo', collection: Photo },
            { name: 'schemaInfo', collection: SchemaInfo }
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});



/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }

    var query = User.find({});

    query.select("first_name last_name").exec(function (err, users) {
        if (err) {
            console.error('Doing /user/list error:', err);
            response.status(500).json(err);
            return;
        }
        if (users.length === 0) {
            response.status(500).send('We couldnt find any user');
            return;
        }
        users = JSON.parse(JSON.stringify(users));

        const queries = ["photos", "comments"];
        async.each(queries,
            (query, done_callback) => {
                if (query === "photos") {

                    //fetch the photos count for each user
                    async.each(users,
                        (user, done_callback_photo) => {
                            var query_photo_count = Photo.where({ user_id: user._id });
                            query_photo_count.countDocuments({}, (err_count_photo, count) => {
                                user.photos = count;
                                done_callback_photo(err_count_photo);
                            });
                        }, (err_count_photo) => { done_callback(err_count_photo) });
                }
                if (query === "comments") {

                    //fetch the photos count for each user
                    async.each(users,
                        (user, done_callback_comment) => {
                            var query_comment_count = Photo.where({ "comments.user_id": user._id });

                            query_comment_count.exec((err_comment_count, photos) => {


                                async.concat(photos, (photo, callback) => {
                                    let count = photo.userComments(user._id).length;
                                    callback(err_comment_count, count);

                                }, function (err_comment_count, results) {

                                    user.comments = results.reduce((prev, next) => prev + next, 0);
                                    done_callback_comment(err_comment_count);

                                });


                            })

                        }, (err_count_comment) => { done_callback(err_count_comment) });

                }
            }, (error) => {
                if (error) {
                    response.status(500).send(error);
                } else {
                    response.status(200).json(users);
                };

            });



    });
});


/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }
    var id = request.params.id;

    console.log(request.session.user_id);

    var query = User.findOne({ _id: id });


    query.select("first_name last_name location description occupation").exec(function (err, user) {
        if (err || user === null) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        response.status(200).json(user);
    });
});


app.get('/comments/:id', (request, response) => {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }
    var id = request.params.id;
    var query = Photo.where({ "comments.user_id": id });
    query.exec((err, photos) => {
        async.concat(photos, (photo, done_callback) => {
            let result = photo;
            result.comments = photo.userComments(id);
            result = JSON.parse(JSON.stringify(result));
            delete result._id;
            delete result.date_time;

            done_callback(err, result);


        }, (err, results) => {
            if (err) {
                response.status(500).send(err);
            }
            response.status(200).json(results);


        });


    })

})



/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }
    var id = request.params.id;
    var query = Photo.where({ user_id: id });
    query.select("user_id comments file_name date_time").exec(function (err, photos) {
        if (err || photos === null) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        photos = JSON.parse(JSON.stringify(photos));
        async.each(photos, function (photo, done_callback_outer) {
            async.each(photo.comments, function (col, done_callback_inner) {
                let query = User.findOne({ _id: col.user_id });
                delete col.user_id;
                query.select("first_name last_name").exec(function (err_inner, user) {
                    user = JSON.parse(JSON.stringify(user));
                    col.user = user;
                    done_callback_inner(err_inner);
                });
            }, function (err_inner) {
                if (err_inner) {
                    response.status(500).send(JSON.stringify(err_inner));
                } else {
                    done_callback_outer(err_inner);
                }
            });

        }, function (err_outer) {
            if (err_outer) {
                response.status(500).send(JSON.stringify(err_outer));
            } else {
                response.status(200).send(photos);
            }
        })




    });

});

app.post("/admin/login", async (request, response) => {

    let user = await User.findOne({ login_name: request.body.username });
    if (user == null) {
        response.status(400).send("can't find user id");
    } else {
        if (cs142password.doesPasswordMatch(user.digest, user.salt, request.body.password)) {
            request.session.user_id = user._id;
            response.status(200).send(user._id);
        }
        else {
            response.status(400).send("fuck you password");

        }

    }
});

app.post("/admin/logout", (request, response) => {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }

    response.status(200).end();
    request.session.destroy(function (err) { });


});

app.post("/admin/user", async (request, response) => {
    try {
        let user = await User.findOne({ login_name: request.body.login_name });
        if (user !== null) {
            response.status(400).end();
        } else {
            try {
                const pass = cs142password.makePasswordEntry(request.body.password);
                request.body.digest = pass.hash;
                request.body.salt = pass.salt;
                delete request.password;
                console.log(request.body);
                user = new User(request.body);
                await user.save();
                console.log(user);
                response.status(200).end();
            } catch (error) {

                response.status(400).end("something went wrong");
            }


        }
    } catch (error) {
        console.log(error);
        response.status(400).end();
    }

});



app.post("/commentsOfPhoto/:photo_id", async (request, response) => {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }
    if (request.body.comment === "") {
        response.status(400).end();
        return;

    }
    try {
        const photo = await Photo.findById(request.params.photo_id);
        console.log(photo);
        const comment = new Comment({
            comment: request.body.comment,
            date_time: new Date(),
            user_id: request.session.user_id
        });
        photo.comments.push(comment);
        await photo.save();
        response.status(200).send(photo);

    } catch (error) {
        console.log(error);
        response.status(400).send(error);
    }




});

app.post("/photos/new", (request, response) => {
    if (!request.session.user_id) {
        response.status(401).end();
        return;
    }
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            // XXX -  Insert error handling code here.
            response.status(400).end();
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes

        // XXX - Do some validation here.
        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        const timestamp = new Date().valueOf();
        const filename = 'U' + String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            if (err) {
                console.log("couldn't create the image on disk");
                response.status(400).end();
                return;
            }
            Photo.create({
                file_name: filename,
                date_time: new Date(),
                user_id: request.session.user_id,
                comments: []
            }, (err, photo) => {
                if (err) {
                    console.log("could't save the photo in the db");
                    response.status(400).end();
                    return
                }

                response.status(200).json(photo);
            })

            // XXX - Once you have the file written into your images directory under the name
            // filename you can create the Photo object in the database
        });
    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


