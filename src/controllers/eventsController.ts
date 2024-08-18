import { Controller, Get, Path, Route } from "tsoa";
import { redis } from "../db";

export interface Event {
    id: number;
    data: string;
}

@Route("api/events")
export class EventsController extends Controller {
    @Get("{channel}/{lastEventId}")
    public async getChaintip(
        @Path() channel: string,
        @Path() lastEventId: number
    ): Promise<Event[]> {
        const events = await redis.zrangebyscore(`evt:${channel}`, lastEventId, '+inf', 'WITHSCORES')
        const results: Event[] = []
        for (let i = 0; i < events.length; i += 2) {
            const data = events[i]
            const id = parseInt(events[i + 1])
            results.push({id, data})
        }
        return results
    }
}