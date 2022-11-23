const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const qs = require('query-string');
app.use(cors());

// Constand
const urlToGetLinkedInAccessToken = 'https://www.linkedin.com/oauth/v2/accessToken';
const urlToGetUserProfile = 'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))'
const urlToGetUserEmail = 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))';
app.post('/publish', async (req, res) => {
    console.log(req)
    // const { userid, token, contenido} = req.body;
    // const errors = [];
    //
    // if(validator.isEmpty(userid)) {
    //     errors.push({ param: 'title', msg: 'Invalid value.'});
    // }
    // if(validator.isEmpty(token)) {
    //     errors.push({ param: 'text', msg: 'Invalid value.'});
    // }
    // if(validator.isEmpty(contenido)) {
    //     errors.push({ param: 'text', msg: 'Invalid value.'});
    // }
    //
    //
    // if(errors.length > 0) {
    //     res.json({ errors });
    // } else {
    //
    //
    //     try {
    //         publishContent(contenido, token);
    //         res.json({ success: 'Post published successfully.' });
    //     } catch(err) {
    //         res.json({ error: 'Unable to publish your post.' });
    //     }
    // }
});
app.get('/getUserCredentials', function (req, res) {
    let user = {};
    let code = req.query.code;

    getAccessToken(code)
        .then(response => {
            console.log(response.data)
            const accessToken = response.data["access_token"];
            const expireIn = response.data["expires_in"];
            getUserProfile(accessToken)
                .then(response => {
                    console.log(response.data)
                  let userProfile = {
                    id: response.data["id"],
                    firstName: response.data["localizedFirstName"],
                    lastName: response.data["localizedLastName"],
                    profileImageURL: response.data.profilePicture["displayImage~"].elements[0].identifiers[0].identifier
                  };

                  getUserEmail(accessToken)
                      .then(response => {
                        let userEmail = response.data.elements[0]["handle~"];
                        let resStatus = 400;
                        if (!(accessToken === null || userEmail === null)) {
                          user = userBuilder(userProfile, userEmail);
                          resStatus = 200;
                        }
                        // Here, you can implement your own login logic
                        // to authenticate new user or register him
                        res.status(resStatus).json({user, expireIn, accessToken});
                      })
                      .catch(error => console.log(error))

                  // I mean, couldn't they have burried it any deeper?
                })
                .catch(error => console.log(error))
        })
        .catch(err => {
            console.log(err)
            console.log("Error getting LinkedIn access token");
        })

})


app.get('/getUserCredentialsTokenIncorrecto', function (req, res) {
    let user = {};
    let code = req.query.code;

    getAccessToken(code)
        .then(response => {
            console.log(response.data)
            const accessToken = response.data["access_token"];
            const expireIn = response.data["expires_in"];
            getUserProfile(accessToken + 'sajlkdjas')
                .then(response => {

                })
                .catch(error =>{
                            res.status(error.response.status).json({error: error.response.data})
                }

                )
        })
        .catch((error) => {
            if (error.response) {
                res.status(error.response.status).json({error: error.response.data})
            }
        })

})


function publishContent(body, token) {
    const url = 'https://api.linkedin.com/v2/shares';
    const headers = {
        'Authorization': 'Bearer ' + token,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0',
        'x-li-format': 'json'
    };

    return new Promise((resolve, reject) => {
        request.post({ url: url, json: body, headers: headers}, (err, response, body) => {
            if(err) {
                reject(err);
            }
            resolve(body);
        });
    });

}

/**
 * Get access token from LinkedIn
 * @param code returned from step 1
 * @returns accessToken if successful or null if request fails
 */
function getAccessToken(code) {
    let accessToken = null;
    const config = {
        headers: {"Content-Type": 'application/x-www-form-urlencoded'}
    };
    const parameters = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:4200/linkedin",
        "client_id": '78q86zmiyhs1q0',
        "client_secret": 'vRbfzk5bAFKfAwvX',
    };
    return axios
        .post(
            urlToGetLinkedInAccessToken,
            qs.stringify(parameters),
            config)
}

/**
 * Get user first and last name and profile image URL
 * @param accessToken returned from step 2
 */
function getUserProfile(accessToken) {

    const config = {
        headers: {
            "Authorization": 'Bearer ' + accessToken
        }
    }
    return axios
        .get(urlToGetUserProfile, config)
}


/**
 * Get user email
 * @param accessToken returned from step 2
 */
function getUserEmail(accessToken) {
    const email = null;
    const config = {
        headers: {
            "Authorization": 'Bearer '+accessToken
        }
    };
    return  axios
        .get(urlToGetUserEmail, config)

}

/**
 * Build User object
 */
function userBuilder(userProfile, userEmail) {
    return {
        id: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        profileImageURL: userProfile.profileImageURL,
        email: userEmail.emailAddress
    }
}

app.listen(3000, function () {
    console.log(`Node server running...`)
});
