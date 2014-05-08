var Registrants = require("./index"),
    underscore = require('underscore'),
    registrants = Registrants.init({
      "host": "10.0.3.1",
      "username": "checkin",
      "password": "XURpHFj4XWb3CwEz",
      "database": "checkin",
      "port": 3306,
      "logging": true
    });

/*
registrants.getAttendee('E00019', function(reg) {
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
*/
/**
registrants.getRange(1, 50, 'S', function(reg) {
  console.log(reg);
});

registrants.searchAttendees(
 ["firstname"],
 "Jo",
 0,
 50,
 null,
 function(registrants) {
    console.log(registrants);
});



registrants.getCheckedInCount(function(count) {
   console.log(count);
});


registrants.initRegistrant(
    {
        eventId: "9124cf3e-d009-11e3-be0e-c3660b93c830",
        slabId: 2
    },
    function(reg) {
        console.log(reg);
    }
);



registrants.getRange(1, 50, 'S', function(reg) {
  console.log(reg);
});

registrants.searchAttendees(
[],
 "",
 0,
 50,
 null,
 function(registrants) {
    console.log(registrants);
});
**/

registrants.getAllCheckedInAttendees(
 function(registrants) {
    console.log(registrants);
});
