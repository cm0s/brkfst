/**
 * This script offer a few functions to automatically resize an iframe located in the same domain root domain.
 *
 * This script requires the following libraries:
 *  - jquery (https://github.com/jquery/jquery) [tested with v1.9.0]
 *  - jquery-resize (https://github.com/cowboy/jquery-resize) [tested with v1.1]
 *
 * Prerequisite
 * =============
 * To work, the page which load this script must be called from an iframe. This iframe must be located
 * on a server which is inside the domain specified by the rootDomain variable. The page which holds the iframe must
 * declare the following javascript code: document.domain='yourrootdomain.ch'.
 *
 * How it works
 * ============
 * When the iframeplus.js is loaded the init function is automatically called.
 * This initialization performs a few actions :
 *  1. Activate an option to enable cross-domain communication.
 *  2. Automatically resize the iframe once the nested iframe's page has finished to load.
 *  3. Activate an event which automatically resize the iframe when the nested iframe's page content is resized (for
 *     example, when the client browser is stretched by the user which makes the page elements/texts to wrap).
 *     (see $(window).resize() event.)
 *  4. (optional) Enable automatic resizing when DOM is modified
 *     Unfortunately, the $(window).resize() can not detect the content resizing when a DOM element is dynamically
 *     added/modified/removed, for example when using AJAX techniques. To overcome this issue, this script offer
 *     a function (addDomResizeListenerIfCssSelectorSetOnIframe()) which triggers automatically a call to the resizeIframe()
 *     function whenever a size modification is detected on a specified DOM element.
 *     This function use the jQuery resize event plugin developed by Ben Alman.
 *
 *  5. Then, it's also possible to manually resize the iframe or even manually add automatic resize listener (useful when an
 *     element is dynamically added after the initial page load occured).
 *
 *    Here is a description of the Ben Alman jQuery resize event plugin :
 *    --------------------------------------------------------------------
 *    >*Why is a plugin needed for the resize event?*
 *    >Long ago, the powers-that-be decided that the resize event would only fire on the browserâ€™s window object.
 *    >Unfortunately, that means that if you want to know when another element has resized, you need to manually test
 *    >its width and height, periodically, for changes. While this plugin doesn't do anything fancy internally to
 *    >obviate that approach, the interface it provides for binding the event is exactly the same as whatâ€™s already
 *    >there for window.
 *
 *    >For all elements, an internal polling loop is started which periodically checks for element size changes and
 *    >triggers the event when appropriate. The polling loop runs only once the event is actually bound somewhere, and
 *    >is stopped when all resize events are unbound.
 *
 *    >*What about window resizing?*
 *    >Because the window object has its own resize event, it doesn't need to be provided by this plugin, and its
 *    >execution can be left entirely up to the browser. However, since certain browsers fire the resize event
 *    >continuously while others do not, this plugin throttles the window resize event (by default), making event
 *    >behavior consistent across all elements.
 *
 *    >Of course, you could just set the jQuery.resize.throttleWindow property to false to disable this, but why would
 *    >you?
 *
 * How to use it
 * ==============
 * 1. Add the following scripts to the parent page (where are located the iframes)
 *    - <script type="text/javascript" src="[path_to_jquery.js"></script>
 *    - <script type="text/javascript" src="[path_to_jquery-resize.js"></script>
 *    - <script type="text/javascript" src="[path_to_iframeplus.js"></script>
 *
 * 2. Ensure each pages of the website displayed in the iframe(s) has the following javascript (must be the same as the
 *    rootDomain variable set in this script):
 *    - <script type="text/javascript" src="[path_to_jquery.js">
 *        document.domain="yourrootdomain.ch"
 *      </script>
 *
 * 3. (optional) activate the automatic resize on a specific DOM element (for example on <div class="content">...</div>)
 *    Add the "data-dom-resize-listener" attribute on the iframe(s) which will use the  DOM Resize Listener.
 *    - <iframe src="https://myapp.unige.ch" data-dom-resize-listener="div.content"></iframe>
 *
 * 4. (optional) manually resize the iframe from an embedded webpage :
 *     - top.iframeplus.resizeIframe(window.frameElement,250);
 *    or from the parent page (where are located the iframe(s):
 *     - iframeplus.resizeIframe($('#myiframe'),250);
 *
 *    it's also possible to omit the height (current iframe body content will be used as height). Make sure the body
 *    content is already loaded.
 *     - top.iframeplus.resizeIframe(window.frameElement);
 *    or from the parent page :
 *     - iframeplus.resizeIframe($('#myiframe'));
 *
 * 5. (optional) manually add automatic resize listeners :
 *     - top.iframeplus.addAllListeners(window.frameElement);
 *    or from the parent page :
 *     - iframeplus.addAllListeners($('#myiframe'));
 *
 * License
 * ========
 * Copyright (c) 2013 University of Geneva.
 * This program is distributed under the terms of the GNU General Public License.
 *
 * Version
 * ========
 * 2.5
 *
 * Author
 * =======
 * Nicolas Forney (nicolas.forney@unige.ch)
 */


;
(function ($, document, window, undefined) {
  'use strict';

  /* Root domain used to authorize cross domain communications (all web pages must be hosted on a sub-domain of
   this root domain) */
  var rootDomain = 'unige.ch';

  /**
   * This init function is automatically called when running this module.
   */
  function init() {
    document.domain = rootDomain;
    $(document).ready(function () {
      $('iframe').each(function () {
        addAllListeners(this);
      });
    });
  }

  /**
   * Resize an iframe with its content height .
   * @param height Optional parameter which specifies the height at which the iframe must be resized. If not
   * set or < 0, the current iframe document height (based on the iframe.contentDocument.body element) will be used.
   * When the height parameter is > 0, others listeners bind to the iframe are automatically unbind. It will be necessary
   * to reset them manually if needed (see addAllListeners(iframe) function).
   * @param iframe DOM element to resize
   */
  function resizeIframe(iframe, height) {
    try {
      if (height >= 0) {
        removeAllListeners(iframe);
        $(iframe).stop().animate({height: height + 'px'}, 250);
      } else {
        if (iframe.contentDocument && iframe.contentDocument.body) { //Avoid resizing when body is not defined
          height = iframe.contentDocument.body.clientHeight || iframe.contentDocument.body.offsetHeight || iframe.contentDocument.body.scrollHeight;
          $(iframe).height(height);
        }
      }
    } catch (ex) {
      //Do nothing
    }
  }

  function removeDomResizeListenerIfCssSelectorSetOnIframe(iframe) {
    var domCssSelector = $(iframe).attr('data-dom-resize-listener');
    if (domCssSelector !== '') {
      var domElement = $(iframe).contents().find(domCssSelector);
      $(domElement).unbind('resize');
    }
  }

  /**
   * Automatically resize an iframe when its window object is resized (each iframe has its own window object)
   */
  function addIframeWindowResizedListener(iframe) {
    $(window, iframe).resize(function () {
      resizeIframe(iframe);
    });
  }

  /**
   * Automatically resize an iframe when its static content is loaded (doesn't works for content loaded
   * asynchronously)
   */
  function addIframeContentLoadedListener(iframe) {
    $(iframe).load(function () {
      resizeIframe(iframe);
    });
  }

  /**
   * Activate for an iframe an automatic resize if the iframe attribute data-dom-resize-listener is filled in on the
   * iframe tag, otherwise do nothing.
   * Once this function is run, the DOM element automatically calls the resizeIframe() function each time the
   * DOM element size changes.
   * This function use the jquery-ba-resize library which makes possible the use of a resize event on all DOM elements.
   * The iframe id id passed to the resize event of the jquery-ba-resize library which is needed by the library.
   */
  function addDomResizeListenerIfCssSelectorSetOnIframe(iframe) {
    // Retrieve the CSS selector located on the iframe attribute 'data-dom-resize-listener'.
    var domCssSelector = $(iframe).attr('data-dom-resize-listener');
    if (domCssSelector !== '') {
      $(iframe).load(function () {
        var domElement = $(iframe).contents().find(domCssSelector);
        var domElementId = $(iframe).attr('id');
        domElement.resize(domElementId, function () {
          resizeIframe(iframe);
        });
      });
    }
  }

  /**
   * Add the DomResizeListener, the IframeContentLoadedListener and the IframeWindowResizedListener to the iframe
   * element passed as parameter
   */
  function addAllListeners(iframe) {
    addIframeContentLoadedListener(iframe);
    addIframeWindowResizedListener(iframe);
    addDomResizeListenerIfCssSelectorSetOnIframe(iframe);
  }

  /**
   * Remove the DomResizeListener, the IframeContentLoadedListener and the IframeWindowResizedListener from the iframe
   * element passed as parameter
   */
  function removeAllListeners(iframe) {
    $(iframe).unbind('load');
    $(window, iframe).unbind('resize');
    removeDomResizeListenerIfCssSelectorSetOnIframe(iframe);
  }

  //Public functions declaration
  window.iframeplus = {
    resizeIframe: resizeIframe,
    addAllListeners: addAllListeners,
    removeAllListeners: removeAllListeners
  };

  init();
})(jQuery, document, this);