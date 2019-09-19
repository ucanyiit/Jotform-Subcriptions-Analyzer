import moment from 'moment';

const getCompareableDateString = (payment) => {
    if (typeof payment.month != 'string' && payment.month < 10) payment.month = "0" + payment.month;
    if (typeof payment.day != 'string' && payment.day < 10) payment.day = "0" + payment.day;
    return payment.year + " " + payment.month + " " + payment.day;
}

const getTimeString = (time) => {
    return moment(Date.parse(time)).format("MMM Do YYYY");
}

export const getMonthlyData = (form, year) => {
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i in form.payments) if (form.payments[i].date.year == year) data[parseInt(form.payments[i].date.month, 10)-1] += parseFloat(form.payments[i].total);
    return data;
}

export const getAllPaymentsToDateFromSubscription = (lastDate, subscription) => {
    const payments = subscription.payments, now = moment().format('YYYY MM DD');
    let totalPayment = 0;
    for (i in payments) {
        if (!isSmallerDate(payments[i], lastDate)) break;
        else if (now <= getCompareableDateString(payments[i])) totalPayment += subscription.price;
    }
    return totalPayment;
}

export const getAllPaymentsToDateFromSubscriptions = (lastDate, subscriptions) => {
    let totalPayment = 0;
    for (j in subscriptions) totalPayment += getAllPaymentsToDateFromSubscription(lastDate, subscriptions[j]);
    return totalPayment;
}

export const getLastXPaymentsFromSubscriptions = (paymentNumber, subscriptions) => {
    const color = {
        'Yearly': '#bf0c0c',
        'Quarterly': '#fa8900',
        'Bi-Monthly': '#ffc600',
        'Monthly': '#9748a8',
        'Bi-Weekly': '#2bb3f3',
        'Weekly': '#47bc00',
        'Daily': '#d9e1e2',
    }

    let payments = [], lastXPayments = [], now = moment().format('YYYY MM DD');

    for (i in subscriptions) for (j in subscriptions[i].payments) if (now <= getCompareableDateString(subscriptions[i].payments[j])) payments.push({
        date: getCompareableDateString(subscriptions[i].payments[j]),
        time: getTimeString(getCompareableDateString(subscriptions[i].payments[j])),
        title: getPaymentText(subscriptions[i]),
        description: subscriptions[i].info.firstname + " " + subscriptions[i].info.lastname,
        circleColor: color[subscriptions[i].period],
    })
    payments.sort((b, a) => { return b.date > a.date });
    for (let i = 0; i < paymentNumber; i++) lastXPayments.push({ time: payments[i].time, title: payments[i].title, description: payments[i].description, circleColor: payments[i].circleColor });
    return lastXPayments;
}

export const filterSubmission = (submission, type) => {
    if (type == getPaymentFromSubmission(submission).paymentType) return 1;
    return 0;
}

export const filterForm = (form, type) => {
    for (submission of form.submissions) if (filterSubmission(submission, type)) return 1;
    return 0;
}

export const getPaymentFromSubmission = (submission) => {
    let payment = false;
    if (typeof submission === 'string') return false;
    else for (let i in submission.answers) {
        if (submission.answers[i].paymentType) {
            let answer = submission.answers[i].answer, time = submission.created_at.split(' ');
            let tmp = { date: getDateObject(time[0]), time: time[1], submission_id: submission.id, form_id: submission.form_id, paymentType: submission.answers[i].paymentType, info: JSON.parse(answer.paymentArray) }
            if (submission.answers[i].paymentType == 'subscription') {
                for (a in answer) if (a == '1') payment = { ...tmp, ...JSON.parse(answer[a]) };
                payment.payments = getPaymentList(payment);
            }
            else if (submission.answers[i].paymentType == 'product') {
                let products = [];
                for (a in answer) if (JSON.parse(answer[a]).price) products.push(JSON.parse(answer[a]));
                payment = { ...tmp, currency: products[0].currency, products, total: JSON.parse(answer["paymentArray"]).total };
            }
        }
    }
    return payment;
}

export const getPaymentText = (payment) => {
    if (payment.paymentType == 'subscription') return (`${payment.period} ${payment.price} ${payment.currency}`);
    if (payment.paymentType == 'product') return (`${payment.total} ${payment.currency}`);
    else return (`No payment`);
}

const incrementDate = (date, increment) => {
    let months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (date.year % 4 == 0) months[2] = 29;
    if (increment.year) date.year += increment.year;
    if (increment.month) date.month += increment.month;
    if (increment.day) date.day += increment.day;
    while (date.month > 12) {
        date.month -= 12;
        date.year += 1;
        if (date.year % 4 == 0) months[2] = 29;
        else months[2] = 28;
    }
    while (date.day > months[date.month]) {
        date.day -= months[date.month];
        date.month += 1;
        while (date.month > 12) {
            date.month -= 12;
            date.year += 1;
            if (date.year % 4 == 0) months[2] = 29;
            else months[2] = 28;
        }
    }
    return date
}

const isSmallerDate = (date1, date2) => {
    if (date1.year < date2.year) return 1;
    if (date1.year == date2.year && date1.month < date2.month) return 1;
    if (date1.year == date2.year && date1.month == date2.month && date1.day < date2.day) return 1;
    return 0;
}

const getPaymentList = (subscription) => {
    const lastDate = { year: 2030, month: 1, day: 1 };
    let date = { ...subscription.date }, increment = {}, payments = [];
    if (subscription.period == 'Yearly') increment = { year: 1 };
    if (subscription.period == 'Quarterly') increment = { month: 3 };
    if (subscription.period == 'Bi-Monthly') increment = { month: 2 };
    if (subscription.period == 'Monthly') increment = { month: 1 };
    if (subscription.period == 'Bi-Weekly') increment = { day: 14 };
    if (subscription.period == 'Weekly') increment = { day: 7 };
    if (subscription.period == 'Daily') increment = { day: 1 };
    while (isSmallerDate(date, lastDate)) {
        payments.push({ ...date });
        date = incrementDate(date, increment);
    }
    return payments;
}

export const getDateObject = (date) => {
    date = date.split('-');
    return { year: parseInt(date[0]), month: parseInt(date[1]), day: parseInt(date[2]) };
}