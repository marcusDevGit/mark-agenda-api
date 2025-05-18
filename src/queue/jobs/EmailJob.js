import sendEmail from '../../utils/mailer.js';

class EmailJob {
    constructor(options) {
        this.options = options;
        this.retries = 0;
        this.maxRetries = 3;
    }
    async execute() {
        return await sendEmail(this.options);
    }
}

export default EmailJob;
