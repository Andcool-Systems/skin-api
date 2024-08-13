# A Fragment of the Backend of the PPLBandage Site, Responsible for Receiving, Processing and Storing Minecraft Skins

## Getting Started
1. Download the repository from GitHub and extract it to your desired location.
2. Open a terminal and navigate to the project folder.
3. Install all necessary dependencies by running the command `npm i`.
4. Set up the database by executing the commands `npx prisma generate` and `npx prisma db push`.
5. Build the project by running the command `npm run build`.
6. Finally, start the project with the command `npm run start`.

Once the project is running, the API will be accessible on port `8080`.

## API Documentation

### `GET /skin/<nickname/UUID>?cape=<boolean>`  
Retrieves a skin by nickname or UUID.

The standard API response, where the query parameter `cape` is not specified or set to `false`, will return only the skin as an image with the header `Content-Type: image/png`.

If the query parameter is set to `true`, the API will return a JSON response containing information about the skin (and its type) and cape in `base64` format.

**Example JSON response:**  
```json
{
  "data": {
    "skin": {
      "data": "string",
      "slim": "boolean"
  },
    "cape": "string"
  }
}
```

- `skin.data` contains the skin in `base64` format  
- `skin.slim` contains a boolean value indicating the skin type  
- `cape` contains the cape in `base64` format  

> **Note:**
> If the requested player does not have a cape, the `cape` field will be an empty string.

---
### `GET /head/<nickname/UUID>`  
**Returns the player's head as an image**  
`Content-Type: image/png`

The skin for this request will be retrieved from the cache if it is valid. To speed up processing of such requests, the API separately caches the player's head for more efficient reuse.

---
### `GET /head/<nickname/UUID>/svg?pixel_width=50`  
**Returns the player's head as an image in `svg` format**  
`Content-Type: image/png`  
The query parameter `pixel_width` determines the size of each pixel in the final head image. The default value is `50`.

> **Note:**
> The result of this endpoint is not separately cached but generated from the cached skin.

---
### `GET /cape/<nickname/UUID>`  
**Returns the player's cape as an image**  
`Content-Type: image/png`

The cape, just like the skin, is cached separately for each player, ensuring a faster API response.

> **Note:**
> If the player does not have a cape or it is not set, the API will return a `404` error with the body `{ message: 'No cape on this profile' }`.

---
### `GET /search/<fragment>?take=<number>&page=<number>`  
**Retrieves a list of skins whose profile nicknames contain the requested fragment**  
`Content-Type: application/json`

This endpoint searches all cached skins for nicknames containing the requested fragment.  
**Description of Query Parameters:**
| Parameter | Description                  |  Expected Type   | Default Value |
| --------- | ---------------------------- | :--------------: | :-----------: |
| take      | Number of nicknames per page | number (integer) |      20       |
| page      | Page number                  | number (integer) |       0       |

**Example JSON response:**  
```json
{
  "status": "success",
  "requestedFragment": "string",
  "data": [
    {
      "name": "string",
      "uuid": "string",
      "head": "string"
    }
  ],
  "total_count": 1,
  "next_page": 1
}
```

- `requestedFragment` Contains the requested fragment. Always matches `<fragment>` in the URL.
- `data` Contains the list of matching nicknames.
  - `name` Contains the profile's nickname.
  - `uuid` Contains the profile's UUID (without hyphens).
  - `head` Contains the player's head image in `base64` format.
- `total_count` Contains the total number of matches.
- `next_page` Indicates the next page number. If the current page is the last one, this field will contain the current page number.