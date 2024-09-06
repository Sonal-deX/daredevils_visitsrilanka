const validate = (schema, sources) => (req, res, next) => {
    const data = {};

    // Merge data from all sources
    for (const source of sources) {
        Object.assign(data, req[source]);
    }

    // Validate the merged data against the schema
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    console.log("ok");
    // Call next middleware or route handler
    next();
};

module.exports = validate;