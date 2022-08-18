# DSW Importer SDK

[![Node.js Package CI](https://github.com/ds-wizard/dsw-importer-sdk/workflows/Node.js%20Package/badge.svg)](https://github.com/ds-wizard/dsw-importer-sdk/actions)
[![npm version](https://badge.fury.io/js/@ds-wizard%2Fimporter-sdk.svg)](https://badge.fury.io/js/@ds-wizard%2Fimporter-sdk)
[![License](https://img.shields.io/github/license/ds-wizard/dsw-importer-sdk)](LICENSE)


## Instalation

```bash
$ npm install @ds-wizard/importer-sdk
```

You can then import the library:

```javascript
var DSWImporter = require('@ds-wizard/importer-sdk')
```

or using ES6:

```javascript
import DSWImporter from '@ds-wizard/importer-sdk'
```

Alternatively, you can just import the library using script tag and CDN:

```html
<script src="https://unpkg.com/@ds-wizard/importer-sdk/lib/index.js"></script>
```

`DSWImporter` will then become globally available.

## Usage

On the page that will serve your importer, you need to initialize it first. Then you can use call other methods to create the import data. When you have everything ready, you send the replies back to DSW.

```javascript
const importer = new DSWImporter()
importer.init()
    .then(() => {
        // Question path is a list of uuid strings
        const questionPath = [ /* ... */ ]

        // You can set a reply using the question path and a value
        // The value is either a string for value question or answer/choice 
        // uuid for options/multichoice question
        importer.setReply(questionPath, 'value')

        // For list question you can add an item and then use the itemUuid
        // to build the path for questions in the item
        const itemUuid = importer.addItem(questionPath)
        importer.setReply(
            [...questionPath, itemUuid, itemQuestionUuid],
            'Lee Harris'
        )

        // Send the replies back to DSW
        // this will also close the window
        importer.send()
    })
    .catch(error => {
        console.error(error)
    })
```


## License

This project is licensed under the Apache License v2.0 - see the
[LICENSE](LICENSE) file for more details.