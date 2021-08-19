# 📊 Impact Score Visualization (CS5965 & SIRIUS)

This code summarizes the visualization designs of Smriti Bajaj, Emily Colladay,
and Xiaobo Qian for SIRIUS Global, a Rome-based NGO with the mission to foster a
network of innovators across the world. The visualizations created intend to
give its audience an engaging look into the organization's imapct score system,
depicted as a choropleth map.

## 🗺 Data Visualization Design

For our design process, we offer two different implementations of such a map,
one uisng the Google Charts API, and the other PixiJS. This offers different
versions with the same core functionality of displaying SIRIUS' code in a
geographical manner. To manage the data, we have also included Strapi as our
CMS, with which we created a login page.

## 🛠 Setup

1.  "npm install --global http-server" Nodejs and Node package manager must be installed beforehand

2.  Google charts:  
    Navigate to the folder where the "Google charts" folder is cloned. Open Command prompt there. Type "http-server" in cmd/shell

    Leaflet and Pixi visualization:  
    Navigate to the root folder cloned. Type "http-server" in cmd/shell.

3.  Navigate to any browser and open "localhost:8080".

4.  Strapi Google and Linkedin log in require platform and Strapi backend configuration and frontend pages for receiving and sending token. Please refer to https://strapi.io/documentation/developer-docs/latest/development/plugins/users-permissions.html#providers
