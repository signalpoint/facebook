facebook
========

The Facebook module for DrupalGap.

# Getting Started

Install the InAppBrowser plugin (if you're in PhoneGap):

```
cordova plugin add org.apache.cordova.inappbrowser
```

Install these modules on your Drupal site:

 - https://www.drupal.org/project/fboauth
 - https://www.drupal.org/project/services_fboauth

Patch the Services FB OAuth module with these patches:

 - https://www.drupal.org/node/2376345#comment-9871053
 - https://www.drupal.org/node/2489598#comment-9928396

On your Drupal site, go to `admin/structure/services/list/drupalgap/resources`
and check the box next to "connect" in the "fboauth" section.

Next, create an app here:

 - https://developers.facebook.com/apps

Under "Advanced" settings in your app on Facebook, set the "Valid OAuth redirect
URIs" to:

 - https://www.facebook.com/connect/login_success.html
 
Download the openfb.js file from this project:

 - https://github.com/ccoenraets/OpenFB

Place it in your app's www directory, then patch the file with these patches:

 - https://github.com/ccoenraets/OpenFB/pull/49/files#diff-608308a045a8e30e23df61c1a95d0e6fR117
 - https://github.com/vielhuber/OpenFB/commit/6cff3852e4a04b377eb4f654265a2ba1431bd316?diff=split

Then include the openfb.js file in your index.html body before the
drupalgap_onload() call:

```
<!-- Load OpenFB -->
<script src="openfb.js"></script>
```

Turn on this module in your settings.js file:

```
Drupal.modules.contrib['facebook'] = {};
```

Include your Facebook app ID and scope(s) in your settings.js file:

```
drupalgap.settings.facebook = {
  app_id: '123456789',
  scope: 'email'
};
```

