const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const async = require('async');
const glob = require('glob');
const moment = require('moment');
const underscore = require('lodash');
const shortid = require('shortid32');
const gpc = require('generate-pincode');
const knex = require('knex');
const { map, props } = require('awaity');

const isLetter = (str) => {
  return str.length === 1 && str.match(/[a-z]/i);
};
const exhFields = [
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
];
const exhBillerFields = [
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
];
const onsiteFields = [
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
];
const onsiteBillerFields = [
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
];
const types = ['Text','Select','TextArea','Checkbox','Select','Text','Text','Text','Text'];


Registrants = function(options) {
  this.db = {};
  this.models = {};
  this.options = options;
  if (this.options) {
    this.initialize(options);
  }
};

Registrants.prototype.initialize = function (options) {
  //console.log(this.options);

  this.knex = knex({
    client: 'mysql2',
    connection: {
      host : this.options.host || "localhost",
      user : this.options.username,
      password : this.options.password,
      database : this.options.database,
      port: this.options.port || 3306,
    },
  });
};

Registrants.prototype.getAttendee = async function (registrantId) {
  const regType = registrantId.slice(0,1).toUpperCase();
  const regId = parseInt(registrantId.slice(1), 10);
  const data = await this.getRegistrant(regId, regType, {});

  return data;
};

Registrants.prototype.getRegistrant = async function (regId, regType, options) {
  regType = regType || "G";
  let retVal = {};
  const self = this;
  console.log("Get Registrant", regId, regType);
  const member = await this.knex.select()
    .from('onsiteAttendees')
    .where({ id: regId })
    .catch(e => console.log('db', 'database error', e));

  if (member && member.length) {
    let attendee = await self.createOnsiteModel(member[0], options, regType);
    const prefix = (attendee.exhibitor) ? 'E' : 'G';
    retVal = Object.assign(
      {},
      attendee,
      {
        registrantId:prefix + self.pad(attendee.id, 5),
        paddedRegId: prefix + self.pad(attendee.id, 5),
        displayId: prefix + "-" + attendee.id,
        badgePrefix: prefix
      }
    );
  }
  return retVal;
};

Registrants.prototype.createOnsiteModel = async function(attendee, options, type) {
  const self = this;
  //attendee.memberId = attendee.groupMemberId;
  //attendee.userId = attendee.groupUserId;
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

  attendee.event = await self.getEvent(attendee);
  const values = await self.getRegTransactions(attendee);
  attendee.transactions = values.transactions;
  attendee.paid = values.paid;

  if (attendee.exhibitor) {
    attendee.biller = await self.getExhBiller(attendee);
  } else {
    attendee.biller = await self.getBiller(attendee);
  }
  
  attendee.linked = await self.getAdditionalAttendees(attendee);

  if ("siteid" in attendee || "siteId" in attendee) {
    const siteid = ("siteid" in attendee) ? attendee.siteid : attendee.siteId;
    attendee.site = await self.getSiteInfo(siteid);
  }
  /*
  const badges = await map(
    attendee.badgeSchema,
    async (field) => {
      attendee[field.class] = attendee.fields[field.id] || "";
      return field;
    }
  );
  */
  console.log('return attendee');
  return attendee;
};

Registrants.prototype.getRegTransactions = async function(attendee, callback) {
  const self = this;
  let paid = false;
  let transactions = [];
  const trans = await this.knex.from('registrantTransactions')
    .where({
      confirmation: attendee.confirmation
    })
    .orderBy('createdAt', 'DESC')
    .catch(e => console.log('db', 'database error', e));

  transactions = await map(
    trans,
    async (transaction) => {
      let retVal;
      let _trans = transaction;
      if (transaction.transactionId) {
        const result = await this.knex.from('transactions')
          .where({
            transId: transaction.transactionId
          })
          .limit(1)
          .catch(e => console.log('db', 'database error', e));
        if (result.length) {
          _trans = Object.assign({}, _trans, result[0]);
          paid = (_trans.responseCode === 1) ? true : paid;
          retVal = _trans;
        }
          
      } else {
        retVal = _trans;
        paid = (_trans.checkNumber) ? true : paid;
      }

      return retVal;
    }
  );

  return {
    transactions: transactions,
    paid: paid
  };
};

Registrants.prototype.getPayments = async function(attendee) {
  const payments = await this.knex.select()
    .from('eventFees')
    .where({ 
      userId: attendee.biller.userId,
      eventId: attendee.eventId,
     })
    .catch(e => console.log('db', 'database error', e));
  
  return payments;
  /*
  async.reduce(payments, [], function(payment, item, cb){
    const due = parseInt(item.due, 10);
    //console.log("paid", due);
    payment.push(item.toJSON());
    cb(null, payment);
  }, function(err, result){
    callback(result);
  });
  */

};

Registrants.prototype.getCreditTrans = async function(attendee) {
  let paid = false;
  const trans = await this.knex.select()
    .from('transactions')
    .where({ invoiceNumber: attendee.biller.confirmNum })
    .catch(e => console.log('db', 'database error', e));

  trans.forEach(t => {
    paid = (t.settlementState === "settledSuccessfully") ? true : paid;
  });
  return {
    transactions: result,
    paid: paid
  };
};

Registrants.prototype.getBiller = async function(attendee) {
  const self = this;
  let biller;
  if (attendee.transactions.length && attendee.transactions[0]) {
    biller = await this.knex.select()
    .from('onsiteAttendees')
    .where({ confirmation: attendee.transactions[0].customerId })
    .catch(e => console.log('db', 'database error', e));
  } else {
    biller = await this.knex.select()
    .from('onsiteAttendees')
    .where({ confirmation: attendee.confirmation })
    .catch(e => console.log('db', 'database error', e));
  }
  return (biller && biller.length) ? biller[0] : null;
};

Registrants.prototype.getExhBiller = async function(attendee, callback) {
  const self = this;
  let biller = await this.knex.select()
  .from('exhibitors')
  .where({ id: attendee.userId })
  .catch(e => console.log('db', 'database error', e));
  return (biller && biller.length) ? biller[0] : null;
};

Registrants.prototype.getEvent = async function(attendee, callback) {
  const event = await this.knex.select()
    .from('events')
    .where({ eventId: attendee.eventId })
    .catch(e => console.log('db', 'database error', e));

  return (event && event.length) ? event[0] : null;
};


Registrants.prototype.getExhibitorAttendeesNumber = async function(attendee) {
  const record = await this.knex.select()
    .from('exhibitorAttendeeNumber')
    .where({ 
      userId: attendee.userId,
      eventId: attendee.eventId,
     })
    .catch(e => console.log('db', 'database error', e));
  
  return record;
};

Registrants.prototype.getExhibitorAttendees = async function(attendee) {
  const self = this;
  let attendees = await this.knex.from('exhibitorAttendees')
    .where({
      userId: attendee.userId,
      eventId: attendee.eventId,
    })
    .whereNot({
      id: attendee.id  
    })
    .catch(e => console.log('db', 'database error', e));
  const convertToJson = async (item) => {
    const prefix = (attendee.exhibitor) ? 'E' : 'G';
    let regId = prefix + self.pad(item.id, 5);
    let reg = item;
    console.log("Linked Id", regId);
    reg.memberId = reg.id;
    reg.registrantId = regId;
    reg.paid = attendee.paid;
    return reg;
  };
  const results = await map(attendees, convertToJson);
  return results;
};

Registrants.prototype.getAdditionalAttendees = async function(attendee, callback) {
  const self = this;
  let attendees;
  
  if (attendee.exhibitor) {
    attendees = await this.knex.from('onsiteAttendees')
    .where({
      confirmation: attendee.confirmation,
    })
    .whereNot({
      id: attendee.id,
    })
    .catch(e => console.log('db', 'database error', e));
  } else {
    attendees = await this.knex.from('onsiteAttendees')
      .where({
        groupConfirm: attendee.groupConfirm,
      })
      .whereNot({
        id: attendee.id,
      })
      .whereNotNull('groupConfirm')
      .catch(e => console.log('db', 'database error', e));
  } 


  const convertToJson = async function(item) {
    const prefix = (attendee.exhibitor) ? 'E' : 'G';
    let reg = item;
    const displayId = prefix + "-" + reg.id;
    const regId = prefix + self.pad(reg.id, 5);
    reg.memberId = reg.groupMemberId;
    reg.userId = reg.groupUserId;
    reg.eventId = reg.eventId;
    reg.registrantId = regId;
    reg.displayId = displayId;
    reg.paid = attendee.paid;
    return reg;
  };
  const results = await map(
    attendees,
    convertToJson
  );

  return results;
};

Registrants.prototype.updateAttendee = async function(registrantId, values) {
  const self = this;
  const regType = registrantId.slice(0,1);
  const regId = parseInt(registrantId.slice(1), 10);
  let attendee = await this.knex('onsiteAttendees')
    .where({ id: regId })
    .update(values.fields)
    .then(
      data => self.knex('onsiteAttendees').where({ id: regId }),
    )
    .catch(e => console.log('db', 'database error', e));
  const results = await this.getAttendee(registrantId);
  return results;
};

Registrants.prototype.getRange = function(beginId, endId, type, callback) {
  beginId = parseInt(beginId,10);
  endId = parseInt(endId,10);
  const ids = this.numberArray(endId-beginId,beginId);
  const registrants = [];
  const self = this;
  const getReg = (item, cb) => {
    const regId = type + self.pad(item, 5);
    returnCb = function(registrant) {
      if (!underscore.isEmpty(registrant)) {
        registrants.push(registrant);
      }
      cb();
    }
    self.getAttendee(regId, returnCb);
  };

  async.eachSeries(ids, getReg, function(err){
    callback(registrants);
  });
};

Registrants.prototype.searchAttendees2 = async function(filters, page, limit, sorting, exhibitors) {    
  let sql = "";
  let self = this;
  page = page || 0;
  limit = limit || 100;
  let start = page * limit;
  let vars = [];
  sorting = (sorting && sorting.length) ? sorting : [{columnName: 'createdAt', direction: 'desc'}]; 
  const records = await this.knex.select(
    'onsiteAttendees.id',
    'onsiteAttendees.exhibitor',
    'onsiteAttendees.createdAt',
    'onsiteAttendees.confirmation',
  )
  .from('onsiteAttendees')
  .where((builder) => {
    let count = 0;
    filters
      .forEach((search, index) => {
        let field = search.columnName;
        let operator = '=';
        let value = search.value;
        
        if (search.columnName === "company") {
          field = "organization";
          operator = 'LIKE';
          value = `%${value}%`;
        } else if (search.columnName === "displayId") {
          field = "id";
          value = value.replace('-', '');
          if (isLetter(value.charAt(0))) {
            value = parseInt(value.slice(1), 10);
          }
        } else {
          operator = 'LIKE';
          value = `%${value}%`;
        }

        if (index === 0) {
          builder.where(field, operator, value);
        } else {
          builder.andWhere(field, operator, value);
        }
        count++;
    });

    if (exhibitors && count === 0) {
      builder.where('exhibitor', '=', 1);
    } else if (exhibitors) {
      builder.andWhere('exhibitor', '=', 1);
    }
  })
  .modify((queryBuilder) => {
    if (sorting && sorting.length) {
      sorting
        .forEach((sort) => {
          queryBuilder.orderBy(sort.columnName, sort.direction);
        });
    }
  })
  .limit(limit)
  .offset(start)
  .catch(e => console.log('db', 'database error', e));

  let regs = [];
  const getReg = async (item) => {
    const prefix = (item.exhibitor) ? 'E' : 'G'
    const regId = `${prefix}${self.pad(item.id, 5)}`;
    const attendee = await self.getAttendee(regId);
    return attendee;
  };

  const results = await map(records, getReg); 
  return results;
};

Registrants.prototype.getCheckedInCount = async function() {
  const self = this;
  const total = await this.knex('onsiteAttendees')
    .count('id as total')
    .catch(e => console.log('db', 'database error', e));
  const checkedIn = await this.knex('onsiteAttendees')
    .count('id as total')
    .where({ attend: 1  })
    .catch(e => console.log('db', 'database error', e));

  return {
    totalRegistrants: total[0].total,
    checkedIn: checkedIn[0].total,
  };
};

Registrants.prototype.getAllCheckedInAttendees = async function() {
  const self = this;
  const onsiteAttendees = await this.knex.select()
    .from('onsiteAttendees')
    .where({ attend: 1  })
    .catch(e => console.log('db', 'database error', e));
  const onsiteCheckedIn = await map(
    onsiteAttendees,
    async (attendee) => {
      const regId = "G" + self.pad(attendee.id, 5);
      return await self.getAttendee(regId);
    }
  );

  return onsiteCheckedIn;
};

Registrants.prototype.initRegistrant = async function(values) {
  const self = this;
  const date = new moment().format('YYYY-MM-DD HH:mm:ss');
  let registrant;

  const record = values.fields;
  const type = (record.exhibitor) ? 'E' : 'G';
  record.createdAt = date;
  record.updatedAt = date;
  record.pin = gpc(4);
  record.confirmation = shortid.generate();
  record.groupConfirm = (record.groupConfirm) ? record.groupConfirm : shortid.generate();
  record.eventId = values.event.eventId;
  registrant = await this.knex('onsiteAttendees')
    .insert(record)
    .then(
      data => self.knex('onsiteAttendees').where({ id: data[0] }),
    )
    .catch(e => console.log('db', 'database error', e));
  

  if (registrant.length) {
    registrant = registrant[0];
  }

  const regId = `${type}${self.pad(registrant.id, 5)}`;
  return await self.getAttendee(regId);
};

Registrants.prototype.saveCheckTransaction = async function(values) {
  const self = this;
  const transAction = values.transaction;
  const biller = await this.knex.select()
    .from('onsiteAttendees')
    .where({ id: values.registrant.id  })
    .catch(e => console.log('db', 'database error', e));
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  const vals = {
    confirmation: biller[0].confirmation,
    type: 'check',
    journalNumber: shortid.generate(),
    transactionId: moment().format('YYYYDDDDHHmmss'),
    checkNumber: transAction.number,
    amount: transAction.amount,
    createdAt: now,
    updatedAt: now,
  };

  const record = await this.knex('registrantTransactions')
    .insert(vals)
    .then(
      data => self.knex('registrantTransactions').where({ id: data[0] }),
    )
    .catch(e => console.log('db', 'database error', e));

    const trans = {
      transId: vals.transactionId,
      submitTimeUTC: now,
      submitTimeLocal: now,
      transactionType: 'check',
      transactionStatus: 'settledSuccessfully',
      responseCode: null,
      responseReasonCode: null,
      responseReasonDescription: null,
      authCode: gpc(4),
      AVSResponse: null,
      cardCodeResponse: null,
      batchId: null,
      settlementTimeUTC: now,
      settlementTimeLocal: now,
      invoiceNumber: values.registrant.confirmation,
      description: values.registrant.registrantId,
      customerId: values.registrant.confirmation,
      authAmount: transAction.amount,
      settleAmount: transAction.amount,
      cardNumber: transAction.number,
      cardType: null,
      email: biller[0].email,
    };
  
  const result = await this.knex('transactions')
    .insert(trans)
    .then(
      data => self.knex('registrantTransactions').where({ id: data[0] }),
    )
    .catch(e => console.log('db', 'database error', e));

  return result;
};

Registrants.prototype.saveCreditTransaction = async function(values) {
  const self = this;
  const transAction = values.transaction;
  const vals = {
    confirmation: transAction.customer.id,
    transactionId: transAction.transId,
    checkNumber: null
  };

  const record = await this.knex('registrantTransactions')
    .insert(vals)
    .then(
      data => self.knex('registrantTransactions').where({ id: data[0] }),
    )
    .catch(e => console.log('db', 'database error', e));

  return record;
};

Registrants.prototype.saveAuthorizeNetTransaction = async function(data) {
  const self = this;
  let vars = Object.assign({}, data.transaction);
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
  
  vars = Object.assign({}, vars, data.transaction.batch);
  vars = Object.assign({}, vars, data.transaction.order);
  vars = Object.assign({}, vars, data.transaction.payment.creditCard);
  vars = Object.assign({}, vars, {
    customerId: data.transaction.customer.id,
    email: data.transaction.customer.email
  });
  vars = Object.assign({}, vars, {
    invoiceNumber: data.transaction.order.invoiceNumber
  });
  
  vars = Object.assign({}, vars, {
    billToFirstName: data.transaction.billTo.firstName,
    billToLastName: data.transaction.billTo.lastName,
    billToAdddatas: data.transaction.billTo.adddatas,
    billToCity: data.transaction.billTo.city,
    billToState: data.transaction.billTo.state,
    billToZip: data.transaction.billTo.zip,
    billToPhoneNumber: data.transaction.billTo.phoneNumber
  });
  if ("shipTo" in data.transaction) {
    vars = Object.assign({}, vars, {
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

  const record = await this.knex('transactions')
    .insert(vars)
    .then(
      data => self.knex('transactions').where({ id: data[0] }),
    )
    .catch(e => console.log('db', 'database error', e));

  return record;
};

Registrants.prototype.getFields = function(type) {
  const fields = onsiteFields;
  
  if (type === "E") {
    fields = exhFields; 
  }
  return fields;
};

Registrants.prototype.getExhibitorCompanies = async function(company) {
  const record = await this.knex.select()
    .from('exhibitors')
    .where('exhibitors.organization', 'LIKE', `%${company}%`)
    .catch(e => console.log('db', 'database error', e));

  return record;
};

Registrants.prototype.getSiteInfo = async function(siteId) {
  const site = await this.knex.select()
    .from('siteIds')
    .where({ siteId: siteId  })
    .catch(e => console.log('db', 'database error', e));

  return site;
};

Registrants.prototype.getBadgeTemplate = async function(eventId) {
  const record = await this.knex.select()
    .from('badges')
    .where({ 
      eventId: eventId,
    })
    .catch(e => console.log('db', 'database error', e));

  return (record.length) ? record[0].template : null;
}

Registrants.prototype.pad = function(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

Registrants.prototype.shallowCopy = function(oldObj) {
  let newObj = {};
  for(let i in oldObj) {
    if (oldself.hasOwnProperty(i)) {
      newObj[i] = oldObj[i];
    }
  }
  return newObj;
};

Registrants.prototype.numberArray = function(a, b, c) {
  c = [];
  while (a--) {
    c[a] = a + b;
  }
  return c;
};

module.exports.init = function(opts) {
  return new Registrants(opts);
};
