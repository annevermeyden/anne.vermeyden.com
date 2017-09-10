(function(d, w, c) {
try {
  var byId = function(id) { return d.getElementById(id); }

  var modal = byId('modal');
  var container = byId('modal-background');

  var $ = function(selector) {
    return Array.prototype.slice.call(d.querySelectorAll(selector));
  };
  var on = function(el, eventNames, callback) {
    eventNames.split(/[ ,]/g).forEach(function(eventName) {
      eventName && el.addEventListener(eventName, callback, false);
    });
  };
  var clicked = null;
  var onClick = function(el, callback) {
    on(el, 'touchdown click', function(e) {
      if (e.type === 'touchdown') { e.preventDefault(); }
      clicked = this;
      callback.apply(this, arguments);
    });
  };
  var onKey = function(event) {
    var key = event.keyCode || event.which || event.code;

    // find next link and 'click' that
    var nextUp = null;
    if (key === 27 || key === 32) {
      event.preventDefault();
      return container.click();
    }
    else if (key === 37) { nextUp = clicked.parentNode.previousElementSibling; }
    else if (key === 39) { nextUp = clicked.parentNode.nextElementSibling; }

    if (nextUp) {
      nextUp.firstElementChild.focus();
      nextUp.firstElementChild.click();
    }
  };

  // When clicking the modal background, close the modal
  onClick(container, function() {
    // Remove anything inside the modal and then hide it
    modal.innerHTML = '';
    container.classList.remove('active');

    d.removeEventListener('keyup', onKey);
  });
  // Stop clicks from within the modal propagating to the background
  onClick(modal, function(e) { e.stopPropagation(); });

  // When clicking a gallery thumbnail, load it up in the modal
  $('#gallery a').forEach(function(link) {
    onClick(link, function(e) {
      e.preventDefault();

      d.removeEventListener('keyup', onKey);
      d.addEventListener('keyup', onKey, false);

      // Update the modal contents
      modal.innerHTML = '';
      modal.classList.remove('youtube');
      container.classList.add('active');

      if (link.classList.contains('image')) {
        var img = d.createElement('img');
        img.src = link.href;
        modal.appendChild(img);
      }
      else if(link.classList.contains('youtube')) {
        var div = d.createElement('div');
        modal.classList.add('youtube');
        div.classList.add('iframe-container');

        var playerEl = d.createElement('div');
        playerEl.id = 'modal-player';

        div.appendChild(playerEl);
        modal.appendChild(div);

        var player = new YT.Player('modal-player', {
          videoId: link.getAttribute('data-videoId'),
          events: {
            onReady: function() { player.playVideo(); },
          },
        });
      }
    });
  });

}catch(e) {
  // If I try to use a feature the browser doesn't support, error gracefully
  d.documentElement.className += 'no-js';
  c && c.info && c.info(e.stack);
}
}(document, window, window.location.search.match(/\bdebug\b/) && console));

// Google Analytics:
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-82096330-1', 'auto');
ga('send', 'pageview');
