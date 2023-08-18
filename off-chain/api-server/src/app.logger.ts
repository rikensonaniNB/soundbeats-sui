import { Logger, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppLogger extends Logger {
    private writeStream = null; 
    
    constructor(context: string) {
        super(context);
        this.writeStream = fs.createWriteStream('app.log', {
            flags: 'a', // 'a' means appending (old data will be preserved)
        });
    }
    
    log(message: string) {
        super.log(message);
        this.writeStream.write(`[INFO] ${message}\n`);
    }

    error(message: string, trace?: string) {
        super.error(message, trace);
        this.writeStream.write(`[ERROR] ${message} ${trace || ''}\n`);
    }

    warn(message: string, trace?: string) {
        super.error(message, trace);
        this.writeStream.write(`[WARN] ${message} ${trace || ''}\n`);
    }

    debug(message: string, trace?: string) {
        super.error(message, trace);
        this.writeStream.write(`[DEBUG] ${message} ${trace || ''}\n`);
    }
}