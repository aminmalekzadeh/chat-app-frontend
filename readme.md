<div id="top"></div>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://res.cloudinary.com/dzft1lfjv/image/upload/v1644007445/android-chrome-512x512_vwclot.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Chat App Massenger</h3>

  <p align="center">
    A chat app massenger with expressjs and reactjs
    <br />
    <a href="#contact"><strong>Contact with developer »</strong></a>
    <br />
    <br />
    <a href="mailto: aminmalekzadeh004@gmail.com">Report Bug</a>
    ·
    <a href="mailto: aminmalekzadeh004@gmail.com">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot][product-screenshot]

This chat app is like Telegram, whatsapp and other messengers, you can send text,photo, file and other things.

Here's why:
* You can learn about how to create a chat app with nodejs and reactjs
* You can use of this chat app in your Business or you can use some part chat app
* This chat app is full open source and you can find and send bug from this chat app for me

Of course, no one template will serve all projects since your needs may be different. So I'll be adding more in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue. Thanks to all the people have contributed to expanding this template!


<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

This chat app created by many technology and used of sql and nosql for store data users and conversations

* [Node.js](https://nodejs.org/en/)
* [React.js](https://reactjs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Mysql](https://www.mysql.com/)
* [Express.js](https://expressjs.com/)
* [Material-UI](https://material-ui.com/)
* [Socketio](https://socket.io/docs/v4/)


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

You can run this chat app in localhost or your server and also you first should download and run chat app backend for download source (<a href="https://github.com/aminmalekzadeh/chat-app-backend"> click here. </a>)

### Prerequisites

For use of chat app, you should download npm
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_So to run the chat app properly, please go step by step._

1. Clone the repo
   ```sh
   git clone https://github.com/aminmalekzadeh/chat-app-frontend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your Domain in `src/utils/HttpService.js`
   ```js
     this.client = axios.create({
            baseURL: 'YOUR_DOMAIN',
            timeout: 1000
     });
   ```
  4. Run project chat app
   ```sh
     npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- CONTACT -->
## Contact

Amin Malekzadeh - [Linkedin](https://www.linkedin.com/in/aminmalekzadeh/) - aminmalekzadeh004@gmail.com

Project Link: [https://github.com/aminmalekzadeh/chat-app-frontend](https://github.com/aminmalekzadeh/chat-app-frontend)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

During the development of this route I have used the following resources!

* [Socketio document](https://socket.io/docs/v4/)
* [Material UI document](https://mui.com/getting-started/installation/)
* [Minimal UI document](https://docs-minimals.vercel.app/introduction)
* [7Learn.com](https://7Learn.com/)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: https://res.cloudinary.com/dzft1lfjv/image/upload/v1644007988/cover-chatapp_hxqst2.png
