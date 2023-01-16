export default class DSWImporter {
    constructor() {
        this._events = []
        this._origin = null
        this._knowledgeModel = null
    }

    init(options = null) {
        options = options || DSWImporter.defaultOptions
        return new Promise((resolve, reject) => {
            if (!window.opener) {
                reject(new Error('window.opener not set'))
                return
            }

            window.opener.postMessage({ type: 'ready' }, '*')
            window.addEventListener('message', (event) => {
                if (event.data.type === 'ready') {
                    this._origin = event.origin
                    this._knowledgeModel = JSON.parse(event.data.knowledgeModel)

                    if (options.windowSize) {
                        this._resizeWindow(options.windowSize)
                    }

                    if (options.useWizardStyles && event.data.styleUrl) {
                        this._loadWizardStyles(event.data.styleUrl, () => {
                            resolve()
                        })
                    } else {
                        resolve()
                    }
                }
            }, false)
        })
    }

    _resizeWindow({ width, height }) {
        window.resizeTo(Math.min(width, screen.width), Math.min(height, screen.height))
        window.moveTo(screen.width / 2 - width / 2, screen.height / 2  - height / 2)
    }

    _loadWizardStyles(styleUrl, cb) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.onload = cb
        link.setAttribute('href', styleUrl)
        document.getElementsByTagName('head')[0].appendChild(link)
    }

    setReply(path, value) {
        this._events.push({
            type: Array.isArray(value) ? 'ReplyList' : 'ReplyString',
            path: path.join('.'),
            value: value
        })
    }

    setIntegrationReply(path, value, id) {
        this._events.push({
            type: 'ReplyIntegration',
            path: path.join('.'),
            value: value,
            id: id
        })
    }

    addItem(path) {
        const uuid = DSWImporter.createUUID()
        this._events.push({
            type: 'AddItem',
            path: path.join('.'),
            uuid: uuid
        })
        return uuid
    }

    send() {
        window.opener.postMessage({
            type: 'Import',
            events: this._events
        }, this._origin)
        window.close()
    }

    getAnswerUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.answers, key, value)
    }

    getChapterUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.chapters, key, value)
    }

    getChoiceUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.choices, key, value)
    }

    getExpertUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.experts, key, value)
    }

    getIntegrationUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.integrations, key, value)
    }

    getMetricUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.metrics, key, value)
    }

    getPhaseUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.phase, key, value)
    }

    getQuestionUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.questions, key, value)
    }

    getReferenceUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.reference, key, value)
    }

    getTagUuidByAnnotation(key, value) {
        return this._getEntityUuidByAnnotation(this._knowledgeModel.entities.tags, key, value)
    }

    _getEntityUuidByAnnotation(entities, key, value) {
        for (const [uuid, question] of Object.entries(this._knowledgeModel.entities.questions)) {
            if (question.annotations.some((annotation) => annotation.key === key && annotation.value == value)) {
                return uuid
            }
        }
        return null
    }

    getFirstChapterUuid() {
        if (this._knowledgeModel.chapterUuids.length === 0) return null
        return this._knowledgeModel.chapterUuids[0]
    }

    static get defaultOptions() {
        return {
            useWizardStyles: true,
            windowSize: null
        }
    }

    static createUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}
