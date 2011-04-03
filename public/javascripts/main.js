
var j = $;

j(document).keypress(function(event){
  // a
  if (97 == event.keyCode) showAddItemForm();
});

j(function(){
  // add item
  j('#add-item-form')
    .find('p:not(.actions)')
    .hide()
    .end()
    .find('#add-item')
    .click(function(){
      var inputs = j('#add-item-form p:not(.actions)')
        , data;
      if (inputs.is(':visible')) {
        data = j('#add-item-form').serialize();
        j.post('/item', data, function(res){
          response(res);
          if (!res.error) {
            hideAddItemForm();
            j('#items').removeClass('hide');
          }
        });
      } else {
        showAddItemForm();
      }
      return false;
    });

  // remove item
  j('#items .delete a').live('click', function(){
    var self = j(this);
    confirm('Delete this item?', function(ok){
      if (ok) {
        var url = self.attr('href');
        remove(self.parents('tr'));
        j.post(url, { _method: 'DELETE' }, response);
      }
    });
    return false;
  });
});

function notify(type, msg, duration) {
  if (!msg) msg = type, type = 'info';
  duration = duration || 2000;
  var el = j('<li class="' + type + '">' + msg + '</li>');
  j('#notifications').append(el);
  setTimeout(function(){ remove(el); }, duration);
}

function confirm(msg, fn) {
  var dialog = j(j('#confirm').html())
    , overlay = j('#overlay');

  function reply(val) {
    return function(){
      overlay.addClass('hide');
      dialog.remove();
      fn(val);
    };
  }

  dialog.find('.message').text(msg);
  dialog.find('.ok').click(reply(true));
  dialog.find('.cancel').click(reply(false));
  dialog.appendTo('body');
  overlay.removeClass('hide');
}

function remove(el) {
  j(el).fadeOut(function(){
    j(el).remove();
  });
}

function response(res) {
  if (res.error) {
    notify('error', res.error);
  } else {
    if (res.message) notify(res.message);
    if (res.prepend) j(res.to).prepend(res.prepend);
  }
}

function showAddItemForm() {
  j('#add-item-form p:not(.actions)').show();
}

function hideAddItemForm() {
  j('#add-item-form p:not(.actions)').hide();
}