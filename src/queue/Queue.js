class Queue {
    constructor() {
        this.jobs = [];
        this.processing = false;
    }
    add(job) {
        this.jobs.push(job);
        if (!this.processing) {
            this.process();
        }
        return this;
    }

    async process() {
        if (this.jobs.length === 0) {
            this.processing = false;
            return;
        }

        this.processing = true;
        const job = this.jobs.shift();

        try {
            await job.execute();
        } catch (error) {
            console.error('Error processing job:', error);
            if (job.retries < job.maxRetries) {
                job.retries++;
                this.jobs.push(job);
            }
        }
        //process next job
        setTimeout(() =>
            this.process(), 0);
    }
}

export default new Queue();
