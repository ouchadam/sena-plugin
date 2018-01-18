module.exports = (database, htmlRepository) => {
    return {
        tickRate: 3,
        tick: () => {
            return database.child(`/v2/plugin_instances_data/`)
                .once('value')
                .then(snapshot => {
                    const instancesData = snapshot.val()
                    const refreshedUrls = Object.keys(instancesData)
                        .map(key => {
                            const currentUrl = instancesData[key]
                            return htmlRepository.refreshUrl(currentUrl)
                            .then(refreshedUrl => {
                                return database.child(`/v2/plugin_instances_data/${key}`)
                                    .set(refreshedUrl)
                            })
                        })
                    return Promise.all(refreshedUrls)
                })
        }
    }
}