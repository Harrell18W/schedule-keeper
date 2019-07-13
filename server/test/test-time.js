const expect = require('chai').expect;
const it = require('mocha').it;

const time = require('../time');

const dates = [
    {
        date: new Date(1562990400000), // 12:00am
        expectedHr: 'Sat Jul 13 2019 00:00:00',
        expectedSql: '2019-7-13 0:0:0'
    },
    {
        date: new Date(1563076740000), // 11:59pm
        expectedHr: 'Sat Jul 13 2019 23:59:00',
        expectedSql: '2019-7-13 23:59:0'
    },
    {
        date: new Date(1563033600000), // 12:00pm
        expectedHr: 'Sat Jul 13 2019 12:00:00',
        expectedSql: '2019-7-13 12:0:0'
    },
    {
        date: new Date(1562992200000), // 12:30am
        expectedHr: 'Sat Jul 13 2019 00:30:00',
        expectedSql: '2019-7-13 0:30:0'
    }
];

const timeArgs = [
    {
        arg: '000',
        expectedHour: 0,
        expectedMinute: 0
    },
    {
        arg: '959',
        expectedHour: 9,
        expectedMinute: 59
    },
    {
        arg: '0000',
        expectedHour: 0,
        expectedMinute: 0
    },
    {
        arg: '1159',
        expectedHour: 11,
        expectedMinute: 59
    },
    {
        arg: '100am',
        expectedHour: 1,
        expectedMinute: 0
    },
    {
        arg: '100AM',
        expectedHour: 1,
        expectedMinute: 0
    },
    {
        arg: '959pm',
        expectedHour: 9,
        expectedMinute: 59
    },
    {
        arg: '959PM',
        expectedHour: 9,
        expectedMinute: 59
    },
    {
        arg: '1000am',
        expectedHour: 10,
        expectedMinute: 0
    },
    {
        arg: '1000AM',
        expectedHour: 10,
        expectedMinute: 0
    },
    {
        arg: '1159pm',
        expectedHour: 11,
        expectedMinute: 59
    },
    {
        arg: '1159PM',
        expectedHour: 11,
        expectedMinute: 59
    },
    {
        arg: '00:00',
        expectedHour: 0,
        expectedMinute: 0
    },
    {
        arg: '23:59',
        expectedHour: 23,
        expectedMinute: 59
    },
    {
        arg: '1:00am',
        expectedHour: 1,
        expectedMinute: 0
    },
    {
        arg: '1:00AM',
        expectedHour: 1,
        expectedMinute: 0
    },
    {
        arg: '9:59pm',
        expectedHour: 9,
        expectedMinute: 59
    },
    {
        arg: '9:59PM',
        expectedHour: 9,
        expectedMinute: 59
    },
    {
        arg: '10:00am',
        expectedHour: 10,
        expectedMinute: 0
    },
    {
        arg: '10:00AM',
        expectedHour: 10,
        expectedMinute: 0
    },
    {
        arg: '11:59pm',
        expectedHour: 11,
        expectedMinute: 59
    },
    {
        arg: '11:59PM',
        expectedHour: 23,
        expectedMinute: 59
    }
];

it('time.dateDifference', function(done) {
    expect(time.dateDifference(dates[0].date, dates[1].date)).to.equal('23 hours, 59 minutes');
    expect(time.dateDifference(dates[1].date, dates[0].date)).to.equal('23 hours, 59 minutes');
    expect(time.dateDifference(dates[0].date, dates[2].date)).to.equal('12 hours, 0 minutes');
    expect(time.dateDifference(dates[2].date, dates[0].date)).to.equal('12 hours, 0 minutes');
    expect(time.dateDifference(dates[0].date, dates[3].date)).to.equal('30 minutes');
    expect(time.dateDifference(dates[3].date, dates[0].date)).to.equal('30 minutes');
    expect(time.dateDifference(dates[3].date, dates[3].date)).to.equal('0 minutes');
    done();
});

var date;

for (date of dates) {
    it(`time.humanReadableDate: ${date.date.toString()}`, function(done) {
        expect(time.humanReadableDate(date.date)).to.equal(date.expectedHr);
        done();
    });
}

for (date of dates) {
    it(`time.sqlDatetime: ${date.date.toString()}`, function(done) {
        expect(time.sqlDatetime(date.date)).to.equal(date.expectedSql);
        done();
    });
}

for (var timeArg of timeArgs) {
    it(`time.timeParameter: ${timeArg.arg}`, function(done) {
        var result = time.timeParameter(timeArg.arg);
        expect(result.hour).to.equal(timeArg.expectedHour);
        expect(result.minute).to.equal(timeArg.expectedMinute);
        done();
    });
}