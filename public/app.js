const BobSheet = 'https://spreadsheets.google.com/feeds/list/1GqW4dY5DSUZ4Qkg7NnbKBrQnaw9goNooarjb1IgqYac/od6/public/values?alt=json';
const dayNames = {
  'Monday': '월요일',
  'Tuesday': '화요일',
  'Wednesday': '수요일',
  'Thursday': '목요일',
  'Friday': '금요일'
};

const today = moment();


$(function() {
  var source   = $("#menus-template").html();
  var template = Handlebars.compile(source);

  $.getJSON(BobSheet, function (json) {
    var menus = [];
    var month = '';
    var weekCount = 0;

    json.feed.entry.forEach(function(menu) {
      var date = moment(menu['gsx$date'].$t.replace(/\./g, '-').slice(0,10));
      var isWeekHeader = +date.format('d') == 1;
      var weekHeader = '';
      var lunchMainMenu = (menu.gsx$lunch.$t || '').split(',')[0];
      var lunchSideMenu = (menu.gsx$lunch.$t || '').split(',').splice(1).join(',');

      if (isWeekHeader) {
        if (month === date.format('MM')) {
          weekCount++;
        } else {
          month = date.format('MM');
          weekCount = 1;
        }

        weekHeader = `${date.format('YYYY년 M월')} ${weekCount}주차 우아한 키친`;
      }

      if (date.isValid()) {
        menus.push({
          date: date.format('YYYY-MM-DD'),
          shortDate: date.format('MM월 D일'),
          isMorning: !!menu.gsx$breakfast.$t,
          morningTitle: menu.gsx$breakfast.$t || '&nbsp;',
          lunchMainMenu: lunchMainMenu,
          lunchSideMenu: lunchSideMenu,
          isWeekHeader: isWeekHeader,
          weekHeader: weekHeader,
          weekOfYear: date.format('wo'),
          isToday: date.format('YYYY-MM-DD') == today.format('YYYY-MM-DD'),
          dayName: dayNames[date.format('dddd')]
        });
      }
    });

    $('#menu').html(template({ menus: menus }));


    $('html, body').animate({
       scrollTop: $(`a[name=${today.format('wo')}]`).offset().top - 76
    }, 200);
  });
});
