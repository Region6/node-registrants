var Registrants = require("./index"),
    underscore = require('underscore'),
    registrants = Registrants.init({
      "host": "10.0.3.1",
      "username": "checkin",
      "password": "XURpHFj4XWb3CwEz",
      "database": "checkin",
      "port": 3306
    });

registrants.getAttendee(1, 'E', function(reg) {
    console.log(reg);
    var values = {
      event_id: '84a8873a-92d5-11e3-a3e0-2b963df5580f',
      local_id: 1,
      fields: underscore.extend(reg.fields, {
        "firstname": "ERNIE1",
        "lastname": "SMITH1"
      })
    };

    registrants.updateExhibitorAttendee(1, values, function(reg) {
        console.log(reg);
    });
});


