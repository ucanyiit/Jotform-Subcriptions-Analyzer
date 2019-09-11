export const getAllPaymentsToDateFromSubscription = (lastDate, subscription) => {
    const payments = subscription.payments;
    let totalPayment = 0;
    for (i in payments) {
        if (isSmallerDate(payments[i], lastDate)) totalPayment += subscription.price;
        else break;
    }
    return totalPayment;
}

export const getAllPaymentsToDateFromSubscriptions = (lastDate, subscriptions) => {
    let totalPayment = 0;
    for (j in subscriptions) {
        for (i in subscriptions[j].payments) {
            if (isSmallerDate(subscriptions[j].payments[i], lastDate)) totalPayment += subscriptions[j].price;
            else break;
        }
    }
    return totalPayment;
}

export const filterSubmission = (submission, type) => {
    if (type == getPaymentFromSubmission(submission).paymentType) return 1;
    return 0;
}

export const filterForm = (form, type) => {
    for (submission of form.submissions) if (type == getPaymentFromSubmission(submission).paymentType) return 1;
    return 0;
}

export const getPaymentFromSubmission = (submission) => {
    let payment = false;
    if (typeof submission === 'string') return false;
    else for (let i in submission.answers) {
        if (submission.answers[i].paymentType) {
            let answer = submission.answers[i].answer
            for (a in answer) if (a == '1') payment = JSON.parse(answer[a]);
            let time = submission.created_at;
            time = time.split(' ');
            payment.date = getDateObject(time[0]);
            payment.time = time[1];
            payment.submission_id = submission.id;
            payment.form_id = submission.form_id;
            if (submission.answers[i].paymentType == 'subscription') payment.payments = getPaymentList(payment);
        }
    }
    return payment
}

export const getSubmissionText = (submission) => {
    if (submission.payment.paymentType == 'subscription') return (`${submission.payment.period} ${submission.payment.price} ${submission.payment.currency}`);
    if (submission.payment.paymentType == 'product') return (`${submission.payment.price * submission.payment.quantity} ${submission.payment.currency}`);
    else return (`No payment`)
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
    const lastDate = { year: 2030, month: 1, day: 1 }, nowDate = { year: 2019, month: 9, day: 9 };
    let date = { ...subscription.date }, increment = {}, payments = [];
    if (subscription.period == 'Yearly') increment = { year: 1 };
    if (subscription.period == 'Monthly') increment = { month: 1 };
    if (subscription.period == 'Weekly') increment = { day: 7 };
    if (subscription.period == 'Daily') increment = { day: 1 };
    while (isSmallerDate(date, lastDate)) {
        if (isSmallerDate(nowDate, date)) payments.push({ ...date });
        date = incrementDate(date, increment);
    }
    return payments;
}

export const getDateObject = (date) => {
    date = date.split('-');
    return { year: parseInt(date[0]), month: parseInt(date[1]), day: parseInt(date[2]) };
}