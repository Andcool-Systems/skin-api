import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';


@Injectable()
export class SttService {
    private static async cropImage(input: sharp.Sharp, left: number, top: number, width: number, height: number) {
        return input.clone().extract({ left, top, width, height }).toBuffer();
    }

    private static async composeImage(images: Buffer[], positions: { left: number, top: number }[], width: number, height: number) {
        const canvas = sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        const overlays = images.map((image, index) => ({ input: image, left: positions[index].left, top: positions[index].top }));
        return canvas.composite(overlays).toBuffer();
    }

    private async head(skin: sharp.Sharp, uol?: boolean) {
        let head = sharp({
            create: {
                width: 8,
                height: 8,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        }).png();
        const part1 = await skin.clone().extract({ left: 9, top: 8, width: 6, height: 1 }).toBuffer();
        const part2 = await skin.clone().extract({ left: 8, top: 9, width: 8, height: 7 }).toBuffer();

        head = head.composite([
            { input: part1, left: 1, top: 0 },
            { input: part2, left: 0, top: 1 }
        ]);

        if (uol) {
            const l21 = await skin.clone().extract({ left: 40, top: 8, width: 8, height: 1 }).toBuffer();
            const l22 = await skin.clone().extract({ left: 40, top: 9, width: 8, height: 7 }).toBuffer();

            head = head.composite([
                { input: l21, left: 0, top: 0 },
                { input: l21, left: 0, top: 0, blend: 'over' },
                { input: l22, left: 0, top: 1 },
                { input: l22, left: 0, top: 1, blend: 'over' }
            ]);
        }
        return await head.png().toBuffer();
    }

    private async body(skin: sharp.Sharp, uol?: boolean) {
        let body = sharp({
            create: {
                width: 8,
                height: 4,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        const part1 = await skin.clone().extract({ left: 20, top: 21, width: 8, height: 1 }).toBuffer();
        const part2 = await skin.clone().extract({ left: 20, top: 23, width: 8, height: 1 }).toBuffer();
        const part3 = await skin.clone().extract({ left: 20, top: 29, width: 8, height: 1 }).toBuffer();
        const part4 = await skin.clone().extract({ left: 20, top: 31, width: 8, height: 1 }).toBuffer();

        body = body.composite([
            { input: part1, left: 0, top: 0 },
            { input: part2, left: 0, top: 1 },
            { input: part3, left: 0, top: 2 },
            { input: part4, left: 0, top: 3 }
        ]);

        if (uol) {
            const l21 = await skin.clone().extract({ left: 20, top: 37, width: 8, height: 1 }).toBuffer();
            const l22 = await skin.clone().extract({ left: 20, top: 39, width: 8, height: 1 }).toBuffer();
            const l23 = await skin.clone().extract({ left: 20, top: 45, width: 8, height: 1 }).toBuffer();
            const l24 = await skin.clone().extract({ left: 20, top: 47, width: 8, height: 1 }).toBuffer();

            body = body.composite([
                { input: l21, left: 0, top: 0 },
                { input: l21, left: 0, top: 0, blend: 'over' },
                { input: l22, left: 0, top: 1 },
                { input: l22, left: 0, top: 1, blend: 'over' },
                { input: l23, left: 0, top: 2 },
                { input: l23, left: 0, top: 2, blend: 'over' },
                { input: l24, left: 0, top: 3 },
                { input: l24, left: 0, top: 3, blend: 'over' }
            ]);
        }

        return await body.png().toBuffer();
    }

    async legs(skin: sharp.Sharp, uol?: boolean) {
        let legs = sharp({
            create: {
                width: 6,
                height: 3,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        const part1 = await skin.clone().extract({ left: 4, top: 20, width: 1, height: 2 }).toBuffer();
        const part2 = await skin.clone().extract({ left: 6, top: 20, width: 2, height: 2 }).toBuffer();
        const part3 = await skin.clone().extract({ left: 20, top: 52, width: 2, height: 2 }).toBuffer();
        const part4 = await skin.clone().extract({ left: 23, top: 52, width: 1, height: 2 }).toBuffer();
        const part5 = await skin.clone().extract({ left: 4, top: 31, width: 1, height: 1 }).toBuffer();
        const part6 = await skin.clone().extract({ left: 7, top: 31, width: 1, height: 1 }).toBuffer();
        const part7 = await skin.clone().extract({ left: 20, top: 63, width: 1, height: 1 }).toBuffer();
        const part8 = await skin.clone().extract({ left: 23, top: 63, width: 1, height: 1 }).toBuffer();

        legs = legs.composite([
            { input: part1, left: 0, top: 0 },
            { input: part2, left: 1, top: 0 },
            { input: part3, left: 3, top: 0 },
            { input: part4, left: 5, top: 0 },
            { input: part5, left: 1, top: 2 },
            { input: part6, left: 2, top: 2 },
            { input: part7, left: 3, top: 2 },
            { input: part8, left: 4, top: 2 }
        ]);

        if (uol) {
            const l21 = await skin.clone().extract({ left: 4, top: 36, width: 1, height: 2 }).toBuffer();
            const l22 = await skin.clone().extract({ left: 6, top: 36, width: 2, height: 2 }).toBuffer();
            const l23 = await skin.clone().extract({ left: 4, top: 52, width: 2, height: 2 }).toBuffer();
            const l24 = await skin.clone().extract({ left: 7, top: 52, width: 1, height: 2 }).toBuffer();
            const l25 = await skin.clone().extract({ left: 4, top: 47, width: 1, height: 1 }).toBuffer();
            const l26 = await skin.clone().extract({ left: 7, top: 47, width: 1, height: 1 }).toBuffer();
            const l27 = await skin.clone().extract({ left: 4, top: 63, width: 1, height: 1 }).toBuffer();
            const l28 = await skin.clone().extract({ left: 7, top: 63, width: 1, height: 1 }).toBuffer();

            legs = legs.composite([
                { input: l21, left: 0, top: 0 },
                { input: l21, left: 0, top: 0, blend: 'over' },
                { input: l22, left: 1, top: 0 },
                { input: l22, left: 1, top: 0, blend: 'over' },
                { input: l23, left: 3, top: 0 },
                { input: l23, left: 3, top: 0, blend: 'over' },
                { input: l24, left: 5, top: 0 },
                { input: l24, left: 5, top: 0, blend: 'over' },
                { input: l25, left: 1, top: 2 },
                { input: l25, left: 1, top: 2, blend: 'over' },
                { input: l26, left: 2, top: 2 },
                { input: l26, left: 2, top: 2, blend: 'over' },
                { input: l27, left: 3, top: 2 },
                { input: l27, left: 3, top: 2, blend: 'over' },
                { input: l28, left: 4, top: 2 },
                { input: l28, left: 4, top: 2, blend: 'over' }
            ]);
        }
        return await legs.png().toBuffer();
    }

    async arms(skin: sharp.Sharp, uol?: boolean) {
        let arms = sharp({
            create: {
                width: 14,
                height: 3,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        const part1 = await skin.clone().extract({ left: 37, top: 52, width: 3, height: 2 })
            .rotate(90)
            .toBuffer();
        const part2 = await skin.clone().extract({ left: 44, top: 20, width: 3, height: 2 })
            .rotate(-90)
            .toBuffer();
        const part3 = await skin.clone().extract({ left: 39, top: 63, width: 1, height: 1 }).toBuffer();
        const part4 = await skin.clone().extract({ left: 36, top: 63, width: 1, height: 1 }).toBuffer();
        const part5 = await skin.clone().extract({ left: 44, top: 31, width: 1, height: 1 }).toBuffer();
        const part6 = await skin.clone().extract({ left: 47, top: 31, width: 1, height: 1 }).toBuffer();

        arms = arms.composite([
            { input: part1, left: 11, top: 0 },
            { input: part2, left: 1, top: 0 },
            { input: part3, left: 13, top: 0 },
            { input: part4, left: 13, top: 1 },
            { input: part5, left: 0, top: 0 },
            { input: part6, left: 0, top: 1 }
        ]);

        if (uol) {
            const l21 = await skin.clone().extract({ left: 53, top: 52, width: 3, height: 2 })
                .rotate(90)
                .toBuffer();
            const l22 = await skin.clone().extract({ left: 44, top: 36, width: 3, height: 2 })
                .rotate(-90)
                .toBuffer();
            const l23 = await skin.clone().extract({ left: 55, top: 63, width: 1, height: 1 }).toBuffer();
            const l24 = await skin.clone().extract({ left: 52, top: 63, width: 1, height: 1 }).toBuffer();
            const l25 = await skin.clone().extract({ left: 44, top: 47, width: 1, height: 1 }).toBuffer();
            const l26 = await skin.clone().extract({ left: 47, top: 47, width: 1, height: 1 }).toBuffer();

            arms = arms.composite([
                { input: l21, left: 11, top: 0 },
                { input: l22, left: 1, top: 0 },
                { input: l23, left: 13, top: 0 },
                { input: l24, left: 13, top: 1 },
                { input: l25, left: 0, top: 0 },
                { input: l26, left: 0, top: 1 }
            ]);
        }
        return await arms.png().toBuffer();
    }

    async makeTotem(skinBuffer: Buffer) {
        const skin = sharp(skinBuffer).ensureAlpha();
        let canvas = sharp({
            create: {
                width: 16,
                height: 16,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        const head = await this.head(skin);
        const body = await this.body(skin);
        const legs = await this.legs(skin);
        const arms = await this.arms(skin);
        canvas = canvas.composite([
            { input: arms, left: 1, top: 8 },
            { input: legs, left: 5, top: 13 },
            { input: body, left: 4, top: 9 },
            { input: head, left: 4, top: 1 }
        ]);

        return await canvas.png().toBuffer();
    }
}