# Static

This directory contains your static files. These are files that do not require any additional processing. If you just want to serve an image and call it using a relative url in CSS or in your .vue templates, the static folder is perfect for this.

In contrast, the `/assets` folder is for assets that need further processing, such as .scss files.

Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

All of ther files in the root are related to favicons for various platforms, including `site.webmanifest` and `browserconfig.xml`. For more info on these files, read [this FAQ](https://realfavicongenerator.net/faq).

The favicons and related files in this project were generated from [realfavicongenerator.net](https://realfavicongenerator.net/). You could use it for your own favicon as well, if you choose.

## img Folder

Any images needed for the site are here. This works fine if your site has few images.

On a larger site with more images, you will want to use a CDN to host your images so they load faster, and have an image uploading system that can generate optimized images. 

One solution for this is to install Wordpress on a subdomain of your website (with this site and Wordpress both behind NGINX) and put all your images in Wordpress's media folder. Then install your favorite Wordpress CDN plugin to manage your image assets. Wordpress can handle all the little details like image resizing, thumbnails, uploading and versioning. Then use the image URL that Wordpress provides to call your images on the main site. As a bonus, Wordpress can provide a blog for your site.

A newer option is [nuxt/image](https://nuxtjs.org/docs/2.x/directory-structure/assets#static), which allows you to put full-size images in your static folder and they will be resized automatically for production, in the `build` step.

## More info
[Nuxtjs.org - Static Directory](https://nuxtjs.org/docs/2.x/directory-structure/assets#static)

[image.nuxtjs.org - Nuxt/Image Plugin](https://image.nuxtjs.org/)

[realfavicongenerator.net -- Favicon Generator](https://realfavicongenerator.net/)
