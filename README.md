# Animeo
This is a stremio addon that uses the Anilist API to track your anime series/movies progress.

### How to use it
Go to the [addon configuration URL](https://7a625ac658ec-animeo.baby-beamup.club/configure), click on the **ANILIST LOGIN** button, follow the remaining instructions on the page.

Then just watch any anime through stremio Cinemeta's/Kitsu's catalog. I **strongly** recommend you use Kitsu though, since there's a bigger chance of the addon finding the anilist equivalent entry. 

### How does it work ?
Up to this edit there's no simple way (that i know) of detecting when an user finishes an episode or mark it as watched through the Stremio Addon SDK.

What I'm doing instead is using the `defineSubtitlesHandler` function to send a request with the current episode to the Anilist API. So, whenever you open a new episode the addon will try to update your lists.

### Limitations
* No Anilist catalog, which means the addon is trying to find the Anilist entry through the name provided by other meta providers (or converting the ID when coming from kitsu). I *do* plan to implement the catalogs *eventually*.

* Right now I'm supporting the Kitsu and Cinemeta catalogs, Kitsu has been working well but due to the way Cinemeta handle anime parts and seasons it'll probably get some entries wrong.

* AFAIK there's no way of giving the user feedback about success/errors during the requests. So the user needs to verify periodically if the addon is working as intended.

### Hosting the addon
To host the addon on your own machine you'll need to:
1. Create a new client in [Anilist]('https://anilist.co/settings/developer'). You'll need the client id.
2. While still on the client configuration page set the redirect url to `https://[your-addon-url]/configure`.
3. Change the `client_id` argument on the `href` attribute of the login button on the `/static/config.html` file.
4. Run `npm start -- --install`.

Feel free to open an issue if there is any doubt or problem.

### Support
If you like what I do consider buying me a coffee ;)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jenryk)
