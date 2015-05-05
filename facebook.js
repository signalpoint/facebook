/**
 * Implements hook_install().
 */
function facebook_install() {
  try {
    drupalgap_add_css(drupalgap_get_path('module', 'facebook') + '/facebook.css');
    openFB.init({
      appId: drupalgap.settings.facebook.app_id,
      tokenStore: window.localStorage
    });
  }
  catch (error) { console.log('facebook_install - ' + error); }
}

/**
 * Implements hook_deviceready().
 */
function facebook_deviceready() {
  try {
    openFB.getLoginStatus(function(loginStatus) {
        // Anonymous.
        if (loginStatus.status == 'unknown') {
          system_connect(_drupalgap_deviceready_options());
        }
        // Authenticated.
        else if (loginStatus.status == 'connected') {
          facebook_connected(loginStatus.authResponse.token);
        }
    });
    return false;
  }
  catch (error) { console.log('facebook_deviceready - ' + error); }
}

/**
 * Implements hook_services_request_pre_postprocess_alter().
 */
function facebook_services_request_pre_postprocess_alter(options, result) {
  try {
    if (options.service == 'fboauth' && options.resource == 'connect') { 
      Drupal.sessid = result.token;
    }
    else if (options.service == 'user' && options.resource == 'logout') {
      openFB.logout();
    }
  }
  catch (error) { console.log('facebook_services_request_pre_postprocess_alter - ' + error); }
}

/**
 * Implements hook_form_alter().
 */
function facebook_form_alter(form, form_state, form_id) {
  try {
    if (form_id == 'user_login_form' || form_id == 'user_register_form') {
      form.buttons['facebook'] = {
        title: 'Continue with Facebook',
        attributes: {
          'class': '.ui-nodisc-icon',
          onclick: "facebook_onclick()",
          'data-icon': 'info' // we place any icon here, then overwrite it with css
        }
      };
    }
  }
  catch (error) { console.log('facebook_form_alter - ' + error); }
}

/**
 *
 */
function facebook_onclick() {
  try {
    openFB.login(
      function(response) {
        if (response.status === 'connected') {
          facebook_connected(response.authResponse.token);
        }
        else if (response.error) { drupalgap_alert(response.error); }
      },
      { scope: drupalgap.settings.facebook.scope }
    );
  }
  catch (error) { console.log('facebook_onclick - ' + error); }
}

/**
 *
 */
function facebook_connected(token) {
  try {
    fboauth_connect(token, {
        success: function(result) {
          if (result.user) {
            system_connect(_drupalgap_deviceready_options({ reloadPage: true }));
          }
        },
        error: function(xhr, status, message) {
          if (status == 406 && message[0].indexOf('Already logged in as')) {
            system_connect(_drupalgap_deviceready_options());
          }
        }
    });
  }
  catch (error) { console.log('facebook_connected - ' + error); }
}

/**
 * services_fboauth connect implementation.
 */
function fboauth_connect(token, options) {
  try {
    options.method = 'POST';
    options.path = 'fboauth/connect.json';
    options.data = JSON.stringify({
        access_token: token
    });
    options.service = 'fboauth';
    options.resource = 'connect';
    Drupal.services.call(options);
  }
  catch (error) { console.log('fboauth_connect - ' + error); }
}
