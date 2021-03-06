(function() {
  var args, detailLoader, easyStateList, globalStateFlag, init, starClick, update;

  easyStateList = ['readed', 'stared'];

  globalStateFlag = 0;

  args = new Object();

  detailLoader = function(type, id, force) {
    if (type === 'file') return;
    return chrome.extension.sendMessage({
      op: 'detail',
      force: force,
      data: {
        type: type,
        id: id
      }
    }, function(response) {
      var d, preTarget;
      d = response.data;
      $('body').addClass(response.type);
      if (response.type === 'notification') {
        $('.noti-wrap').show();
        $('.title').text(d.detail.title);
        try {
          $('.content').html(d.detail.content);
        } catch (_error) {}
        preTarget = $('.content');
        if (!preTarget.html().match(/<[a-zA-Z]+[^>]*>/)) {
          preTarget.wrapInner('<pre style="width:700px;"/>');
        }
        $('.date').text(new Date(d.day).Format("yyyy-MM-dd"));
        $('.courseName').text(d.courseName);
        $('.author').text(d.author);
      } else if (response.type === 'deadline') {
        $('.ddl-wrap').show();
        $('.title').text(d.detail.title);
        try {
          $('.content').html(d.detail.content);
        } catch (_error) {}
        $('.date').text(new Date(d.end).Format("yyyy-MM-dd"));
        $('.courseName').text(d.courseName);
        try {
          $('.uploadText').html(d.detail.uploadText);
        } catch (_error) {}
        $('.uploadAttach').html(d.detail.uploadAttach);
        $('.attach').html(d.detail.attach);
      }
      $('.loading').hide();
      $('.action-refresh').removeClass('icon-spin');
      if (d.state === 'stared') {
        $('.action-star').addClass('is-stared');
        return globalStateFlag = 1;
      } else {
        $('.action-star').addClass('is-readed');
        return globalStateFlag = 0;
      }
    });
  };

  init = function() {
    args = window.getURLParamters(window.location.href.replace(/#*$/, ''));
    detailLoader(args.type, args.id, false);
    $('.action-refresh').click(function(e) {
      e.preventDefault();
      return update();
    });
    return $('.action-star').click(function(e) {
      e.preventDefault();
      return starClick();
    });
  };

  update = function() {
    $('.action-refresh').addClass('icon-spin');
    $('.loading').show();
    $('.noti-wrap').hide();
    $('.ddl-wrap').hide();
    detailLoader(args.type, args.id, true);
  };

  starClick = function() {
    $('.action-star').removeClass('is-' + easyStateList[globalStateFlag]);
    globalStateFlag = 1 - globalStateFlag;
    chrome.extension.sendMessage({
      op: 'subState',
      data: {
        type: args.type,
        id: args.id,
        targetState: easyStateList[globalStateFlag]
      }
    });
    $('.action-star').addClass('is-' + easyStateList[globalStateFlag]);
  };

  $(function() {
    $('.action-refresh').addClass('icon-spin');
    $('.noti-wrap').hide();
    $('.ddl-wrap').hide();
    return init();
  });

}).call(this);
