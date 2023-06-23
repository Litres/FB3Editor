const fastify = require("fastify")({
    logger: true
})
const cors = require("@fastify/cors")
const fs = require("fs");
const { parseString } = require('xml2js');

function getRefPathById(refsFilePath, refId) {
    return new Promise((resolve, reject) => {
        fs.readFile(refsFilePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            // Parse the XML file
            parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                const node = result.Relationships.Relationship.find(n => n.$.Id === refId);
                if (!node) {
                    reject(`Node with ID ${refId} not found`);
                    return;
                }

                resolve(node.$.Target);
            });
        });
    })
}

fastify.register(cors)

function responseWithFileContents(filePath, reply) {
    fs.readFile(filePath,  "utf-8", (err, data) => {
        if (err) {
            reply.status(404).send(`File not found: ${filePath}`);
        } else {
            reply.type("text/plain").send(data);
        }
    });
}

// returns content of fb3 xml if exists
fastify.get("/pages/get_fb3_body/", (req, reply) => {
    const { art } = req.query;
    if (!art) {
        reply.status(400).send("Please provide an art id");
        return;
    }

    responseWithFileContents(`./fb3_files/${art}/fb3/body.xml`, reply);
});

fastify.get("/pages/get_fb3_meta/", (req, reply) => {
    const { art } = req.query;
    if (!art) {
        reply.status(400).send("Please provide an art id");
        return;
    }

    responseWithFileContents(`./fb3_files/${art}/fb3/description.xml`, reply);
});

fastify.get("/pages/get_fb3_body_rels/", (req, reply) => {
    const { art } = req.query;
    if (!art) {
        reply.status(400).send("Please provide an art id");
        return;
    }

    responseWithFileContents(`./fb3_files/${art}/fb3/_rels/body.xml.rels`, reply);
});

fastify.get("/pages/get_fb3_body_image/", (req, reply) => {
    const { art, image } = req.query;
    if (!art || !image) {
        reply.status(400).send("Please provide an art id");
        return;
    }

    getRefPathById(`./fb3_files/${art}/fb3/_rels/body.xml.rels`, image)
        .then(refPathId => responseWithFileContents(`./fb3_files/${art}/${refPathId}`, reply));
});

fastify.get("/pages/get_fb3_cover_image/", (req, reply) => {
    const { art } = req.query;
    if (!art) {
        reply.status(400).send("Please provide an art id");
        return;
    }

    getRefPathById(`./fb3_files/${art}/fb3/_rels/body.xml.rels`, "img1")
        .then(refPathId => responseWithFileContents(`./fb3_files/${art}/${refPathId}`, reply));
});

// Run the server!
fastify.listen({ port: 3020 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})