# Group chat application backend

A simple node.js application built with express.

## Summary
We have the following requirements covered in this project:

* User registration and login: 
    - There are 2 types of users: Admin and non-admin (normal user)
    - Only Admins can add new users.
    - Admins can update users
* Groups:
    - Any user can list groups ( along with its members)
    - Any user can create groups
    - Any user can delete a group
    - Any user can add members to a group 
    - Any user can remove a member from a group
    - Any user can list messages in a group
* Messages:
    - Any user can like a message

## Schema
We have the following models in our db-
* User (username, password, isAdmin)
* Group (group name)
* Message (message content, userId, groupId)
* GroupUser (userId, groupId)
* UserLike (userId, messageId)

User and Group have a `many-to-many` relationship via GroupUser. 

User and Message have a `one-to-many` relationship.

User and *liked Message* have a `many-to-many` relationship via UserLike.


## Steps
### Environment setup- .env
Create `.env` file from the .env.example file in the same directory. Adjust the secrets in env file accordingly.
### Database setup
start the postgres database with docker:

`docker-compose up -d`.

You can also start the database using pgAdmin or any other tool.
### Database migrations
We are using `Prisma` as the ORM in this project. To create the schema in your database, you will have to apply the migrations (located in /prisma/migrations folder). Run this command to apply migrations: 

`yarn prisma migrate dev`

 if you are using `npm` or `pnpm` just replace yarn with your package manager name in the above command

### Start the application 🎉
`yarn start`

## APIs
To see the api documentation or run the endpoints on a browser go to `/api-docs` route, e.g. if your application is running locally on port `3000`, visit *`localhost:3000/api-docs`* on your browser.
