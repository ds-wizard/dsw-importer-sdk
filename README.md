# DSW Importer SDK

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

Or using ES6:

```javascript
import DSWImporter from '@ds-wizard/importer-sdk'
```

Alternatively, you can import the library using the script tag and CDN:

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
        // Question path is a list of UUID strings
        const questionPath = [ /* ... */ ]

        // You can set a reply using the question path and a value
        // The value is either a string for a value question or answer/choice 
        // UUID for options/multichoice question
        importer.setReply(questionPath, 'value')

        // For a list question, you can add an item and then use the item's UUID
        // to build the path for questions in the item
        const itemUuid = importer.addItem(questionPath)
        importer.setReply(
            [...questionPath, itemUuid, itemQuestionUuid],
            'Lee Harris'
        )

        // For an integration question, you can either use setReply to have
        // a plain answer or you can use setIntegrationReply to set the link 
        // as well so that the response will behave as if it was from the 
        // integration
        importer.setIntegrationReply(
            questionPath,
            'Czech Technical University in Prague',
            'https://ror.org/03kqpb082'
        )

        // Send the replies back to DSW
        // this will also close the window
        importer.send()
    })
    .catch(error => {
        console.error(error)
    })
```

### UUIDs by Annotations

Instead of hardcoding the UUID of a specific entity (chapter, question,...) you can find it using the annotations defined in the knowledge model. For example, if you have a question with the following annotation:

```
Key:   rdfType
Value: http://purl.org/dc/terms/title
```

You can find its UUID using the importer API:

```javascript
const questionUuid = importer.getQuestionUuidByAnnotation('rdfType', 'http://purl.org/dc/terms/title')
```

### Importer Options

You can pass some extra importer options to the init function. If you don't, the default options will be used.

```javascript
const importer = new DSWImporter()

importer.init({
    // options go here
})
```

| Option | Value | Default | Description |
| --- | --- | --- |--- |
| `useWizardStyle` | `true`/`false` | `true` | If you want to use the stylesheet from the client that opened the importer (see below). |
| `windowSize` | `{ width: 300, height: 200 }` | `null` | Use this to resize the importer window to the desired size when it is open. |


#### Wizard Styles

DSW Client uses [Bootstrap](https://getbootstrap.com) with customizations, such as changing a primary color. You can load the styles in the importer to match the look and feel of the client. Then you can use all the Bootstrap classes and variables from the client that opened the importer.

For example, the following CSS code will set the body background color to the primary color of the client that opened the importer:

```css
body {
    background-color: var(--bs-primary);
}
```

This way, you can create reusable importers across different DSW instances while keeping the look and feel of those instances.

## Compatibility

| Importer SDK Version | DSW Version from | DSW Version to |
| --- | --- | --- |
| `0.3.0` | `3.20` | `latest` |
| `0.2.0` | `3.18` | `3.19` |
| `0.1.0` | `3.15` | `3.17` |

## License

This project is licensed under the Apache License v2.0 - see the
[LICENSE](LICENSE) file for more details.