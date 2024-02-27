# Getting Started with the Tree Cadastre iTwin Viewer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setting up your iTwin

After setting up your iTwin account, create a new iTwin by following [this tutorial](https://www.itwinjs.org/learning/tutorials/create-test-imodel-itwin-sync/) and register a single-page application by following [this tutorial](https://www.itwinjs.org/learning/tutorials/registering-applications/).

You will need to download the [iTwin Synchronizer](https://www.bentley.com/software/itwin-synchronizer/) to upload the tree cadastre file.

You can download the georeferenced tree cadastre of the city of Cologne [here](https://open.nrw/dataset/baumkataster-koeln-k). Download the zip-file from 06/2020 and save it to your local file system. It is important to not change the file names and to keep them all in the same folder.
Next, open the iTwin Synchronizer App and sign in using your iTwin account. In the top, choose your iTwin. Then add a new synchronization by clicking on the +New button. Enter the name of the synchronization, choose the iModel and set the file path to the folder where you saved the shapefile and the additional files of the tree cadastre. Select the shapefile and click next. Activate the Geospatial Connector and synchronize the file. The trees should now be shown as points in the iTwin viewer.
Download the shapefile zip-folder of the [Green Space Cadastre](https://offenedaten-koeln.de/dataset/gruenflaechenkataster-koeln-flaechentypen) and repeat the steps from above.

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file. Except for the client ID you can leave the variables that are already in the .env file.
The client ID can be found in the section my apps: https://developer.bentley.com/my-apps/

```
# ---- Authorization Client Settings ----
IMJS_AUTH_CLIENT_CLIENT_ID=""
IMJS_AUTH_CLIENT_REDIRECT_URI=""
IMJS_AUTH_CLIENT_LOGOUT_URI=""
IMJS_AUTH_CLIENT_SCOPES =""
```

- Scopes at least expected by the viewer are the following, but as said before, you do not need to change the ones entered in the .env file.

  - **Visualization**: `imodelaccess:read`
  - **iModels**: `imodels:read`
  - **Reality Data**: `realitydata:read`

- The application will use the path of the redirect URI to handle the redirection, it must simply match what is defined in your client. Here it should also already have the correct values in the .env file.

- When you are ready to build a production application, [register here](https://developer.bentley.com/register/). This is not important for testing and developing.

You should also add a valid iTwinId and iModelId for your user in the this file. For this, copy the IDs from your iModel by clicking on the three points. This can be found under My iTwins > IModels when you logged into your bentley developer account.

```
# ---- Test ids ----
IMJS_ITWIN_ID = ""
IMJS_IMODEL_ID = ""
```

- If at any time you wish to change the iModel that you are viewing, you can change the values of the iTwinId or iModelId query parameters in the url (i.e. localhost:3000?iTwinId=myNewITwinId&iModelId=myNewIModelId)

## Available Scripts

Before starting the server you have to run the following command in the directory where your project is located. Open the folder with the project in VS Code and open a new terminal. Make sure that you are in the correct directory where you saved the project and run:

### `npm install`

This will install all required dependencies.

In the project directory, you can run:

### `npm start`

This runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

The previous steps are sufficient to work on developing the iTwin. You should now have the tree cadastre running in your browser and can stop reading here.

## Continue Working

Some resources that can help you with further development of the tree cadastre:

- Examples of implemented building blocks in a sandbox: https://developer.bentley.com/samples/
- Tutorials for selected topics: https://developer.bentley.com/tutorials/
- Tutorials with Videos: https://developer.bentley.com/accreditation/
- The documentation: https://www.itwinjs.org/learning/
- All about developing the UI: https://itwinui.bentley.com/docs
- The discussion on github: https://github.com/iTwin/itwinjs-core/discussions

## Available Scripts (Addition that is not relevant when just starting out)

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Notes

If you are not using NPM, remove the `USING_NPM` env var from [.env](./.env)

## Next Steps

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/web-viewer-react)

- [Extending the iTwin Viewer](https://developer.bentley.com/tutorials/itwin-viewer-hello-world/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)
