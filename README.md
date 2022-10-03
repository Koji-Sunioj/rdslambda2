notes
-----
full stack with amplify and lambda as proxy for server
------------------------------------------------------
1. create react app as normal
2. amplify init
3. npm install aws-amplify @aws-amplify/ui-react
4. amplify init
5. amplify add api -> choose rest api with lambda, path is complaints/{id}
        * make sure it's public for the client
6. go to the folder of the lambda function -> npm install pg
7. amplify push
8. edit api gateway : add two methods under complaints/ for get and post, then three under complaints/{id} for get, patch and delete.
        * make sure lambda integration is checked for each method, add lambda function name from init and save. then deploy
        * might be useful to enable cors on all methods
9. edit the lambda function : import pg, add hostname, password and eveything
        * amplify bootstraps the lambda with its own role. make sure to add AmazonRDSFullAccess to the exection role AWSLambdaVPCAccessExecutionRole
        * add the same vpc of the rds instance to the vpc. make sure that custom tcp 5432 is shown in inbound and outbound rules
        * cors errors are caused by the lambda function not returning proper header. can set the header in the response object in the lambda function.

note: the changes in the cloud for api gateway and lambda security groups, execution roles are not overridden when you add code to the lambda function
note 3.10 : lambda must be configured with a nat gateway to access ssm since its deployed in vpc. when i remove the vpc it still works okay, as well as ssm

10. npm install @aws-sdk/client-secrets-manager
11. add the code for retrieving the secret in the function as needed


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
