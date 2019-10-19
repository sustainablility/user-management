# user-management
## Back-End-API
### Get User Information
* Get request to /user/info
* With parameter "token" in URL encode format
* response an encrypted JSON: <br>
{
            id: User ID,
            email: user email,
            following: users who have been following,
            stars: project which have been star,
            databases: user dataset,
            organization: originization,
            location: user location,
            personalDesc: personal description,
            databaseToken: databaseToken,
            databaseTokenTimeRemain: dataset Token expire time from now on
}

### Get User ID by Dataset Token
* Get request to /backend/getIdByDatabaseToken
* One parameter in URL encode format: "token", encrypted
* Response the encrypted user ID

## Font End
### Get User Information by User token
* Get request to /fontend/userinfo
* With parameter "token" in URL encode format
* response an JSON: <br>
{
            id: User ID,
            email: user email,
            following: users who have been following,
            stars: project which have been star,
            databases: user dataset,
            organization: originization,
            location: user location,
            personalDesc: personal description,
            databaseToken: databaseToken,
            databaseTokenTimeRemain: dataset Token expire time from now on
}