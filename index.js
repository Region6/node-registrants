var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    async = require('async'),
    uuid = require("node-uuid"),
    glob = require('glob'),
    underscore = require('underscore'),
    Sequelize = require("sequelize"),
    exhFields = [
      {label: "First Name", id: "firstname", class:"firstname"},
      {label: "Last Name", id: "lastname", class:"lastname"},
      {label: "Title", id: "title", class:"title"},
      {label: "Site ID", id: "siteId", class:"siteid"},
      {label: "Company", id: "organization", class:"company"},
      {label: "Street 1", id: "address", class:"street1"},
      {label: "Street 2", id: "address2", class:"street2"},
      {label: "City", id: "city", class:"city"},
      {label: "State", id: "state", class:"state"},
      {label: "Zip", id: "zip", class:"zip"},
      {label: "Phone", id: "phone", class:"phone"},
      {label: "Email", id: "email", class:"email"}
    ],
    types = ['Text','Select','TextArea','Checkbox','Select','Text','Text','Text','Text'];


Registrants = function(options)
{
  this.db = {};
  this.models = {};
  this.options = options;
  if (this.options) {
    this.initialize(options);
  }
};

Registrants.prototype.initialize = function(options) {
  //console.log(this.options);
  this.db.checkin = new Sequelize(
    this.options.database,
    this.options.username,
    this.options.password,
    {
        dialect: 'mysql',
        omitNull: true,
        host: this.options.host || "localhost",
        port: this.options.port || 3306,
        pool: { maxConnections: 5, maxIdleTime: 30},
        define: {
          freezeTableName: true,
          timestamps: false
        },
        logging: this.options.logging || false
  });

  this.models.Events = this.db.checkin.define('event', {
    slabId:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    local_slabId :              { type: Sequelize.INTEGER },
    eventId:              { type: Sequelize.STRING(36) },
    local_eventId :              { type: Sequelize.INTEGER },
    title:              { type: Sequelize.STRING(255) },
    dtstart:             { type: Sequelize.DATE },
    dtend:             { type: Sequelize.DATE },
    dtstarttime :             { type: Sequelize.TEXT },
    dtendtime :             { type: Sequelize.TEXT },
    latefee :          { type: Sequelize.DECIMAL(10,2) },
    latefeedate:             { type: Sequelize.DATE },
    email:             { type: Sequelize.TEXT },
    max_registrations :              { type: Sequelize.INTEGER },
    registration_type:              { type: Sequelize.STRING(50) },
    topmsg:             { type: Sequelize.TEXT },
    cut_off_date:             { type: Sequelize.DATE },
    discount_type :              { type: Sequelize.INTEGER(2) },
    discount_amount :          { type: Sequelize.DECIMAL(10,2) },
    thksmsg:             { type: Sequelize.TEXT },
    thksmsg_set :              { type: Sequelize.INTEGER(4) },
    event_describe:             { type: Sequelize.TEXT },
    event_describe_set :              { type: Sequelize.INTEGER(4) },
    terms_conditions_set :              { type: Sequelize.INTEGER(4) },
    terms_conditions_msg:             { type: Sequelize.TEXT },
    category :              { type: Sequelize.INTEGER(1) },
    max_group_size :              { type: Sequelize.INTEGER(5) },
    ordering :              { type: Sequelize.INTEGER(7) },
    waiting_list :              { type: Sequelize.INTEGER(1) },
    public :              { type: Sequelize.INTEGER(1) },
    export :              { type: Sequelize.INTEGER(2) },
    use_discountcode :              { type: Sequelize.INTEGER(3) },
    article_id :              { type: Sequelize.INTEGER(11) },
    detail_link_show :              { type: Sequelize.INTEGER(2) },
    show_registrant :              { type: Sequelize.INTEGER(4) },
    publish :              { type: Sequelize.INTEGER(4) },
    startdate:             { type: Sequelize.DATE },
    bird_discount_type :              { type: Sequelize.INTEGER(2) },
    bird_discount_amount:              { type: Sequelize.STRING(12) },
    bird_discount_date:             { type: Sequelize.DATE },
    payment_option :              { type: Sequelize.INTEGER(2) },
    location_id :              { type: Sequelize.INTEGER(11) },
    archive :              { type: Sequelize.INTEGER(2) },
    partial_payment :              { type: Sequelize.INTEGER(2) },
    partial_amount:              { type: Sequelize.STRING(20) },
    partial_minimum_amount:              { type: Sequelize.STRING(20) },
    edit_fee :              { type: Sequelize.INTEGER(2) },
    cancelfee_enable :              { type: Sequelize.INTEGER(2) },
    cancel_date:              { type: Sequelize.STRING(30) },
    cancel_refund_status :              { type: Sequelize.INTEGER(1) },
    excludeoverlap :              { type: Sequelize.INTEGER(2) },
    pay_later_thk_msg_set :              { type: Sequelize.INTEGER(2) },
    pay_later_thk_msg:             { type: Sequelize.TEXT },
    thanksmsg_set :              { type: Sequelize.INTEGER(2) },
    thanksmsg:             { type: Sequelize.TEXT },
    change_date:              { type: Sequelize.STRING(20) },
    detail_itemid :              { type: Sequelize.INTEGER(4) },
    tax_enable :              { type: Sequelize.INTEGER(2) },
    tax_amount :          { type: Sequelize.DECIMAL(8,2) },
    payment_id :              { type: Sequelize.INTEGER(4) },
    repetition_id :              { type: Sequelize.INTEGER(7) },
    parent_id :              { type: Sequelize.INTEGER(7) },
    usercreation :              { type: Sequelize.INTEGER(3) },
    imagepath:              { type: Sequelize.STRING(255) },
    timeformat :              { type: Sequelize.INTEGER(2) },
    latefeetime :             { type: Sequelize.TEXT },
    bird_discount_time :             { type: Sequelize.TEXT },
    starttime :             { type: Sequelize.TEXT },
    cut_off_time :             { type: Sequelize.TEXT },
    change_time :             { type: Sequelize.TEXT },
    cancel_time :             { type: Sequelize.TEXT },
    user_id :              { type: Sequelize.INTEGER(7) },
    changefee_enable :              { type: Sequelize.INTEGER(2) },
    changefee_type :              { type: Sequelize.INTEGER(2) },
    changefee :          { type: Sequelize.DECIMAL(8,2) },
    cancelfee_type :              { type: Sequelize.INTEGER(2) },
    cancelfee :          { type: Sequelize.DECIMAL(8,2) },
    usetimecheck :              { type: Sequelize.INTEGER(1) },
    group_registration_type:              { type: Sequelize.STRING(20) },
    cancel_enable :              { type: Sequelize.INTEGER(1) },
    min_group_size :              { type: Sequelize.INTEGER(4) },
    admin_notification_set :              { type: Sequelize.INTEGER(2) },
    admin_notification:             { type: Sequelize.TEXT },
    partial_payment_enable :              { type: Sequelize.INTEGER(1) },
    prevent_duplication :              { type: Sequelize.INTEGER(1) },
    event_admin_email_set :              { type: Sequelize.INTEGER(4) },
    event_admin_email_from_name:              { type: Sequelize.STRING(100) },
    event_admin_email_from_email:              { type: Sequelize.STRING(100) },
    thanks_redirection :              { type: Sequelize.INTEGER(2) },
    thanks_redirect_url:              { type: Sequelize.STRING(255) },
    pay_later_redirection :              { type: Sequelize.INTEGER(2) },
    pay_later_redirect_url:              { type: Sequelize.STRING(255) },
    timezone:              { type: Sequelize.STRING(255) },
    registering:             { type: Sequelize.TEXT },
    uid:              { type: Sequelize.STRING(100)},
    usergroup:             { type: Sequelize.TEXT },
    discount_code_usagetype :              { type: Sequelize.INTEGER(2) },
    confirm_number_prefix:              { type: Sequelize.STRING(20) },
    badge_prefix:              { type: Sequelize.STRING(20) },
    reg_type:              { type: Sequelize.STRING(100) },
    member :              { type: Sequelize.INTEGER(1) },
    tax_exemption_allow :              { type: Sequelize.INTEGER(2) },
    tax_code_field_type:              { type: Sequelize.STRING(20) },
    tax_code_values:              { type: Sequelize.STRING(100) }
  });

  this.models.CheckinMemberFieldValues = this.db.checkin.define('member_field_values', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    local_id:             { type: Sequelize.INTEGER },
    event_id:             { type: Sequelize.STRING(36) },
    field_id:             { type: Sequelize.INTEGER },
    member_id:            { type: Sequelize.INTEGER },
    value:                { type: Sequelize.TEXT }
  });

  this.models.CheckinGroupMembers = this.db.checkin.define('group_members', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    groupMemberId :       { type: Sequelize.INTEGER },
    event_id :            { type: Sequelize.STRING(36) },
    groupUserId :         { type: Sequelize.INTEGER },
    created :             { type: Sequelize.DATE },
    confirmnum :          { type: Sequelize.STRING(100) },
    attend:               { type: Sequelize.BOOLEAN },
    discount_code_id :    { type: Sequelize.INTEGER },
    checked_in_time :     { type: Sequelize.DATE }
  });

  this.models.CheckinEventFields = this.db.checkin.define('event_fields', {
    id:             { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    local_id :       { type: Sequelize.INTEGER },
    event_id :       { type: Sequelize.STRING(36) },
    field_id :       { type: Sequelize.INTEGER },
    local_event_id :       { type: Sequelize.INTEGER },
    badge_order :       { type: Sequelize.INTEGER },
    class :       { type: Sequelize.TEXT },
    name :       { type: Sequelize.STRING(50) },
    label :       { type: Sequelize.STRING(255) },
    field_size:       { type: Sequelize.INTEGER },
    description :       { type: Sequelize.STRING(255) },
    ordering :       { type: Sequelize.INTEGER },
    published :       { type: Sequelize.INTEGER },
    required:       { type: Sequelize.INTEGER },
    values :       { type: Sequelize.TEXT },
    type :       { type: Sequelize.INTEGER },
    selected :       { type: Sequelize.STRING(255) },
    rows:       { type: Sequelize.INTEGER },
    cols:       { type: Sequelize.INTEGER },
    fee_field:       { type: Sequelize.INTEGER },
    fees :       { type: Sequelize.TEXT },
    new_line:       { type: Sequelize.INTEGER },
    textual :       { type: Sequelize.TEXT },
    export_individual :       { type: Sequelize.BOOLEAN },
    export_group :       { type: Sequelize.BOOLEAN },
    attendee_list :       { type: Sequelize.BOOLEAN },
    usagelimit :       { type: Sequelize.TEXT },
    fee_type :       { type: Sequelize.BOOLEAN },
    filetypes :       { type: Sequelize.TEXT },
    upload :       { type: Sequelize.BOOLEAN },
    filesize :       { type: Sequelize.INTEGER },
    hidden :       { type: Sequelize.BOOLEAN },
    allevent :       { type: Sequelize.BOOLEAN },
    maxlength :       { type: Sequelize.INTEGER },
    date_format :       { type: Sequelize.STRING(25) },
    parent_id :       { type: Sequelize.INTEGER },
    selection_values :       { type: Sequelize.TEXT },
    textareafee :       { type: Sequelize.TEXT },
    showcharcnt :       { type: Sequelize.BOOLEAN },
    default :       { type: Sequelize.BOOLEAN },
    confirmation_field :       { type: Sequelize.BOOLEAN },
    listing :       { type: Sequelize.TEXT },
    textualdisplay :       { type: Sequelize.BOOLEAN },
    applychangefee :       { type: Sequelize.BOOLEAN },
    tag :       { type: Sequelize.STRING(255) },
    all_tag_enable :       { type: Sequelize.BOOLEAN },
    minimum_group_size :       { type: Sequelize.INTEGER },
    max_group_size :       { type: Sequelize.INTEGER },
    discountcode_depend :       { type: Sequelize.BOOLEAN },
    discount_codes :       { type: Sequelize.TEXT },
    showed :       { type: Sequelize.INTEGER },
    group_behave :       { type: Sequelize.INTEGER }
  });

  this.models.CheckinBiller = this.db.checkin.define('biller', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId :              { type: Sequelize.INTEGER },
    eventId :             { type: Sequelize.STRING(36) },
    local_eventId :       { type: Sequelize.INTEGER },
    type :                { type: Sequelize.ENUM('I','G') },
    register_date :       { type: Sequelize.DATE },
    payment_type :        { type: Sequelize.STRING(100) },
    due_amount :          { type: Sequelize.DECIMAL(10,2) },
    pay_later_option:     { type: Sequelize.INTEGER },
    confirmNum :          { type: Sequelize.STRING(50) },
    user_id :             { type: Sequelize.INTEGER },
    payment_verified :    { type: Sequelize.INTEGER },
    pay_later_paid:       { type: Sequelize.INTEGER },
    discount_code_id :    { type: Sequelize.INTEGER },
    billing_firstname :   { type: Sequelize.STRING(150) },
    billing_lastname :    { type: Sequelize.STRING(150) },
    billing_address :     { type: Sequelize.STRING(255) },
    billing_city :        { type: Sequelize.STRING(150) },
    billing_state :       { type: Sequelize.STRING(150) },
    billing_zipcode :     { type: Sequelize.STRING(10) },
    billing_email :       { type: Sequelize.STRING(150) },
    due_payment :         { type: Sequelize.DECIMAL(10,2) },
    status :              { type: Sequelize.INTEGER },
    attend :              { type: Sequelize.BOOLEAN },
    paid_amount :         { type: Sequelize.STRING(30) },
    transaction_id :      { type: Sequelize.STRING(255) },
    memtot :              { type: Sequelize.INTEGER },
    cancel :              { type: Sequelize.INTEGER }
  });

  this.models.CheckinEventFees = this.db.checkin.define('event_fees', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    local_id :            { type: Sequelize.INTEGER },
    event_id :            { type: Sequelize.STRING(36) },
    user_id :             { type: Sequelize.INTEGER },
    basefee :             { type: Sequelize.STRING(20) },
    memberdiscount :      { type: Sequelize.STRING(12) },
    latefee :             { type: Sequelize.STRING(12) },
    birddiscount :        { type: Sequelize.STRING(12) },
    discountcodefee :     { type: Sequelize.STRING(12) },
    customfee :           { type: Sequelize.STRING(12) },
    tax :                 { type: Sequelize.STRING(12) },
    fee :                 { type: Sequelize.STRING(12) },
    paid_amount :         { type: Sequelize.STRING(12) },
    status :              { type: Sequelize.STRING(12), defaultValue: '0' },
    due:                  { type: Sequelize.STRING(20), defaultValue: '0' },
    payment_method:       { type: Sequelize.STRING(20), defaultValue: '0' },
    feedate :             { type: Sequelize.DATE },
    changefee :           { type: Sequelize.STRING(12), defaultValue: '0' },
    cancelfee :           { type: Sequelize.STRING(12), defaultValue: '0' }
  });

  this.models.CheckinBillerFieldValues = this.db.checkin.define('biller_field_values', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    local_id :            { type: Sequelize.INTEGER },
    event_id :            { type: Sequelize.STRING(36) },
    field_id :            { type: Sequelize.INTEGER },
    user_id :             { type: Sequelize.INTEGER },
    value :               { type: Sequelize.TEXT }
  });

  this.models.ElectionOffices = this.db.checkin.define('electionOffices', {
    id :                    { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    conferenceid :          { type: Sequelize.INTEGER },
    position :              { type: Sequelize.INTEGER },
    title :                 { type: Sequelize.STRING(255) },
    description :           { type: Sequelize.STRING(255) }
  });

  this.models.ElectionOfficeCandidates = this.db.checkin.define('electionOfficeCandidates', {
    id :                    { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    electionid :            { type: Sequelize.INTEGER },
    position :              { type: Sequelize.INTEGER },
    name :                  { type: Sequelize.STRING(255) },
    company :               { type: Sequelize.STRING(255) }
  });

  this.models.ElectionOffices.hasMany(this.models.ElectionOfficeCandidates, {as: 'Candidates', foreignKey: 'electionid'});

  this.models.Votes = this.db.checkin.define('votes', {
    id :                    { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    uuid :                  { type: Sequelize.UUIDV4 },
    siteid :                { type: Sequelize.STRING(255) },
    electionid :            { type: Sequelize.INTEGER },
    registrantid :          { type: Sequelize.STRING(25) },
    candidateid :           { type: Sequelize.INTEGER },
    votertype:              { type: Sequelize.ENUM('management','non-management') },
    datecast :              { type: Sequelize.DATE }
  });

  this.models.CheckinExhibitorAttendeeNumber = this.db.checkin.define('exhibitorAttendeeNumber', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId :              { type: Sequelize.INTEGER },
    eventId :             { type: Sequelize.STRING(255) },
    attendees :           { type: Sequelize.INTEGER }
  });

  this.models.CheckinExhibitorAttendees = this.db.checkin.define('exhibitorAttendees', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId :              { type: Sequelize.INTEGER },
    eventId :             { type: Sequelize.STRING(36) },
    firstname :           { type: Sequelize.STRING(255) },
    lastname :            { type: Sequelize.STRING(255) },
    address :             { type: Sequelize.STRING(255) },
    address2 :            { type: Sequelize.STRING(255) },
    city :                { type: Sequelize.STRING(255) },
    state :               { type: Sequelize.STRING(255) },
    zip :                 { type: Sequelize.STRING(15) },
    email :               { type: Sequelize.STRING(255) },
    phone :               { type: Sequelize.STRING(25) },
    title :               { type: Sequelize.STRING(255) },
    organization :        { type: Sequelize.STRING(255) },
    created :             { type: Sequelize.DATE },
    updated :             { type: Sequelize.DATE },
    siteId :              { type: Sequelize.STRING(10) },
    attend:               { type: Sequelize.BOOLEAN },
    checked_in_time :     { type: Sequelize.DATE }
  });

  this.models.Sites = this.db.checkin.define('siteIds', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    chapter:              { type: Sequelize.INTEGER(6) },
    memberType:           { type: Sequelize.STRING(255) },
    company:              { type: Sequelize.STRING(255) },
    street1:              { type: Sequelize.STRING(255) },
    street2:              { type: Sequelize.STRING(255) },
    city:                 { type: Sequelize.STRING(255) },
    state:                { type: Sequelize.STRING(255) },
    zipCode:              { type: Sequelize.STRING(255) },
    joinDate:             { type: Sequelize.DATE },
    paidDate:             { type: Sequelize.DATE },
    siteId:               { type: Sequelize.STRING(255) }
  });

  this.models.Transactions = this.db.checkin.define('transactions', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    transId : { type: Sequelize.INTEGER(11) },
    submitTimeUTC : { type: Sequelize.DATE },
    submitTimeLocal : { type: Sequelize.DATE },
    transactionType : { type: Sequelize.STRING(255) },
    transactionStatus : { type: Sequelize.STRING(255) },
    responseCode : { type: Sequelize.INTEGER(11) },
    responseReasonCode : { type: Sequelize.INTEGER(11) },
    responseReasonDescription : { type: Sequelize.STRING(255) },
    authCode : { type: Sequelize.INTEGER(11) },
    AVSResponse : { type: Sequelize.STRING(2) },
    cardCodeResponse : { type: Sequelize.STRING(2) },
    batchId : { type: Sequelize.INTEGER(11) },
    settlementTimeUTC : { type: Sequelize.DATE },
    settlementTimeLocal : { type: Sequelize.DATE },
    settlementState : { type: Sequelize.STRING(255) },
    invoiceNumber : { type: Sequelize.STRING(255) },
    description : { type: Sequelize.STRING(255) },
    authAmount : { type: Sequelize.DECIMAL(13,2) },
    settleAmount : { type: Sequelize.DECIMAL(13,2) },
    taxExempt: { type: Sequelize.INTEGER(1) },
    cardNumber : { type: Sequelize.STRING(50) },
    expirationDate : { type: Sequelize.STRING(10) },
    cardType : { type: Sequelize.STRING(100) },
    email : { type: Sequelize.STRING(255) },
    billToFirstName : { type: Sequelize.STRING(255) },
    billToLastName : { type: Sequelize.STRING(255) },
    billToAddress : { type: Sequelize.STRING(255) },
    billToCity : { type: Sequelize.STRING(255) },
    billToState : { type: Sequelize.STRING(255) },
    billToZip : { type: Sequelize.STRING(15) },
    billToPhoneNumber : { type: Sequelize.STRING(25) },
    shipToFirstName : { type: Sequelize.STRING(255) },
    shipToLastName : { type: Sequelize.STRING(255) },
    shipToAddress : { type: Sequelize.STRING(255) },
    shipToCity : { type: Sequelize.STRING(255) },
    shipToState : { type: Sequelize.STRING(255) },
    shipToZip : { type: Sequelize.STRING(15) },
    refTransId : { type: Sequelize.INTEGER(11) }
  });

};

Registrants.prototype.getAttendee = function(registrantId, callback){
  var regType = registrantId.slice(0,1),
      regId = parseInt(registrantId.slice(1), 10),
      returnCb = function(data) {
        callback(data);
      };
  if (regType == "E") {
    //console.log("Get Exhibitor Attendee");
    this.getExhibitorAttendee(regId, {}, returnCb);
  } else {
    //console.log("Get General Attendee");
    this.getRegistrant(regId, {}, returnCb);
  }
};

Registrants.prototype.getRegistrant = function(regId, options, callback){
  var obj = this;
  this.models.CheckinGroupMembers
  .find(regId)
  .success(function(member) {
    if (member !== null) {
      obj.createRegistrantModel(member.toJSON(), options, function(attendee) {
        attendee = underscore.extend(
          attendee,
          {
            local_id: attendee.userId,
            event_id: attendee.eventId,
            registrantId: attendee.event.badge_prefix + obj.pad(attendee.id, 5),
            displayId: attendee.event.badge_prefix + "-" + attendee.id,
            confirmation: attendee.confirmnum,
            badge_prefix: attendee.event.badge_prefix,
            biller_id: attendee.biller.userId
          }
        );
        callback(attendee);
      });
    } else {
      callback({});
    }
  })
};

Registrants.prototype.getExhibitorAttendee = function(regId, options, callback){
  var obj = this;
  this.models.CheckinExhibitorAttendees
  .find(regId)
  .success(function(member) {
    if (member !== null) {
      obj.createExhibitorModel(member.toJSON(), options, function(attendee) {
        attendee = underscore.extend(
          attendee,
          {
            local_id: attendee.userId,
            event_id: attendee.eventId,
            registrantId: attendee.event.badge_prefix + obj.pad(attendee.id, 5),
            displayId: attendee.event.badge_prefix + "-" + attendee.id,
            confirmation: attendee.biller.confirmNum,
            badge_prefix: attendee.event.badge_prefix,
            biller_id: attendee.biller.userId,
            badgeFields: [
              "firstname",
              "lastname",
              "title",
              "organization",
              "address",
              "address2",
              "city",
              "state",
              "zip",
              "phone",
              "email"
            ]
          }
        );
        callback(attendee);
      });
    } else {
      callback({});
    }
  })
};

Registrants.prototype.createRegistrantModel = function(attendee, options, cb) {
  var obj = this;
  attendee.memberId = attendee.groupMemberId;
  attendee.userId = attendee.groupUserId;
  attendee.eventId = attendee.event_id;
  async.waterfall([
    function(callback) {
      obj.getRegistrantFieldValues(attendee, function(values) {
        attendee = underscore.extend(attendee, values);
        var vals = obj.shallowCopy(values);
        attendee.fields = vals;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getRegistrantFields(attendee, function(fields) {
        attendee = underscore.extend(attendee, fields);
        callback(null, attendee);
      });
    },
    function(attendee, callback){
      obj.getRegistrantBadgeFields(attendee, function(values) {
        attendee = underscore.extend(attendee, values);
        callback(null, attendee);
      });
    },
    function(attendee, callback){
      obj.getEvent(attendee, function(event) {
        attendee.event = event;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getBiller(attendee, function(values) {
        attendee.biller = values;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getBillerFieldValues(attendee, function(values) {
        var fieldVals = obj.shallowCopy(values),
            test = obj.shallowCopy(values),
            attendeeFields = obj.shallowCopy(attendee.fields);
        //attendee = underscore.extend(fieldVals, attendee);
        //attendee.fields = {};
        attendee.fields = underscore.extend(fieldVals, attendeeFields);
        attendee = underscore.extend(test, attendee);
        attendee.biller = underscore.extend(attendee.biller, values);
        callback(null, attendee);
      });
    },
    function(attendee, callback){
      obj.getPayments(attendee, function(payments) {
        attendee = underscore.extend(attendee, payments);
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getCreditTrans(attendee, function(values) {
        attendee.creditCardTrans = values;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      if (!options.excludeLinked) {
        obj.getAdditionalAttendees(attendee, function(attendees) {
          attendee.linked = attendees;
          callback(null, attendee);
        });
      } else {
        callback(null, attendee);
      }
    },
    function(attendee, callback) {
      async.each(
        attendee.badgeSchema,
        function(field, callback) {
          attendee[field.class] = attendee[field.id] || "";
          callback(null);
        },
        function(err) {
          callback(null, attendee);
        }
      );
    }
  ],function(err, results) {
      cb(results);
  });
};

Registrants.prototype.createExhibitorModel = function(attendee, options, cb) {
  var obj = this;
  attendee.fields = this.shallowCopy(attendee);
  async.waterfall([
    function(callback){
      obj.getEvent(attendee, function(event) {
        attendee.event = event;
        callback(null, attendee);
      });
    },
    function(attendee, callback){
      obj.getExhibitorFields(attendee, function(fields) {
        attendee = underscore.extend(attendee, fields);
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getBiller(attendee, function(values) {
        attendee.biller = values;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getBillerFieldValues(attendee, function(values) {
        attendee.biller = underscore.extend(attendee.biller, values);
        callback(null, attendee);
      });
    },
    function(attendee, callback){
      obj.getPayments(attendee, function(payments) {
        attendee = underscore.extend(attendee, payments);
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getCreditTrans(attendee, function(values) {
        attendee.creditCardTrans = values;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getExhibitorAttendeesNumber(attendee, function(number) {
        attendee.totalAttendees = number;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      if (!options.excludeLinked) {
        obj.getExhibitorAttendees(attendee, function(attendees) {
          attendee.linked = attendees;
          callback(null, attendee);
        });
      } else {
        callback(null, attendee);
      }
    },
    function(attendee, callback) {
      attendee.badgeSchema = exhFields;
      async.each(
        attendee.badgeSchema,
        function(field, callback) {
          attendee[field.class] = attendee[field.id];
          callback(null);
        },
        function(err) {
          callback(null, attendee);
        }
      );
    }
  ],function(err, results) {
      cb(results);
  });
};

Registrants.prototype.getPayments = function(attendee, callback) {
  var paid = false;
  this.models.CheckinEventFees.findAll({
    where: {
      user_id: attendee.biller.userId,
      event_id: attendee.eventId
    }
  }).success(function(payments) {

    async.reduce(payments, [], function(payment, item, cb){
      var due = parseInt(item.due, 10);
      //console.log("paid", due);
      paid = (due == 0) ? true : paid;
      payment.push(item.toJSON());
      cb(null, payment);
    }, function(err, result){
      callback({
        payments: result,
        paid: paid
      });
    });
  });
};

Registrants.prototype.getCreditTrans = function(attendee, callback) {
  this.models.Transactions.findAll({
    where: {
      invoiceNumber: attendee.biller.confirmNum
    }
  }).success(function(trans) {
    async.reduce(trans, [], function(transactions, item, cb){
        transactions.push(item.toJSON());
        cb(null, transactions);
    }, function(err, result){
        callback(result);
    });

  });
};

Registrants.prototype.getBiller = function(attendee, callback) {
  var obj = this;
  this.models.CheckinBiller.find({
    where: {
      userId: attendee.userId,
      eventId: attendee.eventId
    }
  }).success(function(biller) {
    biller = biller.toJSON();
    obj.getRegistrantFields(biller, function(fields) {
      biller = underscore.extend(biller, fields);
      callback(biller);
    });
  });
};

Registrants.prototype.getEvent = function(attendee, callback) {
  this.models.Events.find({
    where: {
      eventId: attendee.eventId
    }
  }).success(function(event) {
    callback(event.toJSON());
  });
};

Registrants.prototype.getRegistrantFields = function(attendee, callback) {
  var schema = {},
      fieldset = [],
      processFields = function (item, cback){
        var schemaRow = {
              "title": item.label,
              "type": types[item.type]
            };
        if (item.values && (item.type == 4 || item.type == 1)) {
          var values = item.values.split("|");
          values.unshift("");
          schemaRow.options = values;
        }
        schema[item.name] = schemaRow;
        fieldset.push(item.name);
        cback(null);
      };

  this.models.CheckinEventFields.findAll({
    where: {
      event_id: attendee.eventId
    },
    order: "ordering ASC"
  }).success(function(fields) {
    async.eachSeries(fields, processFields, function(err){
      callback({
        schema: schema,
        fieldset: fieldset
      });
    });
  });
};

Registrants.prototype.getExhibitorFields = function(attendee, callback) {
  var schema = {},
      fieldset = [],
      processFields = function (item, cback){
        var schemaRow = {
              "title": item.label,
              "type": "Text"
            };
        /*
        if (item.values && (item.type == 4 || item.type == 1)) {
          var values = item.values.split("|");
          values.unshift("");
          schemaRow.options = values;
        }
        */
        schema[item.id] = schemaRow;
        fieldset.push(item.id);
        cback(null);
      };

  async.eachSeries(exhFields, processFields, function(err){
    callback({
      schema: schema,
      fieldset: fieldset
    });
  });

};

Registrants.prototype.getBillerFieldValues = function(attendee, cb) {
  var sql = "SELECT event_fields.name, biller_field_values.value, event_fields.type, event_fields.values "+
            "FROM biller_field_values "+
            "JOIN event_fields  "+
            "     ON ( "+
            "        biller_field_values.field_id = event_fields.local_id  "+
            "        AND biller_field_values.event_id = event_fields.event_id "+
            "    ) "+
            "WHERE biller_field_values.user_id = :userId "+
            "      AND biller_field_values.event_id = :eventId";

  this.db.checkin.query(
    sql, null,
    { raw: true },
    {
      userId: attendee.userId,
      eventId: attendee.eventId
    }
  ).success(function(fieldValues) {
    var convertToJson = function(item, cback) {
          var field = {
                "label":item.name,
                "value": item.value
              };
          if ( item.type == 1 || item.type == 3 || item.type == 4 ) {
            var ar = item.values.split("|");
            field.value = ar[item.value];
          }
          cback(null, field);
        };
    async.map(fieldValues, convertToJson, function(err, results){
      async.reduce(results, {}, function(fields, item, callback){
          fields[item.label] = item.value;
          callback(null, fields);
      }, function(err, result){
          cb(result);
      });

    });
  });
};

Registrants.prototype.getRegistrantBadgeFields = function(attendee, cb) {
  var schema = [];
  this.models.CheckinEventFields.findAll({
    where: {
      badge_order: { gt: 0 },
      event_id: attendee.eventId
    },
    order: [
      ['badge_order', 'ASC'],
    ]
  }).success(function(results) {
    async.reduce(results, [], function(fields, item, callback) {
      schema.push({class: item.class, id: item.name});
      fields.push(item.name);
      callback(null, fields);
    }, function(err, result){
      cb({
        badgeSchema: schema,
        badgeFields: result
      });
    });
  });
};

Registrants.prototype.getRegistrantFieldValues = function(attendee, cb) {
  var sql = "SELECT event_fields.name, member_field_values.value, event_fields.type, event_fields.values "+
            "FROM member_field_values "+
            "JOIN event_fields  "+
            "     ON ( "+
            "        member_field_values.field_id = event_fields.local_id  "+
            "        AND member_field_values.event_id = event_fields.event_id "+
            "    ) "+
            "WHERE member_field_values.member_id = :memberId "+
            "      AND member_field_values.event_id = :eventId";

  this.db.checkin.query(
    sql, null,
    { raw: true },
    {
      memberId: attendee.memberId,
      eventId: attendee.eventId
    }
  ).success(function(fieldValues) {
    var convertToJson = function(item, cback) {
          var field = {
                "label":item.name,
                "value": item.value
              };
          if ( item.type == 1 || item.type == 3 || item.type == 4 ) {
            var ar = item.values.split("|");
            field.value = ar[item.value];
          }
          cback(null, field);
        };
    async.map(fieldValues, convertToJson, function(err, results){
      async.reduce(results, {}, function(fields, item, callback){
          fields[item.label] = item.value;
          callback(null, fields);
      }, function(err, result){
          cb(result);
      });

    });
  });
};

Registrants.prototype.getExhibitorAttendeesNumber = function(attendee, callback) {
  this.models.CheckinExhibitorAttendeeNumber.find({
    where: {
      userId: attendee.userId,
      eventId: attendee.eventId
    }
  }).success(function(number) {
    callback(number.toJSON());
  });
};

Registrants.prototype.getExhibitorAttendees = function(attendee, callback) {
  var obj = this;
  this.models.CheckinExhibitorAttendees.findAll({
    where: {
      userId: attendee.userId,
      eventId: attendee.eventId
    }
  }).success(function(attendees) {
    var convertToJson = function(item, cback) {
          var regId = attendee.event.badge_prefix + obj.pad(item.id, 5),
              reg = item.toJSON();
          console.log("Linked Id", regId);
          reg.memberId = reg.id;
          reg.registrantId = regId;
          reg.paid = attendee.paid;
          cback(null, reg);
        };
    async.map(attendees, convertToJson, function(err, results){
      callback(results);
    });
  });
};

Registrants.prototype.getAdditionalAttendees = function(attendee, callback) {
  var obj = this;
  this.models.CheckinGroupMembers.findAll({
    where: {
      groupUserId: attendee.userId,
      event_id: attendee.eventId
    }
  }).success(function(attendees) {
    var convertToJson = function(item, cback) {
          var cb = function(values) {
                reg = underscore.extend(reg, values);
                cback(null, reg);
              },
              reg = item.toJSON(),
              regId = attendee.event.badge_prefix + obj.pad(reg.id, 5);
          console.log("Linked Id", regId);
          reg.memberId = reg.groupMemberId;
          reg.userId = reg.groupUserId;
          reg.eventId = reg.event_id;
          reg.registrantId = regId;
          reg.paid = attendee.paid;
          obj.getRegistrantFieldValues(reg, cb);
        };
    async.map(attendees, convertToJson, function(err, results){
      callback(results);
    });
  });
};

Registrants.prototype.updateRegistrant = function(regId, values, callback) {

    var obj = this;

    this.models.CheckinGroupMembers.find(regId).success(function(member) {
      member.updateAttributes(values.fields).success(function(update) {
        obj.getRegistrant(regId, {}, callback);
      });
    });

};

Registrants.prototype.updateRegistrantValues = function(regId, values, callback) {

  var updateSelf = ['confirmnum'],
      obj = this;
  //console.log(values);
  this.models.CheckinMemberFieldValues.destroy(
    {
      event_id: values.event_id,
      member_id: values.local_id
    }
  )
  .success(function(affectedRows) {
    obj.models.CheckinEventFields.findAll({
      where: {
        event_id: values.event_id
      }
    })
    .success(function(fields) {

      var records = [],
          createRecord = function(field, cb) {
            var record = {};
            if (typeof values.fields[field.name] != "undefined") {
              record = {
                value: values.fields[field.name],
                event_id: values.event_id,
                field_id: field.local_id,
                member_id: values.local_id
              };
              if (field.values && (field.type == 4 || field.type == 1)) {
                  var fValues = field.values.split("|");
                  values.fields[field.name] = fValues.indexOf(values.fields[field.name]);
              }
              record.value = values.fields[field.name];
              records.push(record);
            }
            cb();
          };

      async.each(fields, createRecord, function(err){

        obj.models.CheckinMemberFieldValues.bulkCreate(records).success(function(results) {
          var recs = {
                event_id: values.event_id,
                groupMemberId: values.local_id
              },
              createRecord = function(field, cb) {
                if (typeof values.fields[field.name] != "undefined") {
                  recs[field] = values.fields[field.name];
                }
                cb();
              };
          async.each(updateSelf, createRecord, function(err) {
            obj.models.CheckinGroupMembers.find({
              where: {
                event_id: values.event_id,
                groupMemberId: values.memberId
              }
            }).success(function(member) {
              member.updateAttributes(recs).success(function(update) {
                obj.getRegistrant(regId, {}, callback);
              });
            });
          });
        });
      });
    })
  });

};

Registrants.prototype.updateAttendeeValues = function(registrantId, values, callback) {
  var regType = registrantId.slice(0,1),
      regId = parseInt(registrantId.slice(1), 10);
  if (regType == "E") {
    //console.log("Get Exhibitor Attendee");
    this.updateExhibitorAttendee(regId, values, callback);
  } else {
    //console.log("Get General Attendee");
    this.updateRegistrantValues(regId, values, callback);
  }
};

Registrants.prototype.updateAttendee = function(registrantId, values, callback) {
  var regType = registrantId.slice(0,1),
      regId = parseInt(registrantId.slice(1), 10);
  if (regType == "E") {
    //console.log("Get Exhibitor Attendee");
    this.updateExhibitorAttendee(regId, values, callback);
  } else {
    //console.log("Get General Attendee");
    this.updateRegistrant(regId, values, callback);
  }
};

Registrants.prototype.updateExhibitorAttendee = function(regId, values, callback) {
  var obj = this;
  //console.log(values);
  this.models.CheckinExhibitorAttendees
  .find(regId)
  .success(function(attendee) {
    //console.log(req.body);
    attendee.updateAttributes(
      values.fields
    ).success(function(attendee) {
      obj.getExhibitorAttendee(regId, {}, callback);
    });
  });
};

Registrants.prototype.getRange = function(beginId, endId, type, callback) {
  beginId = parseInt(beginId,10);
  endId = parseInt(endId,10);
  var ids = this.numberArray(endId-beginId,beginId),
      registrants = [],
      obj = this,
      getReg = function(item, cb) {
        var regId = type + obj.pad(item,5);
        returnCb = function(registrant) {
          if (!underscore.isEmpty(registrant)) {
            registrants.push(registrant);
          }
          cb();
        }
        obj.getAttendee(regId, returnCb);
      };

  async.eachSeries(ids, getReg, function(err){
    callback(registrants);
  });
};

Registrants.prototype.searchAttendees = function(fields, search, page, limit, extra, callback) {
  var sql = "",
      obj = this,
      fields = fields || [],
      search = search || "all",
      page = page || 0,
      limit = limit || 20,
      start = page * limit,
      vars = [],
      extra = extra || false,
      registrants = [
        {"total_entries": 0},
        []
      ];
  async.waterfall([
    function(cb) {
      if (fields.length == 0) {
        //console.log(page, start, limit);
        sql = "SELECT t.* FROM ( ";
        sql += "(SELECT group_members.id, 'G' as type, biller.register_date FROM group_members "+
                "LEFT JOIN biller ON (group_members.groupUserId = biller.userID AND group_members.event_id = biller.eventId) "+
                "WHERE biller.status != -1) ";
        sql += "UNION ALL ";
        sql += "(SELECT exhibitorAttendees.id, 'E' as type, biller.register_date FROM exhibitorAttendees "+
                "LEFT JOIN biller ON (exhibitorAttendees.userId = biller.userID AND exhibitorAttendees.eventId = biller.eventId) "+
                "WHERE biller.status != -1) ";
        sql += ") AS  t";
      } else if (underscore.indexOf(fields, "confirmation") !== -1) {
        sql = "SELECT t.* FROM ( ";
        sql += "(SELECT group_members.id, 'G' as type, biller.register_date "+
                "FROM group_members "+
                "LEFT JOIN biller ON (group_members.groupUserId = biller.userID AND group_members.event_id = biller.eventId) "+
                "WHERE (group_members.confirmnum LIKE ? OR biller.confirmNum LIKE ?) AND biller.status != -1) ";
        vars.push("%"+search+"%", "%"+search+"%");
        sql += "UNION ALL ";
        sql += "(SELECT exhibitorAttendees.id, 'E' as type, biller.register_date FROM exhibitorAttendees "+
               "LEFT JOIN biller ON (exhibitorAttendees.userId = biller.userID AND exhibitorAttendees.eventId = biller.eventId) "+
               "WHERE biller.status != -1 AND biller.confirmNum LIKE ?) ";
        vars.push("%"+search+"%");
        sql += ") AS  t";
        console.log(sql);
      } else if (underscore.indexOf(fields, "registrantid") !== -1) {
        var type = search.charAt(0),
            id = parseInt(search.slice(1), 10);

        if (type == "E") {
          sql = "SELECT exhibitorAttendees.id, 'E' as type, biller.register_date "+
                "FROM exhibitorAttendees "+
                "LEFT JOIN biller ON (exhibitorAttendees.userId = biller.userID AND exhibitorAttendees.eventId = biller.eventId) "+
                "WHERE exhibitorAttendees.id = ? AND biller.status != -1";
        } else {
          sql = "SELECT group_members.id, 'G' as type, biller.register_date "+
                "FROM group_members "+
                "LEFT JOIN biller ON (group_members.groupUserId = biller.userID AND group_members.event_id = biller.eventId) "+
                "WHERE group_members.id = ? AND biller.status != -1";
        }
        vars.push(id);
      } else {
        sql = "SELECT t.* FROM ( "
        sql += "(SELECT group_members.id, 'G' as type, biller.register_date "+
                  " FROM event_fields  "+
                  " LEFT JOIN member_field_values ON (event_fields.local_id = member_field_values.field_id AND event_fields.event_id = member_field_values.event_id) "+
                  " LEFT JOIN group_members ON (member_field_values.member_id = group_members.groupMemberId  AND member_field_values.event_id = group_members.event_id) "+
                  " LEFT JOIN biller ON (group_members.groupUserId = biller.userID AND group_members.event_id = biller.eventId)"+
                  " WHERE biller.status != -1 AND member_field_values.value LIKE ? AND (";
        vars.push("%"+search+"%");
        fields.forEach(function(field, index) {
          if (index > 0) {
              sql += " OR ";
          }
          sql += "event_fields.class = ?";
          vars.push(field);
        });
        sql += ")) UNION (";
        sql += "SELECT exhibitorAttendees.id, 'E' as type, biller.register_date "+
              "FROM exhibitorAttendees "+
              "LEFT JOIN biller ON (exhibitorAttendees.userId = biller.userID AND exhibitorAttendees.eventId = biller.eventId) "+
              "WHERE biller.status != -1 AND (";
        fields.forEach(function(field, index) {
          if (index > 0) {
              sql += " OR ";
          }
          sql += "exhibitorAttendees."+field+" LIKE ?";
          vars.push("%"+search+"%");
        });
        sql += "))";
        sql += ") AS  t";
      }

      obj.db.checkin
      .query(
        sql, null,
        { raw: true }, vars
      )
      .success(function(attendees) {
        registrants[0].total_entries = attendees.length;
        cb(null);
      });
    },
    function(cb) {
      sql += " ORDER BY id DESC "+
               "LIMIT "+start+","+limit;
      obj.db.checkin
      .query(
        sql, null,
        { raw: true }, vars
      )
      .success(function(attendees) {
        var regs = [],
            getReg = function(item, cb) {
              var regId = item.type + obj.pad(item.id, 5);
              returnCb = function(registrant) {
                if (!underscore.isEmpty(registrant)) {
                  regs.push(registrant);
                }
                cb();
              }
              obj.getAttendee(regId, returnCb);
            };

        async.each(attendees, getReg, function(err){
          cb(null, regs);
        });
      });
    }
  ],function(err, results) {
    registrants[1] = results;
    callback(registrants);
  });
};

Registrants.prototype.getCheckedInCount = function(callback) {
  var obj = this;

  async.waterfall([
    function(cb) {
      obj.models.CheckinGroupMembers
      .findAndCountAll({
         where: ["attend = 1"]
      })
      .success(function(result) {
        cb(null, result.count);
      });
    },
    function(count, cb) {
      obj.models.CheckinExhibitorAttendees
      .findAndCountAll({
         where: ["attend = 1"]
      })
      .success(function(result) {
        cb(null, count+result.count);
      });
    }
  ],function(err, count) {
    callback(count);
  });
};

Registrants.prototype.initRegistrant = function(values, callback) {
  var retCallback = function(registrants) {
        callback(registrants);
      },
      obj = this,
      u = new Date(),
      randomUserId  = u.getDate().toString() + u.getHours().toString() + u.getMinutes().toString() + u.getSeconds().toString() + u.getMilliseconds().toString(),
      m = new Date(),
      randomMemberId = m.getDate().toString() + m.getHours().toString() + m.getMinutes().toString() + m.getSeconds().toString() + m.getMilliseconds().toString();

  async.waterfall([
    function(cb){
      obj.models.CheckinBiller.find({
        where: {
          eventId: values.eventId
        },
        order: "userId DESC",
        limit: 1
      }).success(function(biller) {
        var reg = {};
        reg.biller = biller.toJSON();
        reg.userId = randomUserId;
        cb(null, reg);
      });
    },
    function(reg, cb) {
      obj.models.CheckinEventFields.findAll({
        where: {
          event_id: values.eventId
        },
        order: "ordering ASC"
      }).success(function(fields) {
        var convertToJson = function(item, cback) {
              cback(null, item.toJSON());
            };
        async.map(fields, convertToJson, function(err, results){
          reg.fields = results;
          cb(null, reg);
        });
      });
    },
    function(reg, cb){
      obj.models.CheckinGroupMembers.find({
        where: {
          event_id: values.eventId
        },
        order: "groupMemberId DESC",
        limit: 1
      }).success(function(lastMember) {
        reg.lastMember = lastMember.toJSON();
        reg.memberId = randomMemberId,
        cb(null, reg);
      });
    },
    function(reg, cb){
      obj.getEvent({eventId: values.eventId}, function(event) {
        reg.confirmNum = event.confirm_number_prefix+randomMemberId;
        reg.event = event;
        cb(null, reg);
      });
    },
    function(reg, cb){
      var vars = {
            "userId": reg.userId,
            "eventId": values.eventId,
            "local_eventId": values.slabId,
            "type": "G",
            "register_date": "0000-00-00 00:00:00",
            "due_amount": 0.00,
            "confirmNum": reg.confirmNum,
            "status": 1,
            "memtot": 1
          };

      obj.models.CheckinBiller.create(vars).success(function(biller) {
        reg.newBiller = biller.toJSON();
        cb(null, reg);
      });

    },
    function(reg, cb){
      var vars = {
            "groupMemberId": reg.memberId,
            "event_id": values.eventId,
            "groupUserId": reg.userId,
            "confirmnum": reg.confirmNum
          };
      obj.models.CheckinGroupMembers.create(vars).success(function(groupMember) {
        reg.newMember = groupMember.toJSON();
        reg.regId = reg.event.badge_prefix + obj.pad(reg.newMember.id, 5);
        cb(null, reg);
      });
    },
    function(reg, cb){
        var sql = "",
            fvars,
            vars = [],
            processFields = function(field, pCb) {
              if (typeof values[field.name] != "undefined") {
                sql += "INSERT INTO member_field_values SET value = ?, event_id = ?, field_id = ?, member_id = ?; ";
                if (field.values) {
                    fValues = field.values.split("|");
                    values[field.name] = fValues.indexOf(values[field.name]);
                }
                vars.push(values[field.name], values.eventId, field.local_id, reg.memberId);
                sql += "INSERT INTO biller_field_values SET value = ?, event_id = ?, field_id = ?, user_id = ?; ";
                if (field.values) {
                    fValues = field.values.split("|");
                    values[field.name] = fValues.indexOf(values[field.name]);
                }
                vars.push(values[field.name], values.eventId, field.local_id, reg.userId);
                //console.log(values.fields[field.name], values.event_id, field.local_id, values.local_id);
                pCb(null);
              } else {
                pCb(null);
              }
            };
        async.each(reg.fields, processFields, function(err) {
          if (vars.length) {
            obj.db.checkin
            .query(
              sql, null,
              { raw: true }, vars
            )
            .success(function(insertResults) {
              cb(null, reg);
            });
          } else {
            cb(null, reg);
          }
        });
      }
  ], function (err, result) {
    //console.log(result);
    obj.searchAttendees(["registrantid"], result.regId, 0, 20, false, retCallback);
  });
};

Registrants.prototype.saveCheckTransaction = function(values, callback) {
  var obj = this,
      transAction = values.transaction;
  async.waterfall([
    function(cb){
      obj.models.CheckinBiller
      .find({
        where: {
          eventId: values.registrant.event_id,
          userId: values.registrant.biller_id
        }
      })
      .success(function(biller) {
        var attr = {
              transaction_id: values.transaction.payment.checkNumber
            };
        biller.updateAttributes(attr).success(function(biller) {
          cb(null, {biller: biller});
        });
      });
    },
    function(results, cb) {
      obj.models.CheckinEventFees
      .find({
        where: {
          event_id: values.registrant.event_id,
          user_id: values.registrant.biller_id
        }
      })
      .success(function(fees) {
        results.fees = fees;
        cb(null, results);
      });
    },
    function(results, cb) {
      var vals = {
            basefee: transAction.amount,
            fee: transAction.amount,
            paid_amount: transAction.amount,
            status: 1,
            payment_method: "2"
          };
      if (results.fees) {
        results.fees.updateAttributes(vals).success(function(fees) {
          results.fees = fees;
          cb(null, results);
        });
      } else {
        vals = underscore.extend(vals, {event_id: values.registrant.event_id, user_id: values.registrant.biller_id});
        obj.models.CheckinEventFees
        .create(vals)
        .success(function(fees) {
          results.fees = fees;
          cb(null, results);
        });
      }
    }
  ], function (err, results) {
    callback(results);
  });
};

Registrants.prototype.saveCreditTransaction = function(values, callback) {
  var obj = this,
      transAction = values.transaction;
  async.waterfall([
    function(cb){
      obj.models.CheckinBiller
      .find({
        where: {
          eventId: values.registrant.event_id,
          userId: values.registrant.biller_id
        }
      })
      .success(function(biller) {
        var attr = {
              transaction_id: values.transaction.payment.checkNumber
            };
        biller.updateAttributes(attr).success(function(biller) {
          cb(null, {biller: biller});
        });
      });
    },
    function(results, cb) {
      obj.models.CheckinEventFees
      .find({
        where: {
          event_id: values.registrant.event_id,
          user_id: values.registrant.biller_id
        }
      })
      .success(function(fees) {
        results.fees = fees;
        cb(null, results);
      });
    },
    function(results, cb) {
      var vals = {
            basefee: transAction.amount,
            fee: transAction.amount,
            paid_amount: transAction.amount,
            status: 1,
            payment_method: "authorizenet"
          };
      if (results.fees) {
        results.fees.updateAttributes(vals).success(function(fees) {
          results.fees = fees;
          cb(null, results);
        });
      } else {
        vals = underscore.extend(vals, {event_id: values.registrant.event_id, user_id: values.registrant.biller_id});
        obj.models.CheckinEventFees
        .create(vals)
        .success(function(fees) {
          results.fees = fees;
          cb(null, results);
        });
      }
    }
  ], function (err, results) {
    callback(results);
  });
};

Registrants.prototype.saveAuthorizeNetTransaction = function(data, callback) {
  var vars = underscore.clone(data.transaction);
  delete vars.batch;
  delete vars.payment;
  delete vars.order;
  delete vars.billTo;
  delete vars.shipTo;
  delete vars.recurringBilling;
  delete vars.customer;
  delete vars.customerIP;
  vars = underscore.extend(vars, data.transaction.batch);
  vars = underscore.extend(vars, data.transaction.order);
  vars = underscore.extend(vars, data.transaction.payment.creditCard);
  vars = underscore.extend(vars, data.transaction.customer);
  vars = underscore.extend(vars, {
    billToFirstName: data.transaction.billTo.firstName,
    billToLastName: data.transaction.billTo.lastName,
    billToAdddatas: data.transaction.billTo.adddatas,
    billToCity: data.transaction.billTo.city,
    billToState: data.transaction.billTo.state,
    billToZip: data.transaction.billTo.zip,
    billToPhoneNumber: data.transaction.billTo.phoneNumber
  });
  if ("shipTo" in data.transaction) {
    vars = underscore.extend(vars, {
      shipToFirstName: data.transaction.shipTo.firstName,
      shipToLastName: data.transaction.shipTo.lastName,
      shipToAdddatas: data.transaction.shipTo.adddatas,
      shipToCity: data.transaction.shipTo.city,
      shipToState: data.transaction.shipTo.state,
      shipToZip: data.transaction.shipTo.zip
    });
  }

  this.models.Transactions
  .create(vars)
  .success(function(trans) {
    callback({db: trans, credit: data});
  });
};

Registrants.prototype.pad = function(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
};

Registrants.prototype.shallowCopy = function(oldObj) {
    var newObj = {};
    for(var i in oldObj) {
        if(oldObj.hasOwnProperty(i)) {
            newObj[i] = oldObj[i];
        }
    }
    return newObj;
};

Registrants.prototype.numberArray = function(a, b, c) {
  c=[];
  while(a--){
    c[a]=a+b
  }
  return c
};

module.exports.init = function(opts) {
  return new Registrants(opts);
};
