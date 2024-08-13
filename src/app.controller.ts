import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
    constructor() { }

    @Get("/")
    async skin() {
        /* root endpoint */

        return { statusCode: 200, message: 'Hello from skin API!' }
    }
}