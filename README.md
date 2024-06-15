# Animeo
This is a Stremio addon that uses the AniList API to track your anime series/movie progress.

### How to use it
Go to the [addon configuration URL](https://7a625ac658ec-animeo.baby-beamup.club/configure), click on the **ANILIST LOGIN** button, and follow the remaining instructions on the page.

Then, just watch any anime through Stremio's Cinemeta or Kitsu catalogs. I **strongly** recommend using Kitsu, as the Kitsu ID of the anime will be converted to the equivalent AniList ID if there is an AniList entry available for the anime.

Movies watched through the Cinemeta catalog will have their IDs converted the same way, but series will be found by searching the AniList API with the name provided by Cinemeta, if you enable this option during configuration. This isn't recommended because it can often update your list with incorrect entries.

### How does it work?
Up to this edit, there's no simple way (that I know of) to detect when a user finishes an episode or marks it as watched through the Stremio Addon SDK.

What I'm doing instead is using the `defineSubtitlesHandler` function to send a request with the current episode to the AniList API. So, whenever you open a new episode, the addon will try to update your lists.

### Limitations
* No AniList catalog, which means the addon tries to find the AniList entry through the name provided by other meta providers (or converts the ID when coming from Kitsu, and Cinemeta for movies). I *do* plan to implement the catalogs *eventually*.

* Right now, I'm supporting the Kitsu and Cinemeta catalogs. Kitsu has been working well, but due to the way Cinemeta handles anime parts and seasons, it will probably get some entries wrong.

* AFAIK, there's no way of giving the user feedback about success/errors during the requests, so the user needs to verify periodically if the addon is working as intended.

### Hosting the addon
To host the addon on your own machine, you'll need to:
1. Create a new client in [AniList](https://anilist.co/settings/developer). You'll need the client ID.
2. While still on the client configuration page, set the redirect URL to `https://[your-addon-url]/configure`.
3. Change the `client_id` argument on the `href` attribute of the login button in the `/static/config.html` file.
4. Run `npm install`.
5. Run `npm start -- --install`.

Feel free to open an issue if there is any doubt or problem.

### Support
If you like what I do, consider buying me a coffee ;)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jenryk)
