#Holidale Maintenance App

The maintenance App is used by OP or housekeeping team. When we sent our OP staff for house maintenance, the staff can use the App to track the work order status, communicate with company on issues. Potentially, this App could be used by third party handyman to communicate with Holidale on repairs etc.

The platform shall improve our operation efficiency, improve communication and transparency, help management making informed decision, reduce guest complaints, save costs and increase holidale profit.

##Setting Up Developemnt Environment

 1. Install node from https://nodejs.org/en/
 
 2. After you have installed NodeJs install Yarn from https://yarnpkg.com/lang/en/.
    Yarn is node package manager which helps in downloading different open source packages which helps in development process.
 
 3. Now install Expo CLI, just run "npm install -g expo-cli".
    Expo CLI is the tool for building React Native apps with Expo.
    Expo CLI replaces our previous tools exp (a CLI) and XDE (a desktop app), by providing both an improved version of the familiar command-line interface and a graphical interface running in the browser.
    It is the tool to serve, share, and publish your projects. Using this tool you can easily test your code on your mobile app like an usual app using the Expo mobile app.
	
    Note: To test the app in simulator on your system you will need to install XCode(for MacOS).
 
Now after following all the above steps, clone the repository in your local system using the following command:
 `$ git clone https://bitbucket.org/holidale/holidale-maintenanceapp.git/wiki`
 
 Then go in the project's directory:
 `cd path/to/directory`
 
 And when inside the directory, run the following command to install the required packages:
 `yarn install`
 
Make sure that you get an IDE for this. I will suggest using Atom as it has all the required packages that will make the development easy.
  Link to Atom: https://atom.io/
  
 Now to run the project run "expo start" from project directory path.