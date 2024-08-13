import axios from "axios";
import * as sharp from 'sharp';
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from '@nestjs/common';
import { Buffer } from "buffer";

const TTL = 10800000  // skin cache live time;

@Injectable()
export class MinecraftService {
    constructor(private prisma: PrismaService) { }

    async getUserData(str: string): Promise<Profile | null> {
        /* get user profile by nickname an UUID (this function duplicate function below, idk) */

        const regexp = new RegExp('^[0-9a-fA-F]{32}$');
        let uuid = str.replace('-', '');
        if (!regexp.test(uuid)) {
            const response_uuid = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${uuid}`, { validateStatus: () => true });
            if (!response_uuid || response_uuid?.status !== 200) {
                return null;
            }
            uuid = response_uuid?.data.id;
        }
        const response_skin = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`, { validateStatus: () => true });
        if (!response_skin || response_skin?.status !== 200) {
            return null;
        }
        return response_skin?.data;
    }


    async getUUID(str: string): Promise<string | null> {
        /* get UUID by nickname or validate existing */

        const regexp = new RegExp('^[0-9a-fA-F]{32}$');
        let uuid = str.replace('-', '');
        if (!regexp.test(uuid)) {
            const response_uuid = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${uuid}`, { validateStatus: () => true });
            if (!response_uuid || response_uuid?.status !== 200) {
                return null;
            }
            uuid = response_uuid?.data.id;
        }
        return uuid;
    }


    async generateHead(skinBuffer: Buffer): Promise<Buffer> {
        /* generate head from buffer */

        const head = sharp({
            create: {
                width: 36,
                height: 36,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        }).png();

        const firstLayer = await sharp(skinBuffer)
            .extract({ left: 8, top: 8, width: 8, height: 8 })
            .resize(32, 32, { kernel: sharp.kernel.nearest })
            .png()
            .toBuffer();

        const secondLayer = await sharp(skinBuffer)
            .extract({ left: 40, top: 8, width: 8, height: 8 })
            .resize(36, 36, { kernel: sharp.kernel.nearest })
            .png()
            .toBuffer();
        head.composite([{ input: firstLayer, top: 2, left: 2, blend: 'over' }, { input: secondLayer, top: 0, left: 0, blend: 'over' }]);

        return await head.toBuffer();
    }


    async resolveCollisions(prof: { uuid: string }[]) {
        /* resolve nicknames collisions in data base */

        for (const record of prof) {
            const data = await this.getUserData(record?.uuid);
            if (!data) {
                continue;
            }

            await this.prisma.minecraft.update({
                where: { uuid: data.id },
                data: {
                    default_nick: data.name,
                    nickname: data.name.toLowerCase()
                }
            });
        }
    }


    async updateSkinCache(nickname: string, ignore_cache: boolean = false) {
        /* update skin data in data base */

        const uuid = await this.getUUID(nickname);
        if (!uuid) {
            return null;
        }

        const cache = await this.prisma.minecraft.findFirst({ where: { uuid: uuid } });
        if (cache && cache.expires > new Date().getTime() && !ignore_cache) {
            return cache;
        }

        const fetched_skin_data = await this.getUserData(uuid);
        if (!fetched_skin_data) {
            return null;
        }

        if (cache && cache?.default_nick !== fetched_skin_data.name) {
            await this.prisma.minecraft.update({
                where: { uuid: fetched_skin_data.id },
                data: {
                    default_nick: fetched_skin_data.name,
                    nickname: fetched_skin_data.name.toLowerCase()
                }
            })
        }

        const nicks = await this.prisma.minecraft.findMany({ where: { nickname: fetched_skin_data?.name.toLowerCase() } });
        if (nicks.length > 1) {
            await this.resolveCollisions(nicks);
        }

        const textures = atob(fetched_skin_data.properties[0].value);
        const json_textures = JSON.parse(textures) as EncodedResponse;
        const skin_response = await axios.get(json_textures.textures.SKIN.url, {
            responseType: 'arraybuffer'
        });
        const skin_buff = Buffer.from(skin_response.data, 'binary');
        const head = await this.generateHead(skin_buff);

        let cape_b64 = "";
        if (json_textures.textures.CAPE) {
            const skin_response = await axios.get(json_textures.textures?.CAPE.url, {
                responseType: 'arraybuffer'
            });
            cape_b64 = Buffer.from(skin_response.data, 'binary').toString("base64");
        }
        const updated_data = await this.prisma.minecraft.upsert({
            where: { uuid: fetched_skin_data.id },
            create: {
                uuid: fetched_skin_data.id,
                nickname: fetched_skin_data.name.toLowerCase(),
                default_nick: fetched_skin_data.name,
                expires: new Date().getTime() + TTL,
                data: skin_buff.toString("base64"),
                data_cape: cape_b64,
                data_head: head.toString("base64"),
                slim: json_textures.textures.SKIN.metadata?.model === "slim"
            },
            update: {
                nickname: fetched_skin_data.name.toLowerCase(),
                default_nick: fetched_skin_data.name,
                expires: new Date().getTime() + TTL,
                data: skin_buff.toString("base64"),
                data_cape: cape_b64,
                data_head: head.toString("base64"),
                slim: json_textures.textures.SKIN.metadata?.model === "slim"
            }
        });
        return updated_data;
    }


    async searchNicks({ fragment, take, page }: SearchParams): Promise<SearchNicks | null> {
        /* search nicks in data base by provided fragment */

        if (fragment.length < 3) {
            return null;
        }
        const filter_rule = { OR: [{ nickname: { contains: fragment } }] }
        const cache = await this.prisma.minecraft.findMany({
            where: filter_rule,
            orderBy: { default_nick: "asc" },
            take: Math.min(take, 100), skip: take * page
        });
        if (!cache || cache.length === 0) {
            return null;
        }
        const count: number = await this.prisma.minecraft.count({ where: filter_rule });
        const records_list: SearchUnit[] = cache.map((nick) => {
            return { name: nick.default_nick, uuid: nick.uuid, head: nick.data_head };
        });
        if (!count) return null;
        return {
            status: "success",
            requestedFragment: fragment,
            data: records_list,
            total_count: count,
            next_page: page + 1
        };
    }
}