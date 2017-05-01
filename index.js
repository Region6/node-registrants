var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    async = require('async'),
    uuid = require("node-uuid"),
    glob = require('glob'),
    moment = require('moment'),
    underscore = require('underscore'),
    Sequelize = require("sequelize"),
    shortid = require('shortid32'),
    gpc = require('generate-pincode'),
    exhFields = [
      {title: "First Name", id: "firstname", class:"firstname", type: "Text"},
      {title: "Last Name", id: "lastname", class:"lastname", type: "Text"},
      {title: "Title", id: "title", class:"title", type: "Text"},
      {title: "Site ID", id: "siteId", class:"siteid", type: "Text"},
      {title: "Company", id: "organization", class:"company", type: "Text"},
      {title: "Street 1", id: "address", class:"street1", type: "Text"},
      {title: "Street 2", id: "address2", class:"street2", type: "Text"},
      {title: "City", id: "city", class:"city", type: "Text"},
      {
        title: "State", 
        id: "state", 
        class:"state", 
        type: "Select",
        options: [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "District of Columbia",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming",
          "American Samoa",
          "Guam",
          "Northern Mariana Islands",
          "Puerto Rico",
          "United States Minor Outlying Islands",
          "Virgin Islands",
          "Alberta",
          "British Columbia",
          "Manitoba",
          "New Brunswick",
          "Newfoundland and Labrador",
          "Nova Scotia",
          "Nunavut",
          "Northwest Territories",
          "Ontario",
          "Prince Edward Island",
          "Quebec",
          "Saskatchewen",
          "Yukon"
        ]
      },
      {title: "Zip", id: "zip", class:"zipcode", type: "Text"},
      {title: "Phone", id: "phone", class:"phone", type: "Text"},
      {title: "Email", id: "email", class:"email", type: "Text"}
    ],
    exhBillerFields = [
      {id: "firstname", class:"firstname"},
      {id: "lastname", class:"lastname"},
      {id: "organization", class:"bcompany"},
      {id: "address", class:"baddress1"},
      {id: "address2", class:"baddress2"},
      {id: "city", class:"bcity"},
      {id: "state", class:"bstate"},
      {id: "zip", class:"bzip"},
      {id: "phone", class:"phone"},
      {id: "email", class:"email"}
    ],
    onsiteFields = [
      {title: "First Name", id: "firstname", class:"firstname", type: "Text"},
      {title: "Last Name", id: "lastname", class:"lastname", type: "Text"},
      {title: "Title", id: "title", class:"title", type: "Text"},
      {title: "Site ID", id: "siteId", class:"siteid", type: "Text"},
      {title: "Company", id: "organization", class:"company", type: "Text"},
      {title: "Street 1", id: "address", class:"street1", type: "Text"},
      {title: "Street 2", id: "address2", class:"street2", type: "Text"},
      {title: "City", id: "city", class:"city", type: "Text"},
      {
        title: "State", 
        id: "state", 
        class:"state", 
        type: "Select",
        options: [
          "Alabama",
          "Alaska",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "District of Columbia",
          "Delaware",
          "Florida",
          "Georgia",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Pennsylvania",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming",
          "American Samoa",
          "Guam",
          "Northern Mariana Islands",
          "Puerto Rico",
          "United States Minor Outlying Islands",
          "Virgin Islands",
          "Alberta",
          "British Columbia",
          "Manitoba",
          "New Brunswick",
          "Newfoundland and Labrador",
          "Nova Scotia",
          "Nunavut",
          "Northwest Territories",
          "Ontario",
          "Prince Edward Island",
          "Quebec",
          "Saskatchewen",
          "Yukon"
        ]
      },
      {title: "Zip", id: "zip", class:"zipcode", type: "Text"},
      {title: "Phone", id: "phone", class:"phone", type: "Text"},
      {title: "Email", id: "email", class:"email", type: "Text"},
      {title: "Management", id: "management", class:"management", type: "select", options: ["Yes", "No"]}
    ],
    onsiteBillerFields = [
      {id: "firstname", class:"firstname"},
      {id: "lastname", class:"lastname"},
      {id: "organization", class:"bcompany"},
      {id: "address", class:"baddress1"},
      {id: "address2", class:"baddress2"},
      {id: "city", class:"bcity"},
      {id: "state", class:"bstate"},
      {id: "zip", class:"bzip"},
      {id: "phone", class:"phone"},
      {id: "email", class:"email"}
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
    local_id:             { type: Sequelize.INTEGER, defaultValue: '0' },
    event_id:             { type: Sequelize.STRING(36) },
    field_id:             { type: Sequelize.INTEGER },
    member_id:            { type: Sequelize.STRING(255) },
    value:                { type: Sequelize.TEXT }
  });

  this.models.CheckinGroupMembers = this.db.checkin.define('group_members', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    groupMemberId :       { type: Sequelize.STRING(255) },
    event_id :            { type: Sequelize.STRING(36) },
    groupUserId :         { type: Sequelize.STRING(255) },
    created :             { type: Sequelize.DATE },
    confirmnum :          { type: Sequelize.STRING(100) },
    attend:               { type: Sequelize.BOOLEAN },
    discount_code_id :    { type: Sequelize.INTEGER },
    checked_in_time :     { type: Sequelize.DATE }
  });

  this.models.CheckinEventFields = this.db.checkin.define('event_fields', {
    id:             { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    local_id :       { type: Sequelize.INTEGER, defaultValue: '0' },
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
    userId :              { type: Sequelize.STRING(255) },
    eventId :             { type: Sequelize.STRING(36) },
    local_eventId :       { type: Sequelize.INTEGER },
    type :                { type: Sequelize.ENUM('I','G') },
    register_date :       { type: Sequelize.DATE },
    payment_type :        { type: Sequelize.STRING(100) },
    due_amount :          { type: Sequelize.DECIMAL(10,2) },
    pay_later_option:     { type: Sequelize.INTEGER },
    confirmNum :          { type: Sequelize.STRING(50) },
    user_id :             { type: Sequelize.STRING(255) },
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
    local_id :            { type: Sequelize.INTEGER, defaultValue: '0' },
    event_id :            { type: Sequelize.STRING(36) },
    user_id :             { type: Sequelize.STRING(255) },
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
    local_id :            { type: Sequelize.INTEGER, defaultValue: '0' },
    event_id :            { type: Sequelize.STRING(36) },
    field_id :            { type: Sequelize.INTEGER },
    user_id :             { type: Sequelize.STRING(255) },
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
  
  this.models.Exhibitors = this.db.checkin.define('exhibitors', {
      id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      confirmation :        { type: Sequelize.STRING(255) },
      booths :              { type: Sequelize.STRING(255) },
      attendees:             { type: Sequelize.INTEGER, defaultValue: 0},
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
      createdAt :             { type: Sequelize.DATE },
      updatedAt :             { type: Sequelize.DATE },
      deletedAt :             { type: Sequelize.DATE },
      siteId :              { type: Sequelize.STRING(10) }
    });

  this.models.CheckinExhibitorAttendees = this.db.checkin.define('exhibitorAttendees', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId :              { type: Sequelize.INTEGER },
    eventId :             { type: Sequelize.STRING(36) },
    pin:                  { type: Sequelize.STRING(4) },
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
    createdAt :             { type: Sequelize.DATE },
    updatedAt :             { type: Sequelize.DATE },
    deletedAt :             { type: Sequelize.DATE },
    siteId :              { type: Sequelize.STRING(10) },
    attend:               { type: Sequelize.BOOLEAN },
    speaker:              { type: Sequelize.BOOLEAN },
    checked_in_time :     { type: Sequelize.DATE }
  });
  
  this.models.OnsiteAttendees = this.db.checkin.define('onsiteAttendees', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    confirmation :        { type: Sequelize.STRING(255) },
    pin:                  { type: Sequelize.STRING(4) },
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
    management:           { type: Sequelize.BOOLEAN },
    title :               { type: Sequelize.STRING(255) },
    organization :        { type: Sequelize.STRING(255) },
    siteId :              { type: Sequelize.STRING(10) },
    attend:               { type: Sequelize.BOOLEAN },
    checked_in_time :     { type: Sequelize.DATE },
    isCheck :             { type: Sequelize.STRING(255) },
    groupConfirm :        { type: Sequelize.STRING(255) },
    speaker:              { type: Sequelize.BOOLEAN },
    exhibitor:            { type: Sequelize.BOOLEAN },
    createdAt :             { type: Sequelize.DATE },
    updatedAt :             { type: Sequelize.DATE },
    deletedAt :           { type: Sequelize.DATE }
  });

  this.models.Sites = this.db.checkin.define('siteIds', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    company:              { type: Sequelize.STRING(255) },
    street1:              { type: Sequelize.STRING(255) },
    street2:              { type: Sequelize.STRING(255) },
    city:                 { type: Sequelize.STRING(255) },
    state:                { type: Sequelize.STRING(255) },
    zipCode:              { type: Sequelize.STRING(255) },
    siteId:               { type: Sequelize.STRING(255) }
  });
  
  this.models.RegistrantTransactions = this.db.checkin.define('registrantTransactions', {
    id:                   { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    confirmation :        { type: Sequelize.STRING(255) },
    transactionId :       { type: Sequelize.STRING(255) },
    checkNumber :         { type: Sequelize.STRING(255) },
    checkAmount :         { type: Sequelize.STRING(20) },
    createdAt :           { type: Sequelize.DATE },
    updatedAt :           { type: Sequelize.DATE },
    deletedAt :           { type: Sequelize.DATE }
  },{
    timestamps: true
  });

  this.models.Transactions = this.db.checkin.define('transactions', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    transId : { type: Sequelize.STRING(255) },
    submitTimeUTC : { type: Sequelize.DATE },
    submitTimeLocal : { type: Sequelize.DATE },
    transactionType : { type: Sequelize.STRING(255) },
    transactionStatus : { type: Sequelize.STRING(255) },
    responseCode : { type: Sequelize.INTEGER(11) },
    responseReasonCode : { type: Sequelize.INTEGER(11) },
    responseReasonDescription : { type: Sequelize.STRING(255) },
    authCode : { type: Sequelize.STRING(10) },
    AVSResponse : { type: Sequelize.STRING(2) },
    cardCodeResponse : { type: Sequelize.STRING(2) },
    batchId : { type: Sequelize.INTEGER(11) },
    settlementTimeUTC : { type: Sequelize.DATE },
    settlementTimeLocal : { type: Sequelize.DATE },
    settlementState : { type: Sequelize.STRING(255) },
    customerId : { type: Sequelize.STRING(255) },
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
  
  this.models.Badges = this.db.checkin.define('event_badge', {
    id :                    { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    eventId :               { type: Sequelize.STRING(36) },
    template :              { type: Sequelize.TEXT }
  });

};

Registrants.prototype.getAttendee = function(registrantId, callback){
  var regType = registrantId.slice(0,1).toUpperCase(),
      regId = parseInt(registrantId.slice(1), 10),
      returnCb = function(data) {
        callback(data);
      };
  if (regType == "E") {
    //console.log("Get Exhibitor Attendee");
    this.getExhibitorAttendee(regId, {}, returnCb);
  } else {
    //console.log("Get General Attendee");
    this.getRegistrant(regId, regType, {}, returnCb);
  }
};

Registrants.prototype.getRegistrant = function(regId, regType, options, callback){
  regType = regType || "G";
  var obj = this;
  console.log("Get Registrant", regId, regType);
   this.models.OnsiteAttendees
  .find(regId)
  .then(function(member) {
    if (member !== null) {
      obj.createOnsiteModel(member.toJSON(), options, function(attendee) {
        attendee = underscore.extend(
          attendee,
          {
            local_id: attendee.userId,
            event_id: attendee.eventId,
            registrantId: attendee.event.badge_prefix + obj.pad(attendee.id, 5),
            paddedRegId: attendee.event.badge_prefix + obj.pad(attendee.id, 5),
            displayId: attendee.event.badge_prefix + "-" + attendee.id,
            badge_prefix: attendee.event.badge_prefix,
            biller_id: attendee.biller.id
          }
        );
        callback(attendee);
      });
    } else  {
      callback({});
    }
  });
};

Registrants.prototype.getExhibitorAttendee = function(regId, options, callback){
  var obj = this;
  this.models.CheckinExhibitorAttendees
  .find(regId)
  .then(function(member) {
    if (member !== null) {
      obj.createExhibitorModel(member.toJSON(), options, function(attendee) {
        attendee = underscore.extend(
          attendee,
          {
            local_id: attendee.userId,
            event_id: attendee.eventId,
            registrantId: attendee.event.badge_prefix + obj.pad(attendee.id, 5),
            paddedRegId: attendee.event.badge_prefix + obj.pad(attendee.id, 5),
            displayId: attendee.event.badge_prefix + "-" + attendee.id,
            confirmation: attendee.biller.confirmation,
            badge_prefix: attendee.event.badge_prefix,
            biller_id: attendee.biller.id,
            badgeFields: [
              "firstname",
              "lastname",
              "title",
              "email",
              "phone",
              "organization",
              "address",
              "address2",
              "city",
              "state",
              "zipcode"
            ]
          }
        );
        callback(attendee);
      });
    } else {
      callback({});
    }
  });
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
      obj.getRegTransactions(attendee, function(values) {
        attendee.transactions = values.transactions;
        attendee.paid = values.paid;
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
      if ("siteid" in attendee || "siteId" in attendee) {
        var siteid = ("siteid" in attendee) ? attendee.siteid : attendee.siteId;
        obj.getSiteInfo(siteid, function(site) {
          attendee.site = site;
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
          attendee[field.class] = attendee.fields[field.id] || "";
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
      obj.getExhBiller(attendee, function(values) {
        attendee.biller = values;
        attendee.confirmation = attendee.biller.confirmation;
        callback(null, attendee);
      });
    },
    function(attendee, callback) {
      obj.getRegTransactions(attendee, function(values) {
        attendee.transactions = values.transactions;
        attendee.paid = values.paid;
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
      if ("siteid" in attendee || "siteId" in attendee) {
        var siteid = ("siteid" in attendee) ? attendee.siteid : attendee.siteId;
        obj.getSiteInfo(siteid, function(site) {
          attendee.site = site;
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

Registrants.prototype.createOnsiteModel = function(attendee, options, cb) {
  var obj = this;
  attendee.confirmNum = attendee.confirmation;
  attendee.fields = this.shallowCopy(attendee);
  attendee.badgeFields = [
    "firstname",
    "lastname",
    "title",
    "email",
    "phone",
    "organization",
    "address",
    "address2",
    "city",
    "state",
    "zipcode"
  ];
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
      /*
      attendee.biller = {};
      attendee.biller.userId = attendee.id;
      attendee.biller.register_date = attendee.created;
      attendee.biller.confirmNum = attendee.confirmation;
      async.each(
        onsiteBillerFields,
        function(field, callback) {
          attendee.biller[field.class] = attendee[field.id];
          callback(null);
        },
        function(err) {
          callback(null, attendee);
        }
      );
      */
      callback(null, attendee);
    },
    function(attendee, callback) {
      obj.getRegTransactions(attendee, function(values) {
        attendee.transactions = values.transactions;
        attendee.paid = values.paid;
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
      if (!options.excludeLinked) {
        obj.getAdditionalAttendees(attendee, function(attendees) {
          attendee.linked = null;
          if (attendee.groupConfirm) {
            attendee.linked = attendees;
          } 
          callback(null, attendee);
        });
      } else {
        callback(null, attendee);
      }
    },
    function(attendee, callback) {
      if ("siteid" in attendee || "siteId" in attendee) {
        var siteid = ("siteid" in attendee) ? attendee.siteid : attendee.siteId;
        obj.getSiteInfo(siteid, function(site) {
          attendee.site = site;
          callback(null, attendee);
        });
      } else {
        callback(null, attendee);
      }
    },
    function(attendee, callback) {
      attendee.badgeSchema = onsiteFields;
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

Registrants.prototype.getRegTransactions = function(attendee, callback) {
  var self = this,
      paid = false,
      transactions = [];
  this.models.RegistrantTransactions.findAll({
    where: {
      confirmation: attendee.confirmation
    }
  }).then(function(trans) {
    
    async.each(
      trans,
      function(transaction, cb) {
        var _trans = transaction.toJSON();
        if (transaction.transactionId && !transaction.checkNumber) {
          self.models.Transactions.findOne({
            where: {
              transId: transaction.transactionId
            }
          }).then(
            function(result) {
              if (result) {
                _trans = underscore.extend(_trans, result.toJSON());
                paid = (_trans.responseCode === 1) ? true : paid;
                transactions.push(_trans);
              }
              cb();
            }
          );
            
        } else {
          transactions.push(_trans);
          paid = (_trans.checkNumber) ? true : paid;
          cb();
        }
      },
      function(err) {
        callback({
          transactions: transactions,
          paid: paid
        });
      }
    );
    
  });
};

Registrants.prototype.getPayments = function(attendee, callback) {
  this.models.CheckinEventFees.findAll({
    where: {
      user_id: attendee.biller.userId,
      event_id: attendee.eventId
    }
  }).then(function(payments) {

    async.reduce(payments, [], function(payment, item, cb){
      var due = parseInt(item.due, 10);
      //console.log("paid", due);
      payment.push(item.toJSON());
      cb(null, payment);
    }, function(err, result){
      callback(result);
    });
  });
};

Registrants.prototype.getCreditTrans = function(attendee, callback) {
  var paid = false;
  this.models.Transactions.findAll({
    where: {
      invoiceNumber: attendee.biller.confirmNum
    }
  }).then(function(trans) {
    async.reduce(trans, [], function(transactions, item, cb){
        transactions.push(item.toJSON());
        paid = (item.settlementState === "settledSuccessfully") ? true : paid;
        cb(null, transactions);
    }, function(err, result){
        callback({
          transactions: result,
          paid: paid
        });
    });

  });
};

Registrants.prototype.getBiller = function(attendee, callback) {
  var obj = this;
  if (attendee.transactions.length) {
    this.models.OnsiteAttendees.find({
      where: {
        confirmation: attendee.transactions[0].customerId
      }
    }).then(
      function(biller) {
        if (biller) {
          biller = biller.toJSON();
          callback(biller);
        } else {
          callback({});
        }
      }
    );
  } else {
    callback({});
  }
};

Registrants.prototype.getExhBiller = function(attendee, callback) {
  var obj = this;

  this.models.Exhibitors.find({
    where: {
      id: attendee.userId
    }
  }).then(
    function(biller) {
      if (biller) {
        biller = biller.toJSON();
        callback(biller);
      } else {
        callback({});
      }
    }
  );
 
};

Registrants.prototype.getEvent = function(attendee, callback) {
  this.models.Events.find({
    where: {
      eventId: attendee.eventId
    }
  }).then(function(event) {
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

  this.models.CheckinEventFields.findAll(
    {
      where: {
        event_id: attendee.eventId
      },
      order: "ordering ASC"
    }
  ).then(
    function(fields) {
      async.eachSeries(
        fields, 
        processFields, 
        function(err){
          callback({
            schema: schema,
            fieldset: fieldset
          });
        }
      );
    }
  );
};

Registrants.prototype.getExhibitorFields = function(attendee, callback) {
  var schema = {},
      fieldset = [],
      processFields = function (item, cback){
        schema[item.id] = item;
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
    sql,
    {
      replacements: {
        userId: attendee.userId,
        eventId: attendee.eventId
      },
      type: Sequelize.QueryTypes.SELECT
    }
  ).then(
    function(fieldValues) {
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
            if (attendee.event.reg_type === "E") { 
              console.log(item.label);
              var clas = underscore.where(exhBillerFields, {id: item.label});
              if (clas.length > 0) {
                fields[clas[0].class] = item.value;
              }
            } 
            callback(null, fields);
        }, function(err, result){
            cb(result);
        });

      });
    }
  );
};

Registrants.prototype.getRegistrantBadgeFields = function(attendee, cb) {
  var schema = [];
  this.models.CheckinEventFields.findAll(
    {
      where: {
        badge_order: { gt: 0 },
        event_id: attendee.eventId
      },
      order: [
        ['badge_order', 'ASC'],
      ]
    }
  ).then(
    function(results) {
      async.reduce(
        results, 
        [], 
        function(fields, item, callback) {
          item.name;
          schema.push({class: item.class, id: item.name});
          fields.push(item.name);
          callback(null, fields);
        }, 
        function(err, result){
          cb({
            badgeSchema: schema,
            badgeFields: result
          });
        }
      );
    }
  );
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
  
  console.log(attendee);
  this.db.checkin.query(
    sql,
    {
      replacements: {
        memberId: attendee.memberId,
        eventId: attendee.eventId
      },
      type: Sequelize.QueryTypes.SELECT
    }
  ).then(
    function(fieldValues) {
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
      async.map(
        fieldValues, 
        convertToJson, 
        function(err, results) {
          async.reduce(
            results, 
            {}, 
            function(fields, item, callback) {
              fields[item.label] = item.value;
              callback(null, fields);
            }, 
            function(err, result){
              cb(result);
            }
          );
        }
      );
    }
  );
};

Registrants.prototype.getExhibitorAttendeesNumber = function(attendee, callback) {
  this.models.CheckinExhibitorAttendeeNumber.find({
    where: {
      userId: attendee.userId,
      eventId: attendee.eventId
    }
  }).then(function(number) {
    callback(number.toJSON());
  });
};

Registrants.prototype.getExhibitorAttendees = function(attendee, callback) {
  var obj = this;
  this.models.CheckinExhibitorAttendees.findAll({
    where: {
      userId: attendee.userId,
      eventId: attendee.eventId,
      id: {
        $ne: attendee.id  
      }
    }
  }).then(function(attendees) {
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
  this.models.OnsiteAttendees.findAll({
    where: {
      groupConfirm: attendee.groupConfirm,
      confirmation: {
        $ne: attendee.confirmation
      }
    }
  }).then(function(attendees) {
    var convertToJson = function(item, cback) {
          var cb = function(values) {
                console.log("Got linked values:", values);
                reg = underscore.extend(reg, values);
                cback(null, reg);
              },
              reg = item.toJSON(),
              displayId = attendee.event.badge_prefix + "-" + reg.id,
              regId = attendee.event.badge_prefix + obj.pad(reg.id, 5);
          console.log("Linked Id", regId);
          reg.memberId = reg.groupMemberId;
          reg.userId = reg.groupUserId;
          reg.eventId = reg.event_id;
          reg.registrantId = regId;
          reg.displayId = displayId;
          reg.paid = attendee.paid;
          //obj.getRegistrantFieldValues(reg, cb);
          cback(null, reg);
        };
    async.map(attendees, convertToJson, function(err, results){
      callback(results);
    });
  });
};

Registrants.prototype.updateRegistrant = function(regId, type, values, callback) {

    var obj = this;
    this.models.OnsiteAttendees.find(regId).then(
      function(member) {
        console.log(member);
        member.updateAttributes(values.fields).then(
          function(update) {
            console.log(member);
            obj.getRegistrant(regId, type, {}, callback);
          },
          function(error) {
           console.log(error); 
          }
        );
      }
    );
};

Registrants.prototype.updateRegistrantValues = function(regId, type, values, callback) {

  var updateSelf = ['confirmnum'],
      obj = this;
  
  this.models.OnsiteAttendees.find(regId).then(
    function(member) {
      console.log(member);
      member.updateAttributes(values.fields).then(
        function(update) {
          console.log(member);
          obj.getRegistrant(regId, type, {}, callback);
        },
        function(error) {
         console.log(error); 
        }
      );
    }
  );
  
};

Registrants.prototype.updateAttendeeValues = function(registrantId, values, callback) {
  var regType = registrantId.slice(0,1),
      regId = parseInt(registrantId.slice(1), 10);
  if (regType == "E") {
    //console.log("Get Exhibitor Attendee");
    this.updateExhibitorAttendee(regId, values, callback);
  } else {
    //console.log("Get General Attendee");
    this.updateRegistrantValues(regId, regType, values, callback);
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
    this.updateRegistrant(regId, regType, values, callback);
  }
};

Registrants.prototype.updateExhibitorAttendee = function(regId, values, callback) {
  var obj = this;
  //console.log(values);
  this.models.CheckinExhibitorAttendees
  .find(regId)
  .then(function(attendee) {
    //console.log(req.body);
    attendee.updateAttributes(
      values.fields
    ).then(function(attendee) {
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
      limit = limit || 100,
      start = page * limit,
      vars = [],
      extra = extra || false,
      registrants = [];
  console.log(fields, search, page, limit, start);
  search = search.replace(/\r?\n|\r/g,"");
  async.waterfall([
    function(cb) {
      if (fields.length == 0) {
        //console.log(page, start, limit);
        sql = "SELECT t.* FROM ( ";
        sql += "(SELECT onsiteAttendees.id, 'G' as type, onsiteAttendees.createdAt as register_date, onsiteAttendees.updatedAt as sortDate "+
                "FROM onsiteAttendees) ";
        sql += "UNION ALL ";
        sql += "(SELECT exhibitorAttendees.id, 'E' as type, exhibitors.createdAt as register_date, exhibitorAttendees.updatedAt as sortDate FROM exhibitorAttendees "+
                "LEFT JOIN exhibitors ON exhibitorAttendees.userId = exhibitors.id ) ";
        sql += ") AS  t";
      } else if (underscore.indexOf(fields, "confirmation") !== -1) {
        sql = "SELECT t.* FROM ( ";
        sql += "(SELECT onsiteAttendees.id, 'G' as type, onsiteAttendees.createdAt as register_date, onsiteAttendees.updatedAt as sortDate "+
                "FROM onsiteAttendees WHERE onsiteAttendees.confirmation LIKE ?) ";
        vars.push("%"+search);
        sql += "UNION ALL ";
        sql += "(SELECT exhibitorAttendees.id, 'E' as type, exhibitors.createdAt as register_date, exhibitorAttendees.updatedAt as sortDate FROM exhibitorAttendees "+
               "LEFT JOIN exhibitors ON exhibitorAttendees.userId = exhibitors.id "+
               "WHERE exhibitors.confirmation LIKE ?) ";
        vars.push("%"+search);
        sql += ") AS  t";
        console.log(sql);
      } else if (underscore.indexOf(fields, "attend") !== -1) {
        sql = "SELECT t.* FROM ( ";
        sql += "(SELECT onsiteAttendees.id, 'G' as type, onsiteAttendees.createdAt as register_date, onsiteAttendees.updatedAt as sortDate "+
                "FROM onsiteAttendees WHERE onsiteAttendees.attend = 1) ";
        sql += "UNION ALL ";
        sql += "(SELECT exhibitorAttendees.id, 'E' as type, exhibitors.createdAt as register_date, exhibitorAttendees.updatedAt as sortDate FROM exhibitorAttendees "+
               "LEFT JOIN exhibitors ON exhibitorAttendees.userId = exhibitors.id "+
               "WHERE exhibitorAttendees.attend = 1) ";
        sql += ") AS  t";
      } else if (underscore.indexOf(fields, "registrantid") !== -1) {
        var type = search.charAt(0),
            id = parseInt(search.slice(1), 10);

        if (type === "E") {
          sql = "SELECT exhibitorAttendees.id, 'E' as type, exhibitors.createdAt as register_date, exhibitorAttendees.updatedAt as sortDate "+
                "FROM exhibitorAttendees "+
                "LEFT JOIN exhibitors ON exhibitorAttendees.userId = exhibitors.id "+
                "WHERE exhibitorAttendees.id = ?";
        } else {
          sql = "(SELECT onsiteAttendees.id, 'G' as type, onsiteAttendees.createdAt as register_date, onsiteAttendees.updatedAt as sortDate "+
                "FROM onsiteAttendees WHERE onsiteAttendees.id = ?) ";
        }
        vars.push(id);
       } else if(underscore.indexOf(fields, "sortDate") !== -1) {
        sql = "SELECT t.* FROM ( "
        sql += "(SELECT onsiteAttendees.id, 'G' as type, onsiteAttendees.createdAt as register_date, onsiteAttendees.updated as sortDate "+
              "FROM onsiteAttendees "+
              "ORDER BY exhibitorAttendees.updatedAt DESC ) UNION (";
        sql += "SELECT exhibitorAttendees.id, 'E' as type, exhibitors.createdAt as register_date, exhibitorAttendees.updatedAt as sortDate "+
              "FROM exhibitorAttendees "+
              "JOIN exhibitors ON exhibitorAttendees.userId = exhibitors.id "+
              "WHERE ORDER BY exhibitorAttendees.updatedAt DESC )";
        sql += ") AS  t";
      } else {
        sql = "SELECT t.* FROM ( "
        sql += "(SELECT onsiteAttendees.id, 'G' as type, onsiteAttendees.createdAt as register_date, onsiteAttendees.updatedAt as sortDate "+
              "FROM onsiteAttendees "+
              "WHERE (";
        fields.forEach(function(field, index) {
          if (index > 0) {
              sql += " OR ";
          }
          field = (field == "company") ? "organization" : field;
          sql += "onsiteAttendees."+field+" LIKE ?";
          vars.push("%"+search+"%");
        });
        
        sql += ")) UNION (";
        sql += "SELECT exhibitorAttendees.id, 'E' as type, exhibitors.createdAt as register_date, exhibitorAttendees.updatedAt as sortDate "+
              "FROM exhibitorAttendees "+
              "LEFT JOIN exhibitors ON exhibitorAttendees.userId = exhibitors.id "+
              "WHERE (";
        fields.forEach(function(field, index) {
          if (index > 0) {
              sql += " OR ";
          }
          field = (field == "company") ? "organization" : field;
          sql += "exhibitorAttendees."+field+" LIKE ?";
          vars.push("%"+search+"%");
        });
        sql += "))";
        sql += ") AS  t";
      }
      
      cb(null);
    },
    function(cb) {
      sql += " ORDER BY sortDate DESC ";
      if (underscore.indexOf(fields, "attend") === -1) {
        sql += "LIMIT "+start+","+limit;
      }
      obj.db.checkin.query(
        sql,
        {
          replacements: vars,
          type: Sequelize.QueryTypes.SELECT
        }
      ).then(
        function(attendees) {
          cb(null, attendees);
        }
      );
    },
    function(attendees, cb) {
      var regs = [],
          getReg = function(item, cb) {
            var regId = item.type + obj.pad(item.id, 5);
            returnCb = function(registrant) {
              if (!underscore.isEmpty(registrant)) {
                regs.push(registrant);
              }
              console.log("created reg", item.type);
              cb();
            }
            console.log("creating reg", item.type);
            obj.getAttendee(regId, returnCb);
          };

      async.each(attendees, getReg, function(err){
        console.log("got all regs");
        cb(null, regs);
      }); 
    }
  ],function(err, results) {
   console.log("sending regs");
    registrants = results;
    callback(registrants);
  });
};

Registrants.prototype.getCheckedInCount = function(callback) {
  var obj = this;

  async.waterfall([
    function(cb) {
      obj.models.CheckinExhibitorAttendees
      .findAndCountAll({
         where: ["attend = 1"]
      })
      .then(function(result) {
        cb(null, result.count);
      });
    },
    function(count, cb) {
      obj.models.OnsiteAttendees
      .findAndCountAll({
         where: ["attend = 1"]
      })
      .then(function(result) {
        cb(null, count+result.count);
      });
    }
  ],function(err, count) {
    console.log("count:", count);
    callback(count);
  });
};

Registrants.prototype.getAllCheckedInAttendees = function(callback) {
  var obj = this;

  async.waterfall([
    function(cb) {
      obj.models.CheckinExhibitorAttendees
      .findAll({
         where: ["attend = 1"]
      })
      .then(function(results) {
        var regs = [],
            getReg = function(item, cb) {
              var regId = "E" + obj.pad(item.id, 5);
              returnCb = function(registrant) {
                if (!underscore.isEmpty(registrant)) {
                  regs.push(registrant);
                }
                cb();
              }
              obj.getAttendee(regId, returnCb);
            };

        async.each(results, getReg, function(err){
          cb(null, regs);
        });
      });
    },
    function(attendees, cb) {
      obj.models.OnsiteAttendees
      .findAll({
         where: ["attend = 1"]
      })
      .then(function(results) {
        var regs = [],
            getReg = function(item, cb) {
              var regId = "E" + obj.pad(item.id, 5);
              returnCb = function(registrant) {
                if (!underscore.isEmpty(registrant)) {
                  regs.push(registrant);
                }
                cb();
              }
              obj.getAttendee(regId, returnCb);
            };

        async.each(results, getReg, function(err){
          cb(null, attendees.concat(regs));
        });
      });
    }
  ],function(err, attendees) {
    callback(attendees);
  });
};

Registrants.prototype.initRegistrant = function(values, callback) {
  var retCallback = function(registrants) {
        if (callback) callback(registrants);
      },
      obj = this,
      date = new Date();

  async.waterfall([
    function(cb) {
      var record = values.fields;
      record.createdAt = date;
      record.updatedAt = date;
      record.pin = gpc(4);
      if (values.type === "E") {
        record.userId = values.biller.userId;
        record.eventId = values.event.eventId;
        obj.models.CheckinExhibitorAttendees.create(record).then(
          function(registrant) {
            cb(null, registrant);
          }
        ); 
      } else {
        var record = values.fields,
            confirmNum = shortid.generate();
        record.confirmation = confirmNum;
        record.eventId = values.event.eventId;
        obj.models.OnsiteAttendees.create(record).then(
          function(registrant) {
            cb(null, registrant);
          }
        ); 
      }
    },
    function(registrant, cb) {

      var vals = {
          basefee: 0,
          fee: 0,
          paid_amount: 0,
          status: 0,
          event_id: registrant.eventId,
          user_id: registrant.id
        }; 
      obj.models.CheckinEventFees.create(vals).then(
        function(fees) {
          console.log(fees);
          cb(null, registrant);
        }
      );
    }
  ], function (err, result) {
    //console.log(result);
    var regId = values.type+result.id.toString();
    obj.searchAttendees(["registrantid"], regId, 0, 100, false, retCallback);
  });
};

Registrants.prototype.saveCheckTransaction = function(values, callback) {
  var obj = this,
      transAction = values.transaction;
  async.waterfall([
    function(cb){
      obj.models.OnsiteAttendees
      .find({
        where: {
          id: values.registrant.id
        }
      })
      .then(function(biller) {
        cb(null, {biller: biller});
      });
    },
    function(results, cb) {
      var vals = {
        confirmation: biller.confirmation,
        transactionId: moment().format('YYYYDDDDHHMMSS'),
        checkNumber: transAction.checkNumber,
        checkAmount: transAction.amount,
      };
      
      //vals = underscore.extend(vals);
      obj.models.RegistrantTransactions
      .create(vals)
      .then(function(transaction) {
        cb(null, transaction);
      });
    }
  ], function (err, results) {
    callback(results);
  });
};

Registrants.prototype.saveCreditTransaction = function(values, callback) {
  var obj = this,
      transAction = values.transaction;
  async.waterfall([
    function(cb) {
      var vals = {
            confirmation: transAction.customer.id,
            transactionId: transAction.transId,
            checkNumber: null
          };
      
      //vals = underscore.extend(vals);
      obj.models.RegistrantTransactions
      .create(vals)
      .then(function(transaction) {
        cb(null, transaction);
      });
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
  delete vars.product;
  delete vars.customerIP;
  delete vars.entryMethod;;
  
  vars = underscore.extend(vars, data.transaction.batch);
  vars = underscore.extend(vars, data.transaction.order);
  vars = underscore.extend(vars, data.transaction.payment.creditCard);
  vars = underscore.extend(vars, {
            customerId: data.transaction.customer.id,
            email: data.transaction.customer.email
          });
  vars = underscore.extend(vars, {
          invoiceNumber: data.transaction.order.invoiceNumber
        });
  
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
  vars.submitTimeUTC = moment(vars.submitTimeUTC, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD HH:mm:ss');
  vars.submitTimeLocal = moment(vars.submitTimeLocal, 'YYYY-MM-DDTHH:mm:ss.SSS').format('YYYY-MM-DD HH:mm:ss');
  vars.settlementTimeUTC = moment(vars.settlementTimeUTC, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD HH:mm:ss');
  vars.settlementTimeLocal = moment(vars.settlementTimeLocal, 'YYYY-MM-DDTHH:mm:ss.SSS').format('YYYY-MM-DD HH:mm:ss');
  vars.taxExempt = (vars.taxExempt === 'true') ? true : false;
  this.models.Transactions
  .create(vars)
  .then(function(trans) {
    callback({db: trans, credit: data});
  });
};

Registrants.prototype.getFields = function(type, callback) {
  var fields = onsiteFields;
  
  if (type === "E") {
    fields = exhFields; 
  }
  callback(fields);
};

Registrants.prototype.getExhibitorCompanies = function(company, callback) {
  var sql = "SELECT exhibitors.*, 'E' as type, exhibitors.createdAt as register_date, exhibitors.updatedAt as sortDate "+
            "FROM exhibitors "+
            "WHERE exhibitors.organization LIKE :company ORDER BY organization ASC";
  
  this.db.checkin.query(
    sql,
    {
      replacements: {
        company: "%"+company+"%"
      },
      type: Sequelize.QueryTypes.SELECT
    }
  ).then(
    function(exhibitors) {
      callback(exhibitors);
    }
  );
};

Registrants.prototype.getSiteInfo = function(siteId, cb) {
  this.models.Sites.find(
    { 
      where: { 
        siteId: siteId 
      } 
    }
  ).then(
    function(site) {
      cb(site);
    }
  );
};

Registrants.prototype.getBadgeTemplate = function(eventId, cb) {
  this.models.Badges.find({
    where: {
      eventId: eventId
    }
  })
  .then(
    function(badge) {
      cb(badge.template.toString());
    }
  );
}

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
